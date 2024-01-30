// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {FixedPointMathLib} from '@solady/utils/FixedPointMathLib.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {IRioLRTOperatorRegistry} from 'contracts/interfaces/IRioLRTOperatorRegistry.sol';
import {IRioLRTOperatorDelegator} from 'contracts/interfaces/IRioLRTOperatorDelegator.sol';
import {BEACON_CHAIN_STRATEGY, ETH_DEPOSIT_SIZE} from 'contracts/utils/Constants.sol';

/// @title Operator delegator deposit and withdrawal operations.
library OperatorOperations {
    using FixedPointMathLib for uint256;
    using SafeERC20 for IERC20;

    /// @notice Thrown when the number of shares queued for withdrawal from EigenLayer
    /// do not match the number of shares requested.
    error INCORRECT_NUMBER_OF_SHARES_QUEUED();

    /// @notice Thrown when the amount of shares received is not the expected amount.
    error INCORRECT_NUMBER_OF_SHARES_RECEIVED();

    /// @notice Deposits ETH into EigenLayer through the operators that are returned from the registry.
    /// @param operatorRegistry The operator registry used allocate to and deallocate from EigenLayer operators.
    /// @param amount The amount of ETH to deposit.
    function depositETH(IRioLRTOperatorRegistry operatorRegistry, uint256 amount) internal returns (uint256 depositAmount) {
        uint256 depositCount = amount / ETH_DEPOSIT_SIZE;
        if (depositCount == 0) return depositAmount;

        // forgefmt: disable-next-item
        (uint256 depositsAllocated, IRioLRTOperatorRegistry.OperatorETHAllocation[] memory allocations) = operatorRegistry.allocateETHDeposits(
            depositCount
        );
        depositAmount = depositsAllocated * ETH_DEPOSIT_SIZE;

        for (uint256 i = 0; i < allocations.length; ++i) {
            uint256 deposits = allocations[i].deposits;

            IRioLRTOperatorDelegator(allocations[i].delegator).stakeETH{value: deposits * ETH_DEPOSIT_SIZE}(
                deposits, allocations[i].pubKeyBatch, allocations[i].signatureBatch
            );
        }
    }

    /// @notice Deposits the given `amount` of tokens into EigenLayer the provided
    /// EigenLayer `strategy` via the operators that are returned from the registry.
    /// @param operatorRegistry The operator registry used allocate to and deallocate from EigenLayer operators.
    /// @param token The address of the token to deposit.
    /// @param strategy The strategy to deposit the funds into.
    /// @param sharesToAllocate The amount of strategy shares to allocate.
    function depositToken(
        IRioLRTOperatorRegistry operatorRegistry,
        address token,
        address strategy,
        uint256 sharesToAllocate
    ) internal returns (uint256 sharesReceived) {
        (uint256 sharesAllocated, IRioLRTOperatorRegistry.OperatorStrategyAllocation[] memory  allocations) = operatorRegistry.allocateStrategyShares(
            strategy, sharesToAllocate
        );

        for (uint256 i = 0; i < allocations.length; ++i) {
            IRioLRTOperatorRegistry.OperatorStrategyAllocation memory allocation = allocations[i];

            IERC20(token).safeTransfer(allocation.delegator, allocation.tokens);
            sharesReceived += IRioLRTOperatorDelegator(allocation.delegator).stakeERC20(strategy, token, allocation.tokens);
        }
        if (sharesReceived != sharesAllocated) revert INCORRECT_NUMBER_OF_SHARES_RECEIVED();
    }

    /// @notice Queues withdrawals from EigenLayer through the operators that are returned from the registry.
    /// @param operatorRegistry The operator registry used allocate to and deallocate from EigenLayer operators.
    /// @param strategy The strategy to withdraw the funds from.
    /// @param amount The amount needed.
    /// @param withdrawalQueue The address of the withdrawal queue.
    function queueWithdrawals(
        IRioLRTOperatorRegistry operatorRegistry,
        address strategy,
        uint256 amount,
        address withdrawalQueue
    ) internal returns (bytes32 aggregateRoot) {
        if (strategy == BEACON_CHAIN_STRATEGY) {
            return queueETHWithdrawals(operatorRegistry, amount, withdrawalQueue);
        }
        return queueTokenWithdrawals(operatorRegistry, strategy, amount, withdrawalQueue);
    }

    /// @notice Queues ETH withdrawals from EigenLayer through the operators that are returned from the registry.
    /// @param operatorRegistry The operator registry used allocate to and deallocate from EigenLayer operators.
    /// @param amount The amount of ETH needed.
    /// @param withdrawalQueue The address of the withdrawal queue.
    function queueETHWithdrawals(IRioLRTOperatorRegistry operatorRegistry, uint256 amount, address withdrawalQueue) internal returns (bytes32 aggregateRoot) {
        uint256 depositCount = amount.divUp(ETH_DEPOSIT_SIZE);
        (, IRioLRTOperatorRegistry.OperatorETHDeallocation[] memory operatorDepositDeallocations) = operatorRegistry.deallocateETHDeposits(
            depositCount
        );
        uint256 length = operatorDepositDeallocations.length;
        bytes32[] memory roots = new bytes32[](length);

        uint256 remainingAmount = amount;
        for (uint256 i = 0; i < length; ++i) {
            address delegator = operatorDepositDeallocations[i].delegator;

            // Ensure we do not send more than needed to the withdrawal queue. The remaining will stay in the Eigen Pod.
            uint256 amountToWithdraw = (i == length - 1) ? remainingAmount : operatorDepositDeallocations[i].deposits * ETH_DEPOSIT_SIZE;

            remainingAmount -= amountToWithdraw;
            roots[i] = IRioLRTOperatorDelegator(delegator).queueWithdrawal(BEACON_CHAIN_STRATEGY, amountToWithdraw, withdrawalQueue);
        }
        aggregateRoot = keccak256(abi.encode(roots));
    }

    /// @notice Queues a withdrawal from EigenLayer through the operators that are returned from the registry.
    /// @param operatorRegistry The operator registry used allocate to and deallocate from EigenLayer operators.
    /// @param strategy The strategy to withdraw the funds from.
    /// @param sharesToWithdraw The number of shares to withdraw.
    /// @param withdrawalQueue The address of the withdrawal queue.
    function queueTokenWithdrawals(
        IRioLRTOperatorRegistry operatorRegistry,
        address strategy,
        uint256 sharesToWithdraw,
        address withdrawalQueue
    ) internal returns (bytes32 aggregateRoot) {
        (, IRioLRTOperatorRegistry.OperatorStrategyDeallocation[] memory operatorDeallocations) = operatorRegistry.deallocateStrategyShares(
            strategy, sharesToWithdraw
        );
        bytes32[] memory roots = new bytes32[](operatorDeallocations.length);

        uint256 sharesQueued;
        for (uint256 i = 0; i < operatorDeallocations.length; ++i) {
            address delegator = operatorDeallocations[i].delegator;
            uint256 shares = operatorDeallocations[i].shares;

            sharesQueued += shares;
            roots[i] = IRioLRTOperatorDelegator(delegator).queueWithdrawal(strategy, shares, address(withdrawalQueue));
        }
        if (sharesToWithdraw != sharesQueued) revert INCORRECT_NUMBER_OF_SHARES_QUEUED();

        aggregateRoot = keccak256(abi.encode(roots));
    }
}
