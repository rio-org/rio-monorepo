// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IPoRAddressList} from './IPoRAddressList.sol';
import {IOperator} from './IOperator.sol';

interface IOperatorRegistry is IPoRAddressList {
    /// @dev Operator asset cap and allocation information.
    struct OperatorAssetInfo {
        uint128 cap;
        uint128 allocation;
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
        /// @dev The address that receives operator rewards. This address is used for both Rio and EigenLayer
        /// rewards. It is tracked in this contract to reduce reward distribution gas costs.
        address earningsReceiver;
        /// @dev Operator asset caps and current allocations. ERC20 caps and allocations are stored denominated in
        /// the ERC20's native units, while ETH caps and allocations are denominated in validators (32 ETH chunks).
        mapping(address => OperatorAssetInfo) assets;
    }

    /// @notice An operator address and token allocation.
    struct OperatorAllocation {
        address operator;
        uint256 allocation;
    }

    /// @notice Thrown when the caller is not the operator's manager.
    error ONLY_OPERATOR_MANAGER();

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

    /// @notice Thrown when an attempt is made to activate an already active operator.
    error OPERATOR_ALREADY_ACTIVE();

    /// @notice Thrown when an attempt is made to deactivate an already inactive operator.
    error OPERATOR_ALREADY_INACTIVE();

    /// @notice Thrown when no operators are active when attempting to allocate tokens.
    error NO_ACTIVE_OPERATORS();

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

    /// @notice Allocates a specified amount of tokens to the operators with the lowest utilization.
    /// @param token The token to allocate.
    /// @param allocationSize The amount of tokens to allocate.
    function allocate(address token, uint256 allocationSize) external returns (uint256 allocated, OperatorAllocation[] memory allocations);
}
