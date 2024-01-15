// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {UUPSUpgradeable} from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {IDelegationManager} from 'contracts/interfaces/eigenlayer/IDelegationManager.sol';
import {IRioLRTWithdrawalQueue} from 'contracts/interfaces/IRioLRTWithdrawalQueue.sol';
import {SafeCast} from '@openzeppelin/contracts/utils/math/SafeCast.sol';
import {FixedPointMathLib} from '@solady/utils/FixedPointMathLib.sol';
import {IRioLRT} from 'contracts/interfaces/IRioLRT.sol';
import {Array} from 'contracts/utils/Array.sol';
import {Asset} from 'contracts/utils/Asset.sol';

contract RioLRTWithdrawalQueue is IRioLRTWithdrawalQueue, OwnableUpgradeable, UUPSUpgradeable {
    using FixedPointMathLib for *;
    using Asset for address;
    using Array for *;

    /// @notice The primary delegation contract for EigenLayer.
    IDelegationManager public immutable delegationManager;

    /// @notice The liquid restaking token (LRT).
    IRioLRT public restakingToken;

    /// @notice The liquid restaking token coordinator.
    address public coordinator;

    /// @notice Current asset withdrawal epochs. Incoming withdrawals are included
    /// in the current epoch, which will be processed by the asset manager.
    mapping(address asset => uint256 epoch) internal currentEpochsByAsset;

    /// @notice The amount of assets owed to users in a given epoch, as well as the state
    /// of the epoch's withdrawals.
    mapping(address asset => mapping(uint256 epoch => EpochWithdrawals withdrawals)) internal epochWithdrawalsByAsset;

    /// @notice Require that the caller is the LRT's coordinator.
    modifier onlyCoordinator() {
        if (msg.sender != coordinator) revert ONLY_COORDINATOR();
        _;
    }

    /// @param delegationManager_ The EigenLayer delegation manager.
    constructor(address delegationManager_) {
        _disableInitializers();

        delegationManager = IDelegationManager(delegationManager_);
    }

    /// @notice Initializes the contract.
    /// @param initialOwner The initial owner of the contract.
    /// @param restakingToken_ The liquid restaking token.
    /// @param coordinator_ The liquid restaking token coordinator.
    function initialize(address initialOwner, address restakingToken_, address coordinator_) external initializer {
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
        
        restakingToken = IRioLRT(restakingToken_);

        coordinator = coordinator_;
    }

    /// @notice Retrieve the current withdrawal epoch for a given asset.
    /// @param asset The asset to retrieve the current epoch for.
    function getCurrentEpoch(address asset) public view returns (uint256) {
        return currentEpochsByAsset[asset];
    }

    /// @notice Get the amount of strategy shares owed to withdrawers in the current `epoch` for `asset`.
    /// @param asset The withdrawal asset.
    function getSharesOwedInCurrentEpoch(address asset) external view returns (uint256 sharesOwed) {
        sharesOwed = _getEpochWithdrawals(asset, getCurrentEpoch(asset)).sharesOwed;
    }

    /// @notice Retrieve withdrawal epoch information for a given asset and epoch.
    /// @param asset The withdrawal asset.
    /// @param epoch The epoch for which to retrieve the information.
    function getEpochWithdrawalSummary(address asset, uint256 epoch) external view returns (EpochWithdrawalSummary memory) {
        EpochWithdrawals storage withdrawals = _getEpochWithdrawals(asset, epoch);
        return EpochWithdrawalSummary({
            settled: withdrawals.settled,
            assetsReceived: withdrawals.assetsReceived,
            shareValueOfAssetsReceived: withdrawals.shareValueOfAssetsReceived,
            sharesOwed: withdrawals.sharesOwed,
            amountToBurnAtSettlement: withdrawals.amountToBurnAtSettlement,
            aggregateRoot: withdrawals.aggregateRoot
        });
    }

    /// @notice Retrieve a user's withdrawal information for a given asset and epoch.
    /// @param asset The withdrawal asset.
    /// @param epoch The epoch for which to retrieve the information.
    /// @param user The address of the user for which to retrieve the information.
    function getUserWithdrawalSummary(address asset, uint256 epoch, address user) external view returns (UserWithdrawalSummary memory) {
        return _getEpochWithdrawals(asset, epoch).users[user];
    }

    /// @notice Withdraws all `asset` owed to the caller in a given epoch.
    /// @param request The asset claim request.
    function claimWithdrawalsForEpoch(ClaimRequest calldata request) public returns (uint256 amountOut) {
        address withdrawer = msg.sender;
        
        EpochWithdrawals storage epochWithdrawals = _getEpochWithdrawals(request.asset, request.epoch);
        if (!epochWithdrawals.settled) revert EPOCH_NOT_SETTLED();

        UserWithdrawalSummary memory userSummary = epochWithdrawals.users[withdrawer];
        if (userSummary.sharesOwed == 0) revert NO_SHARES_OWED_IN_EPOCH();
        if (userSummary.claimed) revert WITHDRAWAL_ALREADY_CLAIMED();

        epochWithdrawals.users[withdrawer].claimed = true;

        amountOut = userSummary.sharesOwed.mulDiv(
            epochWithdrawals.assetsReceived, epochWithdrawals.sharesOwed
        );
        request.asset.transferTo(withdrawer, amountOut);

        emit WithdrawalsClaimedForEpoch(request.epoch, request.asset, withdrawer, amountOut);
    }

    /// @notice Withdraws owed assets owed to the caller from many withdrawal requests.
    /// @param requests The withdrawal claim request.
    function claimWithdrawalsForManyEpochs(ClaimRequest[] calldata requests) external returns (uint256[] memory amountsOut) {
        uint256 requestLength = requests.length;

        amountsOut = new uint256[](requestLength);
        for (uint256 i; i < requestLength;) {
            amountsOut[i] = claimWithdrawalsForEpoch(requests[i]);

            unchecked {
                ++i;
            }
        }
    }

    /// @notice Queue `sharesOwed` of `asset` to `withdrawer` in the current epoch. These owed shares
    /// can be claimed as the underlying asset by the withdrawer once the current epoch is settled.
    /// @param withdrawer The address requesting the withdrawal.
    /// @param asset The address of the asset being withdrawn.
    /// @param sharesOwed The amount of shares owed to the withdrawer.
    /// @param amountIn The amount of restaking tokens pulled from the withdrawer.
    function queueWithdrawal(address withdrawer, address asset, uint256 sharesOwed, uint256 amountIn) external onlyCoordinator {
        uint256 currentEpoch = getCurrentEpoch(asset);

        EpochWithdrawals storage epochWithdrawals = _getEpochWithdrawals(asset, currentEpoch);
        epochWithdrawals.sharesOwed += SafeCast.toUint120(sharesOwed);
        epochWithdrawals.amountToBurnAtSettlement += amountIn;

        UserWithdrawalSummary storage userSummary = epochWithdrawals.users[withdrawer];
        userSummary.sharesOwed += SafeCast.toUint120(sharesOwed);

        emit WithdrawalQueued(currentEpoch, asset, withdrawer, sharesOwed, amountIn);
    }

    /// @notice Settle the current epoch for `asset` using `assetsReceived` from the deposit pool.
    /// @param asset The address of the withdrawal asset.
    /// @param assetsReceived The amount of assets received to settle the epoch.
    /// @param shareValueOfAssetsReceived The value of the assets received in EigenLayer shares.
    function settleCurrentEpoch(address asset, uint256 assetsReceived, uint256 shareValueOfAssetsReceived) external onlyCoordinator {
        uint256 currentEpoch = getCurrentEpoch(asset);

        EpochWithdrawals storage epochWithdrawals = _getEpochWithdrawals(asset, currentEpoch);
        if (epochWithdrawals.sharesOwed == 0) revert NO_SHARES_OWED_IN_EPOCH();
        if (epochWithdrawals.settled) revert EPOCH_ALREADY_SETTLED();

        epochWithdrawals.settled = true;
        epochWithdrawals.assetsReceived = SafeCast.toUint120(assetsReceived);
        epochWithdrawals.shareValueOfAssetsReceived = SafeCast.toUint120(shareValueOfAssetsReceived);

        restakingToken.burn(epochWithdrawals.amountToBurnAtSettlement);
        currentEpochsByAsset[asset] += 1;

        emit EpochSettledFromDepositPool(currentEpoch, asset, assetsReceived);
    }

    /// @notice Queues the current epoch for `asset` settlement via EigenLayer and record
    /// the amount of assets received from the deposit pool.
    /// @param asset The address of the withdrawal asset.
    /// @param assetsReceived The amount of assets received from the deposit pool.
    /// @param shareValueOfAssetsReceived The value of the assets received in EigenLayer shares.
    /// @param aggregateRoot The aggregate root of the queued EigenLayer withdrawals.
    function queueCurrentEpochSettlement(address asset, uint256 assetsReceived, uint256 shareValueOfAssetsReceived, bytes32 aggregateRoot) external onlyCoordinator {
        if (aggregateRoot == bytes32(0)) revert INVALID_AGGREGATE_WITHDRAWAL_ROOT();
        
        uint256 currentEpoch = getCurrentEpoch(asset);

        EpochWithdrawals storage epochWithdrawals = _getEpochWithdrawals(asset, currentEpoch);
        if (epochWithdrawals.aggregateRoot != bytes32(0)) revert WITHDRAWALS_ALREADY_QUEUED_FOR_EPOCH();
        if (epochWithdrawals.sharesOwed == 0) revert NO_SHARES_OWED_IN_EPOCH();
        if (epochWithdrawals.settled) revert EPOCH_ALREADY_SETTLED();

        uint256 restakingTokensToBurn;
        if (assetsReceived > 0) {
            epochWithdrawals.assetsReceived = SafeCast.toUint120(assetsReceived);
            epochWithdrawals.shareValueOfAssetsReceived = SafeCast.toUint120(shareValueOfAssetsReceived);

            restakingTokensToBurn = epochWithdrawals.amountToBurnAtSettlement.mulWad(
                shareValueOfAssetsReceived.divWad(epochWithdrawals.sharesOwed)
            );
            restakingToken.burn(restakingTokensToBurn);

            epochWithdrawals.amountToBurnAtSettlement -= restakingTokensToBurn;            
        }
        epochWithdrawals.aggregateRoot = aggregateRoot;

        emit EpochQueuedForSettlementFromEigenLayer(
            currentEpoch, asset, assetsReceived, shareValueOfAssetsReceived, restakingTokensToBurn, aggregateRoot
        );
    }

    /// @notice Settle `epoch` for `asset` using `queuedWithdrawals` from EigenLayer.
    /// @param asset The address of the withdrawal asset.
    /// @param epoch The epoch to settle.
    /// @param queuedWithdrawals The queued withdrawals from EigenLayer.
    /// @param middlewareTimesIndexes The middleware times indexes for the queued withdrawals.
    function settleEpochFromEigenLayer(
        address asset,
        uint256 epoch,
        IDelegationManager.Withdrawal[] calldata queuedWithdrawals,
        uint256[] calldata middlewareTimesIndexes
    ) external {
        EpochWithdrawals storage epochWithdrawals = _getEpochWithdrawals(asset, epoch);
        if (epochWithdrawals.sharesOwed == 0) revert NO_SHARES_OWED_IN_EPOCH();
        if (epochWithdrawals.settled) revert EPOCH_ALREADY_SETTLED();
        if (epochWithdrawals.aggregateRoot == bytes32(0)) revert WITHDRAWALS_NOT_QUEUED_FOR_EPOCH();

        uint256 queuedWithdrawalCount = queuedWithdrawals.length;
        if (queuedWithdrawalCount != middlewareTimesIndexes.length) revert INVALID_MIDDLEWARE_TIMES_INDEXES_LENGTH();

        epochWithdrawals.settled = true;
        restakingToken.burn(epochWithdrawals.amountToBurnAtSettlement);

        uint256 balanceBefore = asset.getSelfBalance();

        address[] memory assets = asset.toArray();
        bytes32[] memory roots = new bytes32[](queuedWithdrawalCount);

        IDelegationManager.Withdrawal memory queuedWithdrawal;
        for (uint256 i; i < queuedWithdrawalCount;) {
            queuedWithdrawal = queuedWithdrawals[i];

            roots[i] = _computeWithdrawalRoot(queuedWithdrawal);
            delegationManager.completeQueuedWithdrawal(queuedWithdrawal, assets, middlewareTimesIndexes[i], true);

            unchecked {
                ++i;
            }
        }
        if (epochWithdrawals.aggregateRoot != keccak256(abi.encodePacked(roots))) {
            revert INVALID_AGGREGATE_WITHDRAWAL_ROOT();
        }
        epochWithdrawals.shareValueOfAssetsReceived = SafeCast.toUint120(epochWithdrawals.sharesOwed);

        uint256 assetsReceived = asset.getSelfBalance() - balanceBefore;
        epochWithdrawals.assetsReceived += SafeCast.toUint120(assetsReceived);

        emit EpochSettledFromEigenLayer(epoch, asset, assetsReceived);
    }

    /// @dev Receives ETH for withdrawals.
    receive() external payable {}

    /// @dev Returns the keccak256 hash of `withdrawal`.
    /// @param withdrawal The withdrawal.
    function _computeWithdrawalRoot(IDelegationManager.Withdrawal memory withdrawal) public pure returns (bytes32) {
        return keccak256(abi.encode(withdrawal));
    }

    function _getEpochWithdrawals(address asset, uint256 epoch) internal view returns (EpochWithdrawals storage) {
        return epochWithdrawalsByAsset[asset][epoch];
    }

    /// @dev Allows the owner to upgrade the withdrawal queue implementation.
    /// @param newImplementation The implementation to upgrade to.
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
