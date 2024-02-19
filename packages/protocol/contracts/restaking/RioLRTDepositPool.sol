// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {FixedPointMathLib} from '@solady/utils/FixedPointMathLib.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {UUPSUpgradeable} from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import {IRioLRTOperatorDelegator} from 'contracts/interfaces/IRioLRTOperatorDelegator.sol';
import {IDelegationManager} from 'contracts/interfaces/eigenlayer/IDelegationManager.sol';
import {IRioLRTDepositPool} from 'contracts/interfaces/IRioLRTDepositPool.sol';
import {OperatorOperations} from 'contracts/utils/OperatorOperations.sol';
import {RioLRTCore} from 'contracts/restaking/base/RioLRTCore.sol';
import {Asset} from 'contracts/utils/Asset.sol';
import {Array} from 'contracts/utils/Array.sol';
import {
    BEACON_CHAIN_STRATEGY,
    ETH_DEPOSIT_SOFT_CAP,
    ETH_DEPOSIT_BUFFER_LIMIT,
    ETH_ADDRESS
} from 'contracts/utils/Constants.sol';

contract RioLRTDepositPool is IRioLRTDepositPool, OwnableUpgradeable, UUPSUpgradeable, RioLRTCore {
    using FixedPointMathLib for uint256;
    using Asset for *;
    using Array for *;

    /// @notice The primary delegation contract for EigenLayer.
    IDelegationManager public immutable delegationManager;

    /// @param issuer_ The LRT issuer that's authorized to deploy this contract.
    /// @param delegationManager_ The primary delegation contract for EigenLayer.
    constructor(address issuer_, address delegationManager_) RioLRTCore(issuer_) {
        delegationManager = IDelegationManager(delegationManager_);
    }

    /// @notice Initializes the deposit pool contract.
    /// @param initialOwner The initial owner of the contract.
    /// @param token_ The address of the liquid restaking token.
    function initialize(address initialOwner, address token_) external initializer {
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
        __RioLRTCore_init(token_);
    }

    // forgefmt: disable-next-item
    /// @notice Deposits the entire deposit pool balance of the specified `asset` into EigenLayer, unless capped.
    /// @param asset The address of the asset to be deposited.
    function depositBalanceIntoEigenLayer(address asset) external onlyCoordinator returns (uint256, bool) {
        uint256 amountToDeposit = asset.getSelfBalance();
        if (amountToDeposit == 0) return (0, false);

        bool isDepositCapped;
        if (asset == ETH_ADDRESS) {
            // Due to the high cost associated with ETH deposits, we cap the deposit at or near the defined soft cap.
            if (amountToDeposit > ETH_DEPOSIT_SOFT_CAP) {
                // Only cap the deposit if the excess is beyond the allowed buffer limit.
                if (amountToDeposit - ETH_DEPOSIT_SOFT_CAP > ETH_DEPOSIT_BUFFER_LIMIT) {
                    (amountToDeposit, isDepositCapped) = (ETH_DEPOSIT_SOFT_CAP, true);
                }
            }
            return (OperatorOperations.depositETHToOperators(operatorRegistry(), amountToDeposit), isDepositCapped);
        }

        address strategy = assetRegistry().getAssetStrategy(asset);
        uint256 sharesToAllocate = assetRegistry().convertToSharesFromAsset(asset, amountToDeposit);
        return (OperatorOperations.depositTokenToOperators(operatorRegistry(), asset, strategy, sharesToAllocate), isDepositCapped);
    }

    /// @notice Transfers the maximum possible amount of assets based on the available
    /// pool balance and requested shares.
    /// @param asset The address of the asset to be transferred.
    /// @param sharesRequested The number of shares to convert into assets for transfer.
    /// @param recipient The address of the recipient of the transferred assets.
    /// @dev This function handles asset transfer by converting the share value to assets and
    /// ensures that either the requested amount or the maximum possible amount is transferred.
    function transferMaxAssetsForShares(address asset, uint256 sharesRequested, address recipient)
        external
        onlyCoordinator
        returns (uint256, uint256)
    {
        uint256 poolBalance = asset.getSelfBalance();
        uint256 poolBalanceShareValue = assetRegistry().convertToSharesFromAsset(asset, poolBalance);

        // Return early if the deposit pool has no balance or value for the given asset.
        if (poolBalance == 0 || poolBalanceShareValue == 0) {
            return (0, 0);
        }

        // If the deposit pool balance can cover the requested shares, transfer the equivalent assets.
        if (poolBalanceShareValue >= sharesRequested) {
            address strategy = assetRegistry().getAssetStrategy(asset);
            uint256 assetsSent = assetRegistry().convertFromSharesToAsset(strategy, sharesRequested);
            asset.transferTo(recipient, assetsSent);

            return (assetsSent, sharesRequested);
        }

        // Transfer the maximum possible assets from the deposit pool if it
        // cannot cover the requested shares. If withdrawing ETH, we reduce the
        // precision of the shares owed to the nearest Gwei, which is the smallest
        // unit of account supported by EigenLayer.
        if (asset == ETH_ADDRESS) {
            poolBalance = poolBalance.reducePrecisionToGwei();
            poolBalanceShareValue = poolBalanceShareValue.reducePrecisionToGwei();
        }
        asset.transferTo(recipient, poolBalance);

        return (poolBalance, poolBalanceShareValue);
    }

    /// @notice Completes a withdrawal from EigenLayer for the specified asset and operator.
    /// Withdrawals directly to the deposit pool can occur for two reasons:
    /// 1. The operator has exited the strategy and the assets have been returned to the deposit pool.
    /// 2. Excess full withdrawal ETH has been scraped from the EigenPod.
    /// @param asset The address of the asset to be withdrawn.
    /// @param operatorId The ID of the operator from which the asset is being withdrawn.
    /// @param queuedWithdrawal The withdrawal to be completed.
    /// @param middlewareTimesIndex The index of the middleware times to use for the withdrawal.
    function completeOperatorWithdrawalForAsset(
        address asset,
        uint8 operatorId,
        IDelegationManager.Withdrawal calldata queuedWithdrawal,
        uint256 middlewareTimesIndex
    ) external {
        // Only allow one strategy exit at a time.
        if (queuedWithdrawal.strategies.length != 1) revert INVALID_WITHDRAWAL_STRATEGY_LENGTH();

        // Verify that the withdrawal originated from an operator delegator within the system.
        IRioLRTOperatorDelegator operatorDelegator_ = operatorDelegator(operatorRegistry(), operatorId);
        if (queuedWithdrawal.staker != address(operatorDelegator_)) {
            revert INVALID_WITHDRAWAL_ORIGIN();
        }

        // If ETH, decrease the amount of ETH queued for withdrawal. Otherwise, decrease the
        // amount of shares held for the asset.
        address strategy = queuedWithdrawal.strategies[0];
        if (strategy == BEACON_CHAIN_STRATEGY) {
            operatorDelegator_.decreaseETHQueuedForOperatorExitOrScrape(queuedWithdrawal.shares[0]);
        } else {
            assetRegistry().decreaseSharesHeldForAsset(asset, queuedWithdrawal.shares[0]);
        }

        // Complete the withdrawal. This function verifies that the passed `asset` is correct.
        delegationManager.completeQueuedWithdrawal(queuedWithdrawal, asset.toArray(), middlewareTimesIndex, true);

        emit OperatorAssetWithdrawalCompleted(operatorId, asset, keccak256(abi.encode(queuedWithdrawal)));
    }

    /// @dev Receives ETH for deposit into EigenLayer.
    receive() external payable {}

    /// @dev Allows the owner to upgrade the deposit pool implementation.
    /// @param newImplementation The implementation to upgrade to.
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
