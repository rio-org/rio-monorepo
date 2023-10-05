// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {Initializable} from '@openzeppelin/contracts/proxy/utils/Initializable.sol';
import {IDelegationManager} from 'contracts/interfaces/eigenlayer/IDelegationManager.sol';
import {IStrategyManager} from 'contracts/interfaces/eigenlayer/IStrategyManager.sol';
import {IEigenPodManager} from 'contracts/interfaces/eigenlayer/IEigenPodManager.sol';
import {ISlasher} from 'contracts/interfaces/eigenlayer/ISlasher.sol';
import {IStrategy} from 'contracts/interfaces/eigenlayer/IStrategy.sol';
import {IRioLRTOperator} from 'contracts/interfaces/IRioLRTOperator.sol';
import {Memory} from 'contracts/utils/Memory.sol';
import {Array} from 'contracts/utils/Array.sol';

contract RioLRTOperator is IRioLRTOperator, Initializable {
    using SafeERC20 for IERC20;
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

    /// @notice The primary 'slashing' contract for EigenLayer.
    ISlasher public immutable slasher;

    /// @notice The address that verifies staker delegation signatures and control forced undelegations.
    address public immutable delegationApprover;

    /// @notice The address of the LRT operator registry.
    address public operatorRegistry;

    /// @notice The LRT asset manager.
    address public assetManager;

    /// @notice Credentials to withdraw ETH on Consensus Layer via the EigenPod.
    bytes32 public withdrawalCredentials;

    /// @notice Require that the caller is the LRT's operator registry.
    modifier onlyOperatorRegistry() {
        if (msg.sender != operatorRegistry) revert ONLY_OPERATOR_REGISTRY();
        _;
    }

    /// @notice Require that the caller is the LRT's asset manager.
    modifier onlyAssetManager() {
        if (msg.sender != assetManager) revert ONLY_ASSET_MANAGER();
        _;
    }

    /// @param _strategyManager The primary entry and exit-point for funds into and out of EigenLayer.
    /// @param _eigenPodManager The contract used for creating and managing EigenPods.
    /// @param _delegationManager The primary delegation contract for EigenLayer.
    /// @param _slasher The primary 'slashing' contract for EigenLayer.
    /// @param _delegationApprover Address to verify staker delegation signatures and control forced undelegations.
    constructor(
        address _strategyManager,
        address _eigenPodManager,
        address _delegationManager,
        address _slasher,
        address _delegationApprover
    ) initializer {
        strategyManager = IStrategyManager(_strategyManager);
        eigenPodManager = IEigenPodManager(_eigenPodManager);
        delegationManager = IDelegationManager(_delegationManager);
        slasher = ISlasher(_slasher);

        delegationApprover = _delegationApprover;
    }

    // forgefmt: disable-next-item
    /// @notice Initializes the contract by registering the operator with EigenLayer.
    /// @param _assetManager The LRT asset manager.
    /// @param rewardDistributor The LRT reward distributor.
    /// @param initialMetadataURI The initial metadata URI.
    function initialize(address _assetManager, address rewardDistributor, string calldata initialMetadataURI) external initializer {
        operatorRegistry = msg.sender;
        assetManager = _assetManager;

        delegationManager.registerAsOperator(
            IDelegationManager.OperatorDetails(rewardDistributor, delegationApprover, 0), initialMetadataURI
        );
        eigenPodManager.createPod();
        
        // Set the withdrawal credentials to the EigenPod's address.
        withdrawalCredentials = _computeWithdrawalCredentials(
            address(eigenPodManager.ownerToPod(address(this)))
        );
    }

    /// @notice Sets the operator's metadata URI.
    /// @param newMetadataURI The new metadata URI.
    function setMetadataURI(string calldata newMetadataURI) external onlyOperatorRegistry {
        delegationManager.updateOperatorMetadataURI(newMetadataURI);
    }

    /// @notice Gives the `contractAddress` permission to slash this operator.
    /// @param contractAddress The address of the contract to give permission to.
    function optIntoSlashing(address contractAddress) external onlyOperatorRegistry {
        slasher.optIntoSlashing(contractAddress);
    }

    // forgefmt: disable-next-item
    /// @notice Approve EigenLayer to spend an ERC20 token, then stake it into an EigenLayer strategy.
    /// @param strategy The strategy to stake the tokens into.
    /// @param token The token to stake.
    /// @param amount The amount of tokens to stake.
    function stakeERC20(IStrategy strategy, IERC20 token, uint256 amount) external onlyAssetManager returns (uint256 shares) {
        if (token.allowance(address(this), address(strategyManager)) < amount) {
            token.forceApprove(address(strategyManager), type(uint256).max);
        }
        shares = strategyManager.depositIntoStrategy(strategy, token, amount);
    }

    // forgefmt: disable-next-item
    /// Stake ETH via the operator's EigenPod, using the provided validator information.
    /// @param validatorCount The number of validators to deposit into.
    /// @param pubkeyBatch Batched validator public keys.
    /// @param signatureBatch Batched validator signatures.
    function stakeETH(uint256 validatorCount, bytes calldata pubkeyBatch, bytes calldata signatureBatch) external payable onlyAssetManager {
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
        for (uint256 i = 0; i < validatorCount;) {
            Memory.copyBytes(pubkeyBatch, publicKey, i * PUBLIC_KEY_LENGTH, 0, PUBLIC_KEY_LENGTH);
            Memory.copyBytes(signatureBatch, signature, i * SIGNATURE_LENGTH, 0, SIGNATURE_LENGTH);
            depositDataRoot = _computeDepositDataRoot(withdrawalCredentials_, publicKey, signature);

            eigenPodManager.stake{value: DEPOSIT_SIZE}(publicKey, signature, depositDataRoot);

            unchecked {
                ++i;
            }
        }
    }

    // forgefmt: disable-next-item
    /// @notice Queue a withdrawal of the given amount of `shares` to the `withdrawer` from the provided `strategy`.
    /// @param strategy The strategy to withdraw from.
    /// @param shares The amount of shares to withdraw.
    /// @param withdrawer The address who has permission to complete the withdrawal.
    function queueWithdrawal(IStrategy strategy, uint256 shares, address withdrawer) external onlyAssetManager returns (bytes32 root) {
        uint256 strategyIndex = _getStrategyIndex(strategy);
        root = strategyManager.queueWithdrawal(
            strategyIndex.toArray(), strategy.toArray(), shares.toArray(), withdrawer, false
        );
    }

    /// @dev Return the strategy index for the given strategy instance.
    /// @param strategy The strategy instance.
    function _getStrategyIndex(IStrategy strategy) internal view returns (uint256) {
        uint256 strategyCount = strategyManager.stakerStrategyListLength(address(this));
        for (uint256 i = 0; i < strategyCount;) {
            if (strategyManager.stakerStrategyList(address(this), i) == strategy) {
                return i;
            }
            unchecked {
                ++i;
            }
        }
        revert INVALID_STRATEGY();
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
