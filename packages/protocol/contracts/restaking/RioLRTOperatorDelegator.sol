// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {IRioLRTOperatorDelegator} from 'contracts/interfaces/IRioLRTOperatorDelegator.sol';
import {IDelegationManager} from 'contracts/interfaces/eigenlayer/IDelegationManager.sol';
import {IBeaconChainProofs} from 'contracts/interfaces/eigenlayer/IBeaconChainProofs.sol';
import {IStrategyManager} from 'contracts/interfaces/eigenlayer/IStrategyManager.sol';
import {IEigenPodManager} from 'contracts/interfaces/eigenlayer/IEigenPodManager.sol';
import {ISignatureUtils} from 'contracts/interfaces/eigenlayer/ISignatureUtils.sol';
import {IEigenPod} from 'contracts/interfaces/eigenlayer/IEigenPod.sol';
import {RioLRTCore} from 'contracts/restaking/base/RioLRTCore.sol';
import {Memory} from 'contracts/utils/Memory.sol';
import {Array} from 'contracts/utils/Array.sol';
import {Asset} from 'contracts/utils/Asset.sol';

contract RioLRTOperatorDelegator is IRioLRTOperatorDelegator, RioLRTCore {
    using SafeERC20 for IERC20;
    using Asset for address;
    using Array for *;

    /// @dev The length of a BLS12-381 public key.
    uint256 internal constant PUBLIC_KEY_LENGTH = 48;

    /// @dev The length of a BLS12-381 signature.
    uint256 internal constant SIGNATURE_LENGTH = 96;

    /// @dev The per-validator deposit amount.
    uint256 internal constant DEPOSIT_SIZE = 32 ether;

    /// @dev The deposit amount in gwei, converted to little endian.
    /// DEPOSIT_SIZE_IN_GWEI_LE64 = toLittleEndian64(32 ether / 1 gwei)
    uint64 internal constant DEPOSIT_SIZE_IN_GWEI_LE64 = 0x0040597307000000;

    /// @dev The withdrawal credentials prefix, which signals that withdrawals are enabled.
    bytes1 internal constant WITHDRAWALS_ENABLED_PREFIX = 0x01;

    /// @notice The primary entry and exit-point for funds into and out of EigenLayer.
    IStrategyManager public immutable strategyManager;

    /// @notice The contract used for creating and managing EigenPods.
    IEigenPodManager public immutable eigenPodManager;

    /// @notice The primary delegation contract for EigenLayer.
    IDelegationManager public immutable delegationManager;

    /// @notice The operator delegator's EigenPod.
    IEigenPod public eigenPod;

    /// @notice Credentials to withdraw ETH on Consensus Layer via the EigenPod.
    bytes32 public withdrawalCredentials;

    /// @notice Require that the caller is the LRT's coordinator
    /// or the operator registry.
    modifier onlyCoordinatorOrOperatorRegistry() {
        if (msg.sender != address(coordinator()) && msg.sender != address(operatorRegistry())) {
            revert ONLY_COORDINATOR_OR_OPERATOR_REGISTRY();
        }
        _;
    }

    /// @param issuer_ The issuer of the LRT instance that this contract is deployed for.
    /// @param strategyManager_ The primary entry and exit-point for funds into and out of EigenLayer.
    /// @param eigenPodManager_ The contract used for creating and managing EigenPods.
    /// @param delegationManager_ The primary delegation contract for EigenLayer.
    constructor(address issuer_, address strategyManager_, address eigenPodManager_, address delegationManager_)
        RioLRTCore(issuer_)
    {
        strategyManager = IStrategyManager(strategyManager_);
        eigenPodManager = IEigenPodManager(eigenPodManager_);
        delegationManager = IDelegationManager(delegationManager_);
    }

    // forgefmt: disable-next-item
    /// @notice Initializes the contract by delegating to the provided EigenLayer operator.
    /// @param token_ The address of the liquid restaking token.
    /// @param operator The operator's address.
    function initialize(address token_, address operator) external initializer {
        __RioLRTCore_init_noVerify(token_);

        if (msg.sender != address(operatorRegistry())) revert ONLY_OPERATOR_REGISTRY();

        IDelegationManager.OperatorDetails memory operatorDetails = delegationManager.operatorDetails(operator);
        if (operatorDetails.earningsReceiver != address(rewardDistributor())) revert INVALID_EARNINGS_RECEIVER();
        if (operatorDetails.delegationApprover != address(0)) revert INVALID_DELEGATION_APPROVER();
        if (operatorDetails.stakerOptOutWindowBlocks < operatorRegistry().minStakerOptOutBlocks()) {
            revert INVALID_STAKER_OPT_OUT_BLOCKS();
        }

        delegationManager.delegateTo(
            operator,
            ISignatureUtils.SignatureWithExpiry(new bytes(0), 0),
            bytes32(0)
        );

        // Deploy an EigenPod and set the withdrawal credentials to its address.
        address eigenPodAddress = eigenPodManager.createPod();

        eigenPod = IEigenPod(eigenPodAddress);
        withdrawalCredentials = _computeWithdrawalCredentials(eigenPodAddress);
    }

    /// @notice Returns the number of shares in the operator delegator's EigenPod.
    function getEigenPodShares() external view returns (int256) {
        return eigenPodManager.podOwnerShares(address(this));
    }

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
    ) external onlyOperatorRegistry {
        eigenPod.verifyWithdrawalCredentials(
            oracleTimestamp, stateRootProof, validatorIndices, validatorFieldsProofs, validatorFields
        );
    }

    /// @notice Scrapes ETH sitting in the operator delegator's EigenPod to the reward distributor.
    /// @dev Anyone can call this function.
    function scrapeEigenPodETHBalanceToRewardDistributor() external {
        eigenPod.withdrawNonBeaconChainETHBalanceWei(
            address(rewardDistributor()), eigenPod.nonBeaconChainETHBalanceWei()
        );
    }

    // forgefmt: disable-next-item
    /// @notice Approve EigenLayer to spend an ERC20 token, then stake it into an EigenLayer strategy.
    /// @param strategy The strategy to stake the tokens into.
    /// @param token The token to stake.
    /// @param amount The amount of tokens to stake.
    function stakeERC20(address strategy, address token, uint256 amount) external onlyDepositPool returns (uint256 shares) {
        if (IERC20(token).allowance(address(this), address(strategyManager)) < amount) {
            IERC20(token).forceApprove(address(strategyManager), type(uint256).max);
        }
        shares = strategyManager.depositIntoStrategy(strategy, token, amount);
    }

    // forgefmt: disable-next-item
    /// Stake ETH via the operator delegator's EigenPod, using the provided validator information.
    /// @param validatorCount The number of validators to deposit into.
    /// @param pubkeyBatch Batched validator public keys.
    /// @param signatureBatch Batched validator signatures.
    function stakeETH(uint256 validatorCount, bytes calldata pubkeyBatch, bytes calldata signatureBatch) external payable onlyDepositPool {
        if (validatorCount == 0 || msg.value / DEPOSIT_SIZE != validatorCount) revert INVALID_VALIDATOR_COUNT();
        if (pubkeyBatch.length != PUBLIC_KEY_LENGTH * validatorCount) {
            revert INVALID_PUBLIC_KEYS_BATCH_LENGTH(pubkeyBatch.length, PUBLIC_KEY_LENGTH * validatorCount);
        }
        if (signatureBatch.length != SIGNATURE_LENGTH * validatorCount) {
            revert INVALID_SIGNATURES_BATCH_LENGTH(signatureBatch.length, SIGNATURE_LENGTH * validatorCount);
        }

        bytes32 depositDataRoot;
        bytes32 withdrawalCredentials_ = withdrawalCredentials;
        bytes memory publicKey = Memory.unsafeAllocateBytes(PUBLIC_KEY_LENGTH);
        bytes memory signature = Memory.unsafeAllocateBytes(SIGNATURE_LENGTH);
        for (uint256 i = 0; i < validatorCount; ++i) {
            Memory.copyBytes(pubkeyBatch, publicKey, i * PUBLIC_KEY_LENGTH, 0, PUBLIC_KEY_LENGTH);
            Memory.copyBytes(signatureBatch, signature, i * SIGNATURE_LENGTH, 0, SIGNATURE_LENGTH);
            depositDataRoot = _computeDepositDataRoot(withdrawalCredentials_, publicKey, signature);

            eigenPodManager.stake{value: DEPOSIT_SIZE}(publicKey, signature, depositDataRoot);
        }
    }

    // forgefmt: disable-next-item
    /// @notice Queue a withdrawal of the given amount of `shares` to the `withdrawer` from the provided `strategy`.
    /// @param strategy The strategy to withdraw from.
    /// @param shares The amount of shares to withdraw.
    /// @param withdrawer The address who has permission to complete the withdrawal.
    function queueWithdrawal(address strategy, uint256 shares, address withdrawer) external onlyCoordinatorOrOperatorRegistry returns (bytes32 root) {
        IDelegationManager.QueuedWithdrawalParams[] memory withdrawalParams = new IDelegationManager.QueuedWithdrawalParams[](1);
        withdrawalParams[0] = IDelegationManager.QueuedWithdrawalParams({
            strategies: strategy.toArray(),
            shares: shares.toArray(),
            withdrawer: withdrawer
        });
        root = delegationManager.queueWithdrawals(withdrawalParams)[0];
    }

    /// @notice Forwards ETH rewards to the reward distributor. This includes partial
    /// withdrawals and any amount in excess of 32 ETH for full withdrawals.
    receive() external payable {
        address(rewardDistributor()).transferETH(msg.value);
    }

    /// @dev Compute withdrawal credentials for the given EigenPod.
    /// @param pod The EigenPod to compute the withdrawal credentials for.
    function _computeWithdrawalCredentials(address pod) internal pure returns (bytes32) {
        return WITHDRAWALS_ENABLED_PREFIX | bytes32(uint256(uint160(pod)));
    }

    // forgefmt: disable-next-item
    /// @dev Computes the deposit_root_hash required by the Beacon Deposit contract.
    /// @param withdrawalCredentials_ Credentials to withdraw ETH on Consensus Layer.
    /// @param publicKey A BLS12-381 public key.
    /// @param signature A BLS12-381 signature.
    function _computeDepositDataRoot(bytes32 withdrawalCredentials_, bytes memory publicKey, bytes memory signature) internal pure returns (bytes32) {
        // Compute the deposit data root (`DepositData` hash tree root) according to deposit_contract.sol
        bytes memory sigPart1 = Memory.unsafeAllocateBytes(64);
        bytes memory sigPart2 = Memory.unsafeAllocateBytes(32);

        Memory.copyBytes(signature, sigPart1, 0, 0, 64);
        Memory.copyBytes(signature, sigPart2, 64, 0, 32);

        bytes32 publicKeyRoot = sha256(abi.encodePacked(publicKey, bytes16(0)));
        bytes32 signatureRoot =
            sha256(abi.encodePacked(sha256(abi.encodePacked(sigPart1)), sha256(abi.encodePacked(sigPart2, bytes32(0)))));

        return sha256(
            abi.encodePacked(
                sha256(abi.encodePacked(publicKeyRoot, withdrawalCredentials_)),
                sha256(abi.encodePacked(DEPOSIT_SIZE_IN_GWEI_LE64, bytes24(0), signatureRoot))
            )
        );
    }
}
