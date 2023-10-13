// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {IStrategy} from 'contracts/interfaces/eigenlayer/IStrategy.sol';

interface IRioLRTOperator {
    /// @notice Thrown when the caller is not the operator registry.
    error ONLY_OPERATOR_REGISTRY();

    /// @notice Thrown when the caller is not the LRT asset manager.
    error ONLY_ASSET_MANAGER();

    /// @notice Thrown when a strategy is not registered with EigenLayer.
    error INVALID_STRATEGY();

    /// @notice Thrown when the validator count is `0` or does not match the provided ETH value.
    error INVALID_VALIDATOR_COUNT();

    /// @notice Thrown when the public keys batch length does not match the validator count.
    /// @param actual The actual length of the batch.
    /// @param expected The expected length of the batch.
    error INVALID_PUBLIC_KEYS_BATCH_LENGTH(uint256 actual, uint256 expected);

    /// @notice Thrown when the signatures batch length does not match the validator count.
    /// @param actual The actual length of the batch.
    /// @param expected The expected length of the batch.
    error INVALID_SIGNATURES_BATCH_LENGTH(uint256 actual, uint256 expected);

    /// @notice Initializes the contract by registering the operator with EigenLayer.
    /// @param assetManager The LRT asset manager.
    /// @param rewardDistributor The LRT reward distributor.
    /// @param initialMetadataURI The initial metadata URI.
    function initialize(address assetManager, address rewardDistributor, string calldata initialMetadataURI) external;

    /// @notice Sets the operator's metadata URI.
    /// @param newMetadataURI The new metadata URI.
    function setMetadataURI(string calldata newMetadataURI) external;

    /// @notice Approve EigenLayer to spend an ERC20 token, then stake it into an EigenLayer strategy.
    /// @param strategy The strategy to stake the tokens into.
    /// @param token The token to stake.
    /// @param amount The amount of tokens to stake.
    function stakeERC20(IStrategy strategy, IERC20 token, uint256 amount) external returns (uint256 shares);

    // forgefmt: disable-next-item
    /// Stake ETH via the operator's EigenPod, using the provided validator information.
    /// @param validatorCount The number of validators to deposit into.
    /// @param pubkeyBatch Batched validator public keys.
    /// @param signatureBatch Batched validator signatures.
    function stakeETH(uint256 validatorCount, bytes calldata pubkeyBatch, bytes calldata signatureBatch) external payable;

    /// @notice Queue a withdrawal of the given amount of `shares` to the `withdrawer` from the provided `strategy`.
    /// @param strategy The strategy to withdraw from.
    /// @param shares The amount of shares to withdraw.
    /// @param withdrawer The address who has permission to complete the withdrawal.
    function queueWithdrawal(IStrategy strategy, uint256 shares, address withdrawer) external returns (bytes32 root);
}
