// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IBeaconChainProofs} from 'contracts/interfaces/eigenlayer/IBeaconChainProofs.sol';

interface IRioLRTOperatorDelegator {
    /// @notice Thrown when the caller is not the operator registry.
    error ONLY_OPERATOR_REGISTRY();

    /// @notice Thrown when the caller is not the deposit pool.
    error ONLY_DEPOSIT_POOL();

    /// @notice Thrown when the caller is not the LRT's coordinator
    /// or the operator registry.
    error ONLY_COORDINATOR_OR_OPERATOR_REGISTRY();

    /// @notice Thrown when the earnings receiver is not set to the reward distributor.
    error INVALID_EARNINGS_RECEIVER();

    /// @notice Thrown when the delegation approver is not the zero address.
    error INVALID_DELEGATION_APPROVER();

    /// @notice Thrown when the operator's staker opt out blocks is below the minimum.
    error INVALID_STAKER_OPT_OUT_BLOCKS();

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

    /// @notice Initializes the contract by delegating to the provided EigenLayer operator.
    /// @param coordinator The LRT coordinator.
    /// @param depositPool The LRT deposit pool.
    /// @param rewardDistributor The LRT reward distributor.
    /// @param operator The operator's address.
    function initialize(address coordinator, address depositPool, address rewardDistributor, address operator) external;

    /// @notice Returns the number of shares in the operator delegator's EigenPod.
    function getEigenPodShares() external view returns (int256);

    /// @notice Verifies withdrawal credentials of validator(s) owned by this operator.
    /// It also verifies the effective balance of the validator(s).
    /// @param oracleTimestamp The Beacon Chain timestamp whose state root the `proof` will be proven against.
    /// @param stateRootProof Proves a `beaconStateRoot` against a block root fetched from the oracle.
    /// @param validatorIndices The list of indices of the validators being proven, refer to consensus specs.
    /// @param validatorFieldsProofs Proofs against the `beaconStateRoot` for each validator in `validatorFields`.
    /// @param validatorFields The fields of the "Validator Container", refer to consensus specs.
    function verifyWithdrawalCredentials(
        uint64 oracleTimestamp,
        IBeaconChainProofs.StateRootProof calldata stateRootProof,
        uint40[] calldata validatorIndices,
        bytes[] calldata validatorFieldsProofs,
        bytes32[][] calldata validatorFields
    ) external;

    /// @notice Approve EigenLayer to spend an ERC20 token, then stake it into an EigenLayer strategy.
    /// @param strategy The strategy to stake the tokens into.
    /// @param token The token to stake.
    /// @param amount The amount of tokens to stake.
    function stakeERC20(address strategy, address token, uint256 amount) external returns (uint256 shares);

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
    function queueWithdrawal(address strategy, uint256 shares, address withdrawer) external returns (bytes32 root);
}
