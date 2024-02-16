// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {IDelegationManager} from 'contracts/interfaces/eigenlayer/IDelegationManager.sol';

interface IRioLRTDepositPool {
    /// @notice Thrown when a withdrawal was not queued through an operator delegator.
    error INVALID_WITHDRAWAL_ORIGIN();

    /// @notice Thrown when the length of the strategies array is not 1.
    error INVALID_WITHDRAWAL_STRATEGY_LENGTH();

    /// @notice Emitted when an operator's asset withdrawal to the deposit pool is completed.
    /// @param operatorId The ID of the operator from which the asset was withdrawn.
    /// @param asset The address of the asset that was withdrawn.
    /// @param withdrawalRoot The root of the withdrawal that was completed.
    event OperatorAssetWithdrawalCompleted(uint8 indexed operatorId, address asset, bytes32 withdrawalRoot);

    /// @notice Initializes the deposit pool contract.
    /// @param initialOwner The initial owner of the contract.
    /// @param token The address of the liquid restaking token.
    function initialize(address initialOwner, address token) external;

    /// @notice Deposits the entire deposit pool balance of the specified `asset` into EigenLayer.
    function depositBalanceIntoEigenLayer(address asset) external returns (uint256);

    /// @notice Transfers the maximum possible amount of assets based on the available
    /// pool balance and requested shares.
    /// @param asset The address of the asset to be transferred.
    /// @param sharesRequested The number of shares to convert into assets for transfer.
    /// @param recipient The address of the recipient of the transferred assets.
    /// @dev This function handles asset transfer by converting the share value to assets and
    /// ensures that either the requested amount or the maximum possible amount is transferred.
    function transferMaxAssetsForShares(address asset, uint256 sharesRequested, address recipient)
        external
        returns (uint256, uint256);

    /// @notice Completes a withdrawal from EigenLayer for the specified `asset` and `operatorId`.
    /// Withdrawals directly to the deposit pool can occur for two reasons:
    /// 1. The operator has exited the strategy and the assets have been returned to the deposit pool.
    /// 2. Excess ETH from full withdrawals had accumulated in the EigenPod and was scraped to the deposit pool.
    /// @param asset The address of the asset to be withdrawn.
    /// @param operatorId The ID of the operator from which the asset is being withdrawn.
    /// @param queuedWithdrawal The withdrawal to be completed.
    /// @param middlewareTimesIndex The index of the middleware times to use for the withdrawal.
    function completeOperatorWithdrawalForAsset(
        address asset,
        uint8 operatorId,
        IDelegationManager.Withdrawal calldata queuedWithdrawal,
        uint256 middlewareTimesIndex
    ) external;
}
