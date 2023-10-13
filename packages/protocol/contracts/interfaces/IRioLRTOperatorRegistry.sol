// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IPoRAddressList} from 'contracts/interfaces/chainlink/IPoRAddressList.sol';
import {IRioLRTOperator} from 'contracts/interfaces/IRioLRTOperator.sol';

interface IRioLRTOperatorRegistry is IPoRAddressList {
    /// @dev An operator token allocation cap configuration.
    struct TokenCapConfig {
        /// @dev The token address.
        address token;
        /// @dev The maximum amount of the token that can be allocated to the operator.
        uint128 cap;
    }

    /// @dev Operator token allocation cap and current allocation.
    struct OperatorTokenInfo {
        /// @dev The maximum amount of the token that can be allocated to the operator.
        uint128 cap;
        /// @dev The current amount of the token allocated to the operator.
        uint128 allocation;
    }

    /// @dev Aggregate validator information for a single operator.
    struct OperatorValidators {
        /// @dev The timestamp at which the next batch of pending validators will be considered
        /// "confirmed".
        uint40 nextConfirmationTimestamp;
        /// @dev The maximum number of validators approved by the DAO.
        uint40 cap;
        /// @dev The total number of keys that have been uploaded (all-time). This number will be
        /// decremented in the event that pending keys are removed.
        uint40 total;
        /// @dev The total number of validator keys that have been confirmed following
        /// review by the security council (all-time).
        uint40 confirmed;
        /// @dev The number of validators that have reached the deposited state (all-time).
        uint40 deposited;
        /// @dev The number of validators that have reached the exited state (all-time).
        uint40 exited;
    }

    /// @dev Operator information.
    struct OperatorInfo {
        /// @dev Flag indicating if the operator can participate in further staking and reward distribution.
        bool active;
        /// @dev The operator's contract address.
        address operator;
        /// @dev The address that manages the operator.
        address manager;
        /// @dev The address that will manage the operator once confirmed.
        address pendingManager;
        /// @dev The address that will receive operator rewards.
        address earningsReceiver;
        /// @dev Aggregate validator information for the operator.
        OperatorValidators validators;
        /// @dev Operator token allocation caps and current allocations.
        mapping(address => OperatorTokenInfo) tokens;
    }

    /// @notice An operator address and token allocation.
    struct OperatorTokenAllocation {
        /// @dev The operator's contract address.
        address operator;
        /// @dev The amount of tokens allocated to the operator.
        uint256 allocation;
    }

    /// @notice An operator address, ETH deposit allocation, and validator details.
    struct OperatorETHAllocation {
        /// @dev The operator's contract address.
        address operator;
        /// @dev The amount of ETH deposits allocated to the operator.
        uint256 deposits;
        /// @dev One or more validator public keys, concatenated together.
        bytes pubKeyBatch;
        /// @dev One or more validator signatures, concatenated together.
        bytes signatureBatch;
    }

    /// @notice An operator address and token deallocation.
    struct OperatorDeallocation {
        address operator;
        uint256 deallocation;
    }

    /// @notice Thrown when the caller is not the operator's manager.
    error ONLY_OPERATOR_MANAGER();

    /// @notice Thrown when the caller is not the operator's manager or OR the security daemon.
    error ONLY_OPERATOR_MANAGER_OR_SECURITY_DAEMON();

    /// @notice Thrown when the caller is not the asset manager.
    error ONLY_ASSET_MANAGER();

    /// @notice Thrown when the caller is not the operator's pending manager.
    error ONLY_OPERATOR_PENDING_MANAGER();

    /// @notice Thrown when the operator's metadata URI is empty.
    error INVALID_METADATA_URI();

    /// @notice Thrown when the maximum number of operators has been reached.
    error MAX_OPERATOR_COUNT_EXCEEDED();

    /// @notice Thrown when the maximum number of active operators has been reached.
    error MAX_ACTIVE_OPERATOR_COUNT_EXCEEDED();

    /// @notice Thrown when the manager is `address(0)`.
    error INVALID_MANAGER();

    /// @notice Thrown when the pending manager is `address(0)`.
    error INVALID_PENDING_MANAGER();

    /// @notice Thrown when the operator's earnings receiver is `address(0)`.
    error INVALID_EARNINGS_RECEIVER();

    /// @notice Thrown when an invalid (non-existent) operator contract address is provided.
    error INVALID_OPERATOR();

    /// @notice Thrown when the provided validator count is invalid (zero).
    error INVALID_VALIDATOR_COUNT();

    /// @notice Thrown when an invalid index is provided.
    error INVALID_INDEX();

    /// @notice Thrown when an attempt is made to activate an already active operator.
    error OPERATOR_ALREADY_ACTIVE();

    /// @notice Thrown when an attempt is made to deactivate an already inactive operator.
    error OPERATOR_ALREADY_INACTIVE();

    /// @notice Thrown when there are no active operators with a non-zero allocation cap.
    error NO_ACTIVE_OPERATORS_WITH_NON_ZERO_CAP();

    /// @notice Emitted when an operator is created.
    /// @param operatorId The operator's ID.
    /// @param operator The operator's contract address.
    /// @param initialManager The initial manager of the operator.
    /// @param initialEarningsReceiver The initial reward address of the operator.
    /// @param initialMetadataURI The initial metadata URI.
    event OperatorCreated(
        uint8 indexed operatorId,
        address indexed operator,
        address initialManager,
        address initialEarningsReceiver,
        string initialMetadataURI
    );

    /// @notice Emitted when an operator is activated.
    /// @param operatorId The operator's ID.
    event OperatorActivated(uint8 indexed operatorId);

    /// @notice Emitted when an operator is deactivated.
    /// @param operatorId The operator's ID.
    event OperatorDeactivated(uint8 indexed operatorId);

    /// @notice Emitted when an operator's token allocation cap is set.
    /// @param operatorId The operator's ID.
    /// @param token The token whose cap was set.
    /// @param cap The new token cap for the operator.
    event OperatorTokenCapSet(uint8 indexed operatorId, address token, uint128 cap);

    /// @notice Emitted when an operator's validator cap is set.
    /// @param operatorId The operator's ID.
    /// @param cap The new maximum active validator cap.
    event OperatorValidatorCapSet(uint8 indexed operatorId, uint40 cap);

    /// @notice Emitted when the validator key review period is set.
    /// @param validatorKeyReviewPeriod The new validator key review period.
    event ValidatorKeyReviewPeriodSet(uint24 validatorKeyReviewPeriod);

    /// @notice Emitted when an operator's earnings receiver is set.
    /// @param operatorId The operator's ID.
    /// @param earningsReceiver The new earnings receiver for the operator.
    event OperatorEarningsReceiverSet(uint8 indexed operatorId, address earningsReceiver);

    /// @notice Emitted when an operator's metadata URI is set.
    /// @param operatorId The operator's ID.
    /// @param metadataURI The new metadata URI of the operator.
    event OperatorMetadataURISet(uint8 indexed operatorId, string metadataURI);

    /// @notice Emitted when an operator's pending manager is set.
    /// @param operatorId The operator's ID.
    /// @param pendingManager The new pending manager of the operator.
    event OperatorPendingManagerSet(uint8 indexed operatorId, address pendingManager);

    /// @notice Emitted when an operator's manager is set.
    /// @param operatorId The operator's ID.
    /// @param manager The new manager of the operator.
    event OperatorManagerSet(uint8 indexed operatorId, address manager);

    /// @notice Emitted when an operator uploads a new set of validator details (public keys and signatures).
    /// @param operatorId The operator's ID.
    /// @param validatorCount The number of validator details that were added.
    event OperatorPendingValidatorDetailsAdded(uint8 indexed operatorId, uint256 validatorCount);

    /// @notice Emitted when an operator removes pending validator details (public keys and signatures).
    /// @param operatorId The operator's ID.
    /// @param validatorCount The number of pending validator details that were removed.
    event OperatorPendingValidatorDetailsRemoved(uint8 indexed operatorId, uint256 validatorCount);

    // forgefmt: disable-next-item
    /// @notice Initializes the contract.
    /// @param initialOwner The initial owner of the contract.
    /// @param poolId The LRT Balancer pool ID.
    /// @param controller The LRT controller.
    /// @param rewardDistributor The LRT reward distributor.
    /// @param assetManager The LRT asset manager.
    function initialize(address initialOwner, bytes32 poolId, address controller, address rewardDistributor, address assetManager) external;

    // forgefmt: disable-next-item
    /// @notice Allocates a specified amount of ERC20 tokens to the operators with the lowest utilization.
    /// @param token The token to allocate.
    /// @param allocationSize The amount of tokens to allocate.
    function allocateERC20(address token, uint256 allocationSize) external returns (uint256 allocated, OperatorTokenAllocation[] memory allocations);

    // forgefmt: disable-next-item
    /// @notice Allocates a specified amount of ETH deposits to the operators with the lowest utilization.
    /// @param depositSize The amount of deposits to allocate (32 ETH each)
    function allocateETHDeposits(uint256 depositSize) external returns (uint256 allocated, OperatorETHAllocation[] memory allocations);

    // forgefmt: disable-next-item
    /// @notice Deallocates a specified amount of tokens from the operators with the highest utilization.
    /// @param token The token to deallocate.
    /// @param deallocationSize The amount of tokens to deallocate.
    function deallocate(address token, uint256 deallocationSize) external returns (uint256 deallocated, OperatorDeallocation[] memory deallocations);
}
