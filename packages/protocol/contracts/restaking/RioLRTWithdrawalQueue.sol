// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {UUPSUpgradeable} from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {IRioLRTOperatorDelegator} from 'contracts/interfaces/IRioLRTOperatorDelegator.sol';
import {IDelegationManager} from 'contracts/interfaces/eigenlayer/IDelegationManager.sol';
import {IRioLRTWithdrawalQueue} from 'contracts/interfaces/IRioLRTWithdrawalQueue.sol';
import {SafeCast} from '@openzeppelin/contracts/utils/math/SafeCast.sol';
import {FixedPointMathLib} from '@solady/utils/FixedPointMathLib.sol';
import {RioLRTCore} from 'contracts/restaking/base/RioLRTCore.sol';
import {ETH_ADDRESS} from 'contracts/utils/Constants.sol';
import {Asset} from 'contracts/utils/Asset.sol';

contract RioLRTWithdrawalQueue is IRioLRTWithdrawalQueue, OwnableUpgradeable, UUPSUpgradeable, RioLRTCore {
    using FixedPointMathLib for *;
    using Asset for address;

    /// @notice Current asset withdrawal epochs. Incoming withdrawals are included
    /// in the current epoch.
    mapping(address asset => uint256 epoch) internal currentEpochsByAsset;

    /// @notice The amount of assets owed to users in a given epoch, as well as the state
    /// of the epoch's withdrawals.
    mapping(address asset => mapping(uint256 epoch => EpochWithdrawals withdrawals)) internal epochWithdrawalsByAsset;

    /// @notice The total amount of shares owed to withdrawers across all epochs for `asset`,
    /// excluding the current epoch.
    mapping(address asset => uint256 sharesOwed) internal sharesOwedByAsset;

    /// @param issuer_ The LRT issuer that's authorized to deploy this contract.
    constructor(address issuer_) RioLRTCore(issuer_) {}

    /// @notice Initializes the contract.
    /// @param initialOwner The initial owner of the contract.
    /// @param token_ The address of the liquid restaking token.
    function initialize(address initialOwner, address token_) external initializer {
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
        __RioLRTCore_init(token_);
    }

    /// @notice Retrieve the current withdrawal epoch for a given asset.
    /// @param asset The asset to retrieve the current epoch for.
    function getCurrentEpoch(address asset) public view returns (uint256) {
        return currentEpochsByAsset[asset];
    }

    /// @notice Get the amount of restaking tokens requested for withdrawal in the current `epoch` for `asset`.
    /// @param asset The address of the withdrawal asset.
    function getRestakingTokensInCurrentEpoch(address asset) external view returns (uint256 amountIn) {
        amountIn = _getEpochWithdrawals(asset, getCurrentEpoch(asset)).amountIn;
    }

    /// @notice Get the total amount of shares owed to withdrawers across all epochs for `asset`.
    /// @param asset The address of the withdrawal asset.
    function getTotalSharesOwed(address asset) external view returns (uint256) {
        return sharesOwedByAsset[asset];
    }

    /// @notice Retrieve withdrawal epoch information for a given asset and epoch.
    /// @param asset The withdrawal asset.
    /// @param epoch The epoch for which to retrieve the information.
    function getEpochWithdrawalSummary(address asset, uint256 epoch)
        external
        view
        returns (EpochWithdrawalSummary memory)
    {
        EpochWithdrawals storage withdrawals = _getEpochWithdrawals(asset, epoch);
        return EpochWithdrawalSummary({
            settled: withdrawals.settled,
            amountIn: withdrawals.amountIn,
            assetsReceived: withdrawals.assetsReceived,
            sharesOutstanding: withdrawals.sharesOutstanding,
            amountToBurnAtSettlement: withdrawals.amountToBurnAtSettlement,
            aggregateRoot: withdrawals.aggregateRoot
        });
    }

    /// @notice Retrieve a user's withdrawal information for a given asset and epoch.
    /// @param asset The withdrawal asset.
    /// @param epoch The epoch for which to retrieve the information.
    /// @param user The address of the user for which to retrieve the information.
    function getUserWithdrawalSummary(address asset, uint256 epoch, address user)
        external
        view
        returns (UserWithdrawalSummary memory)
    {
        return _getEpochWithdrawals(asset, epoch).users[user];
    }

    /// @notice Withdraws all `asset` owed to the caller in a given epoch.
    /// @param request The asset claim request.
    function claimWithdrawalsForEpoch(ClaimRequest calldata request) public returns (uint256 amountOut) {
        address withdrawer = msg.sender;

        EpochWithdrawals storage epochWithdrawals = _getEpochWithdrawals(request.asset, request.epoch);
        if (!epochWithdrawals.settled) revert EPOCH_NOT_SETTLED();

        UserWithdrawalSummary memory userSummary = epochWithdrawals.users[withdrawer];
        if (userSummary.amountIn == 0) revert NOTHING_TO_CLAIM();
        if (userSummary.claimed) revert WITHDRAWAL_ALREADY_CLAIMED();

        epochWithdrawals.users[withdrawer].claimed = true;

        amountOut = userSummary.amountIn.mulDiv(epochWithdrawals.assetsReceived, epochWithdrawals.amountIn);
        request.asset.transferTo(withdrawer, amountOut);

        emit WithdrawalsClaimedForEpoch(request.epoch, request.asset, withdrawer, amountOut);
    }

    /// @notice Withdraws owed assets owed to the caller from many withdrawal requests.
    /// @param requests The withdrawal claim request.
    function claimWithdrawalsForManyEpochs(ClaimRequest[] calldata requests)
        external
        returns (uint256[] memory amountsOut)
    {
        uint256 requestLength = requests.length;

        amountsOut = new uint256[](requestLength);
        for (uint256 i; i < requestLength; ++i) {
            amountsOut[i] = claimWithdrawalsForEpoch(requests[i]);
        }
    }

    /// @notice Queue withdrawal of `asset` to `withdrawer` in the current epoch. The withdrawal
    /// can be claimed as the underlying asset by the withdrawer once the current epoch is settled.
    /// @param withdrawer The address requesting the withdrawal.
    /// @param asset The address of the asset being withdrawn.
    /// @param amountIn The amount of restaking tokens to queue for withdrawal.
    function queueWithdrawal(address withdrawer, address asset, uint256 amountIn) external onlyCoordinator {
        if (amountIn == 0) revert NO_AMOUNT_IN();

        uint256 currentEpoch = getCurrentEpoch(asset);
        uint120 amountIn_ = SafeCast.toUint120(amountIn);

        EpochWithdrawals storage epochWithdrawals = _getEpochWithdrawals(asset, currentEpoch);
        epochWithdrawals.amountIn += amountIn_;

        UserWithdrawalSummary storage userSummary = epochWithdrawals.users[withdrawer];
        userSummary.amountIn += amountIn_;

        emit WithdrawalQueued(currentEpoch, asset, withdrawer, amountIn);
    }

    /// @notice Settle the current epoch for `asset` using `assetsReceived` from the deposit pool.
    /// @param asset The address of the withdrawal asset.
    /// @param assetsReceived The amount of assets received to settle the epoch.
    function settleCurrentEpochFromDepositPool(address asset, uint256 assetsReceived) external onlyCoordinator {
        uint256 currentEpoch = getCurrentEpoch(asset);

        EpochWithdrawals storage epochWithdrawals = _getEpochWithdrawals(asset, currentEpoch);
        if (epochWithdrawals.amountIn == 0) revert NO_WITHDRAWALS_IN_EPOCH();
        if (epochWithdrawals.settled) revert EPOCH_ALREADY_SETTLED();

        epochWithdrawals.settled = true;
        epochWithdrawals.assetsReceived = SafeCast.toUint120(assetsReceived);

        token.burn(epochWithdrawals.amountIn);
        currentEpochsByAsset[asset] += 1;

        emit EpochSettledFromDepositPool(currentEpoch, asset, assetsReceived);
    }

    /// @notice Queues the current epoch for `asset` settlement via EigenLayer and record
    /// the amount of assets received from the deposit pool.
    /// @param asset The address of the withdrawal asset.
    /// @param assetsReceived The amount of assets received from the deposit pool.
    /// @param shareValueOfAssetsReceived The value of the assets received in EigenLayer shares.
    /// @param totalShareValueAtRebalance The total epoch share value at the time of rebalance.
    /// @param aggregateRoot The aggregate root of the queued EigenLayer withdrawals.
    function queueCurrentEpochSettlementFromEigenLayer(
        address asset,
        uint256 assetsReceived,
        uint256 shareValueOfAssetsReceived,
        uint256 totalShareValueAtRebalance,
        bytes32 aggregateRoot
    ) external onlyCoordinator {
        if (aggregateRoot == bytes32(0)) revert INVALID_AGGREGATE_WITHDRAWAL_ROOT();

        uint256 currentEpoch = getCurrentEpoch(asset);

        EpochWithdrawals storage epochWithdrawals = _getEpochWithdrawals(asset, currentEpoch);
        if (epochWithdrawals.aggregateRoot != bytes32(0)) revert WITHDRAWALS_ALREADY_QUEUED_FOR_EPOCH();
        if (epochWithdrawals.amountIn == 0) revert NO_WITHDRAWALS_IN_EPOCH();
        if (epochWithdrawals.settled) revert EPOCH_ALREADY_SETTLED();

        uint256 restakingTokensToBurn;
        // forgefmt: disable-next-item
        if (assetsReceived > 0) {
            epochWithdrawals.assetsReceived = SafeCast.toUint120(assetsReceived);

            restakingTokensToBurn = epochWithdrawals.amountIn.mulWad(
                shareValueOfAssetsReceived.divWad(totalShareValueAtRebalance)
            );
            token.burn(restakingTokensToBurn);

            epochWithdrawals.amountToBurnAtSettlement = SafeCast.toUint120(
                epochWithdrawals.amountIn - restakingTokensToBurn
            );
        }
        epochWithdrawals.sharesOutstanding = SafeCast.toUint120(totalShareValueAtRebalance - shareValueOfAssetsReceived);

        sharesOwedByAsset[asset] += epochWithdrawals.sharesOutstanding;
        epochWithdrawals.aggregateRoot = aggregateRoot;

        currentEpochsByAsset[asset] += 1;

        emit EpochQueuedForSettlementFromEigenLayer(
            currentEpoch,
            asset,
            assetsReceived,
            shareValueOfAssetsReceived,
            totalShareValueAtRebalance,
            restakingTokensToBurn,
            aggregateRoot
        );
    }

    /// @notice Settle `epoch` for `asset` using `queuedWithdrawals` from EigenLayer.
    /// @param asset The address of the withdrawal asset.
    /// @param epoch The epoch to settle.
    /// @param queuedWithdrawals The queued withdrawals from EigenLayer.
    /// @param middlewareTimesIndexes The middleware times indexes for the queued withdrawals.
    function completeEpochSettlementFromEigenLayer(
        address asset,
        uint256 epoch,
        IDelegationManager.Withdrawal[] calldata queuedWithdrawals,
        uint256[] calldata middlewareTimesIndexes
    ) external {
        EpochWithdrawals storage epochWithdrawals = _getEpochWithdrawals(asset, epoch);
        if (epochWithdrawals.amountIn == 0) revert NO_WITHDRAWALS_IN_EPOCH();
        if (epochWithdrawals.settled) revert EPOCH_ALREADY_SETTLED();
        if (epochWithdrawals.aggregateRoot == bytes32(0)) revert WITHDRAWALS_NOT_QUEUED_FOR_EPOCH();

        uint256 queuedWithdrawalCount = queuedWithdrawals.length;
        if (queuedWithdrawalCount != middlewareTimesIndexes.length) revert INVALID_MIDDLEWARE_TIMES_INDEXES_LENGTH();

        epochWithdrawals.settled = true;

        // If not ETH, decrease the shares held for the asset. The decrease in queued ETH is
        // handled on a per-operator basis below.
        if (asset != ETH_ADDRESS) {
            assetRegistry().decreaseSharesHeldForAsset(asset, epochWithdrawals.sharesOutstanding);
        }
        token.burn(epochWithdrawals.amountToBurnAtSettlement);

        uint256 balanceBefore = asset.getSelfBalance();

        bytes32[] memory roots = new bytes32[](queuedWithdrawalCount);

        IDelegationManager.Withdrawal memory queuedWithdrawal;
        for (uint256 i; i < queuedWithdrawalCount; ++i) {
            queuedWithdrawal = queuedWithdrawals[i];
            roots[i] = IRioLRTOperatorDelegator(queuedWithdrawal.staker).completeQueuedWithdrawal(
                queuedWithdrawal, asset, middlewareTimesIndexes[i]
            );
        }

        sharesOwedByAsset[asset] -= epochWithdrawals.sharesOutstanding;
        epochWithdrawals.sharesOutstanding = 0; // Zero out the outstanding shares.

        if (epochWithdrawals.aggregateRoot != keccak256(abi.encode(roots))) {
            revert INVALID_AGGREGATE_WITHDRAWAL_ROOT();
        }

        uint256 assetsReceived = asset.getSelfBalance() - balanceBefore;
        epochWithdrawals.assetsReceived += SafeCast.toUint120(assetsReceived);

        emit EpochSettledFromEigenLayer(epoch, asset, assetsReceived);
    }

    /// @dev Receives ETH for withdrawals.
    receive() external payable {}

    function _getEpochWithdrawals(address asset, uint256 epoch) internal view returns (EpochWithdrawals storage) {
        return epochWithdrawalsByAsset[asset][epoch];
    }

    /// @dev Allows the owner to upgrade the withdrawal queue implementation.
    /// @param newImplementation The implementation to upgrade to.
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
