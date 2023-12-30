// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IBLSPublicKeyCompendium} from 'contracts/interfaces/eigenlayer/IBLSPublicKeyCompendium.sol';
import {IBeaconChainProofs} from 'contracts/interfaces/eigenlayer/IBeaconChainProofs.sol';

interface IRioLRTOperator {
    /// @notice The operator's BLS public key registration information.
    struct BLSRegistrationDetails {
        IBLSPublicKeyCompendium.G1Point signedMessageHash;
        IBLSPublicKeyCompendium.G1Point pubkeyG1;
        IBLSPublicKeyCompendium.G2Point pubkeyG2;
    }

    /// @notice Thrown when the caller is not the operator registry.
    error ONLY_OPERATOR_REGISTRY();

    /// @notice Thrown when the caller is not the asset manager.
    error ONLY_ASSET_MANAGER();

    /// @notice Thrown when the caller is not the asset manager
    /// or the operator registry.
    error ONLY_ASSET_MANAGER_OR_OPERATOR_REGISTRY();

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
    /// @param blsDetails The operator's BLS public key registration information.
    function initialize(
        address assetManager,
        address rewardDistributor,
        string calldata initialMetadataURI,
        BLSRegistrationDetails calldata blsDetails
    ) external;

    /// @notice Returns the number of shares in the operator's EigenPod.
    function getEigenPodShares() external view returns (int256);

    /// @notice Sets the operator's metadata URI.
    /// @param newMetadataURI The new metadata URI.
    function setMetadataURI(string calldata newMetadataURI) external;

    /// @notice Gives the `slashingContract` permission to slash this operator.
    /// @param slashingContract The address of the contract to give permission to.
    function optIntoSlashing(address slashingContract) external;

    /// @notice Registers this operator for the given quorum numbers on `registryContract`.
    /// @param registryContract The address of the registry contract.
    /// @param quorumNumbers The bytes representing the quorum numbers that the operator is registering for.
    /// @param registrationData The data that is decoded to get the operator's registration information.
    function registerOperatorWithCoordinator(address registryContract, bytes memory quorumNumbers, bytes calldata registrationData) external;

    /// @notice Deregisters this operator from the given quorum numbers on `registryContract`.
    /// @param registryContract The address of the registry contract.
    /// @param quorumNumbers The bytes representing the quorum numbers that the operator is registered for.
    /// @param deregistrationData The data that is decoded to get the operator's deregistration information.
    function deregisterOperatorWithCoordinator(address registryContract, bytes calldata quorumNumbers, bytes calldata deregistrationData) external;

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
