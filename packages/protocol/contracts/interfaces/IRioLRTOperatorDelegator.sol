// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {IEigenPod} from 'contracts/interfaces/eigenlayer/IEigenPod.sol';
import {IBeaconChainProofs} from 'contracts/interfaces/eigenlayer/IBeaconChainProofs.sol';
import {IDelegationManager} from 'contracts/interfaces/eigenlayer/IDelegationManager.sol';

interface IRioLRTOperatorDelegator {
    /// @notice Thrown when the earnings receiver is not set to the reward distributor.
    error INVALID_EARNINGS_RECEIVER();

    /// @notice Thrown when the delegation approver is not the zero address.
    error INVALID_DELEGATION_APPROVER();

    /// @notice Thrown when the operator's staker opt out blocks is below the minimum.
    error INVALID_STAKER_OPT_OUT_BLOCKS();

    /// @notice Thrown when the validator count is `0` or does not match the provided ETH value.
    error INVALID_VALIDATOR_COUNT();

    /// @notice Thrown when the asset provided for the beacon chain strategy is not valid.
    error INVALID_ASSET_FOR_BEACON_CHAIN_STRATEGY();

    /// @notice Thrown when the public keys batch length does not match the validator count.
    /// @param actual The actual length of the batch.
    /// @param expected The expected length of the batch.
    error INVALID_PUBLIC_KEYS_BATCH_LENGTH(uint256 actual, uint256 expected);

    /// @notice Thrown when the signatures batch length does not match the validator count.
    /// @param actual The actual length of the batch.
    /// @param expected The expected length of the batch.
    error INVALID_SIGNATURES_BATCH_LENGTH(uint256 actual, uint256 expected);

    /// @notice Thrown when there isn't enough excess full withdrawal ETH to initiate a scrape from the EigenPod.
    error INSUFFICIENT_EXCESS_FULL_WITHDRAWAL_ETH();

    /// @notice Thrown when the calling account is not authorized to claim a withdrawal.
    error UNAUTHORIZED_CLAIMER();

    /// @notice Initializes the contract by delegating to the provided EigenLayer operator.
    /// @param token The address of the liquid restaking token.
    /// @param operator The operator's address.
    function initialize(address token, address operator) external;

    /// @notice The operator delegator's EigenPod.
    function eigenPod() external view returns (IEigenPod);

    /// @notice Returns the number of shares in the operator delegator's EigenPod.
    function getEigenPodShares() external view returns (int256);

    /// @notice The amount of ETH queued for withdrawal from EigenLayer, in wei.
    function getETHQueuedForWithdrawal() external view returns (uint256);

    /// @notice Returns the total amount of ETH under management by the operator delegator.
    /// @dev This includes EigenPod shares (verified validator balances minus queued withdrawals)
    /// and ETH in the operator delegator's EigenPod.
    function getETHUnderManagement() external view returns (uint256);

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
    /// Stake ETH via the operator delegator's EigenPod, using the provided validator information.
    /// @param validatorCount The number of validators to deposit into.
    /// @param pubkeyBatch Batched validator public keys.
    /// @param signatureBatch Batched validator signatures.
    function stakeETH(uint256 validatorCount, bytes calldata pubkeyBatch, bytes calldata signatureBatch) external payable;

    /// @notice Queues a withdrawal of the specified amount of `shares` from the given `strategy` to the withdrawal queue,
    /// intended for settling user withdrawals.
    /// @param strategy The strategy from which to withdraw.
    /// @param shares The amount of shares to withdraw.
    function queueWithdrawalForUserSettlement(address strategy, uint256 shares) external returns (bytes32 root);

    /// @notice Queues a withdrawal of the specified amount of `shares` from the given `strategy` to the deposit pool,
    /// specifically for facilitating operator exits.
    /// @param strategy The strategy from which to withdraw.
    /// @param shares The amount of shares to withdraw.
    function queueWithdrawalForOperatorExit(address strategy, uint256 shares) external returns (bytes32 root);

    /// @notice Completes a queued withdrawal of the specified `queuedWithdrawal` for the given `asset`.
    /// @param queuedWithdrawal The withdrawal to complete.
    /// @param asset The asset to withdraw.
    /// @param middlewareTimesIndex The index of the middleware times to use for the withdrawal.
    function completeQueuedWithdrawal(
        IDelegationManager.Withdrawal calldata queuedWithdrawal,
        address asset,
        uint256 middlewareTimesIndex
    ) external returns (bytes32 root);
}
