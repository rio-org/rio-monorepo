// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {FixedPointMathLib} from '@solady/utils/FixedPointMathLib.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {IRioLRTOperatorRegistry} from 'contracts/interfaces/IRioLRTOperatorRegistry.sol';
import {IRioLRTOperatorDelegator} from 'contracts/interfaces/IRioLRTOperatorDelegator.sol';
import {BEACON_CHAIN_STRATEGY, ETH_DEPOSIT_SIZE} from 'contracts/utils/Constants.sol';

library OperatorOperations {
    using FixedPointMathLib for uint256;
    using SafeERC20 for IERC20;

    /// @notice Thrown when the number of shares queued for withdrawal from EigenLayer
    /// do not match the number of shares requested.
    error INCORRECT_NUMBER_OF_SHARES_QUEUED();

    /// @notice Thrown when the amount of shares received is not the expected amount.
    error INCORRECT_NUMBER_OF_SHARES_RECEIVED();

    /// @dev Deposits ETH into EigenLayer through the operators that are returned from the registry.
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

        for (uint256 i = 0; i < allocations.length;) {
            uint256 deposits = allocations[i].deposits;

            IRioLRTOperatorDelegator(allocations[i].operator).stakeETH{value: deposits * ETH_DEPOSIT_SIZE}(
                deposits, allocations[i].pubKeyBatch, allocations[i].signatureBatch
            );
            unchecked {
                ++i;
            }
        }
    }

    /// @dev Deposits the given `amount` of tokens into EigenLayer the provided
    /// EigenLayer `strategy` via the operators that are returned from the registry.
    /// @param operatorRegistry The operator registry used allocate to and deallocate from EigenLayer operators.
    /// @param token The address of the token to deposit.
    /// @param strategy The strategy to deposit the funds into.
    /// @param sharesToAllocate The amount of strategy shares to allocate.
    function depositToken(IRioLRTOperatorRegistry operatorRegistry, address token, address strategy, uint256 sharesToAllocate) internal returns (uint256 sharesReceived) {
        (uint256 sharesAllocated, IRioLRTOperatorRegistry.OperatorStrategyAllocation[] memory  allocations) = operatorRegistry.allocateStrategyShares(
            strategy, sharesToAllocate
        );

        for (uint256 i = 0; i < allocations.length;) {
            IRioLRTOperatorRegistry.OperatorStrategyAllocation memory allocation = allocations[i];

            IERC20(token).safeTransfer(allocation.operator, allocation.tokens);
            sharesReceived += IRioLRTOperatorDelegator(allocation.operator).stakeERC20(strategy, token, allocation.tokens);
            unchecked {
                ++i;
            }
        }
        if (sharesReceived != sharesAllocated) revert INCORRECT_NUMBER_OF_SHARES_RECEIVED();
    }

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

    /// @dev Queues ETH withdrawals from EigenLayer through the operators that are returned from the registry.
    /// @param operatorRegistry The operator registry used allocate to and deallocate from EigenLayer operators.
    /// @param amount The amount of ETH needed.
    /// @param withdrawalQueue The address of the withdrawal queue.
    function queueETHWithdrawals(IRioLRTOperatorRegistry operatorRegistry, uint256 amount, address withdrawalQueue) internal returns (bytes32 aggregateRoot) {
        uint256 depositCount = amount.divUp(ETH_DEPOSIT_SIZE);
        (, IRioLRTOperatorRegistry.OperatorETHDeallocation[] memory operatorDepositDeallocations) = operatorRegistry.deallocateETHDeposits(
            depositCount
        );
        bytes32[] memory roots = new bytes32[](operatorDepositDeallocations.length);

        for (uint256 i = 0; i < operatorDepositDeallocations.length;) {
            address operator = operatorDepositDeallocations[i].operator;

            uint256 sharesToWithdraw = operatorDepositDeallocations[i].deposits * ETH_DEPOSIT_SIZE;
            roots[i] = IRioLRTOperatorDelegator(operator).queueWithdrawal(BEACON_CHAIN_STRATEGY, sharesToWithdraw, withdrawalQueue);

            unchecked {
                ++i;
            }
        }
        aggregateRoot = keccak256(abi.encode(roots));
    }

    /// @dev Queues a withdrawal from EigenLayer through the operators that are returned from the registry.
    /// @param operatorRegistry The operator registry used allocate to and deallocate from EigenLayer operators.
    /// @param strategy The strategy to withdraw the funds from.
    /// @param sharesToWithdraw The number of shares to withdraw.
    /// @param withdrawalQueue The address of the withdrawal queue.
    function queueTokenWithdrawals(IRioLRTOperatorRegistry operatorRegistry, address strategy, uint256 sharesToWithdraw, address withdrawalQueue) internal returns (bytes32 aggregateRoot) {
        (, IRioLRTOperatorRegistry.OperatorStrategyDeallocation[] memory operatorDeallocations) = operatorRegistry.deallocateStrategyShares(
            strategy, sharesToWithdraw
        );
        bytes32[] memory roots = new bytes32[](operatorDeallocations.length);

        uint256 sharesQueued;
        for (uint256 i = 0; i < operatorDeallocations.length;) {
            address operator = operatorDeallocations[i].operator;
            uint256 shares = operatorDeallocations[i].shares;

            sharesQueued += shares;
            roots[i] = IRioLRTOperatorDelegator(operator).queueWithdrawal(strategy, shares, address(withdrawalQueue));

            unchecked {
                ++i;
            }
        }
        if (sharesToWithdraw != sharesQueued) revert INCORRECT_NUMBER_OF_SHARES_QUEUED();

        aggregateRoot = keccak256(abi.encode(roots));
    }
}