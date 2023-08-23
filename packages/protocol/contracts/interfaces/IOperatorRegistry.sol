// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IPoRAddressList} from './IPoRAddressList.sol';

interface IOperatorRegistry is IPoRAddressList {
    /// @dev Operator information
    struct Operator {
        /// @dev The operator's human readable name
        string name;
        /// @dev Flag indicating if the operator can participate in further staking and reward distribution
        bool active;
        /// @dev Ethereum address which manages the operator
        address managerAddress;
        /// @dev Pending Ethereum address which may manage the operator
        address pendingManagerAddress;
        /// @dev Ethereum address which receives rewards for this operator
        address rewardAddress;
        /// @dev The amount of active validators for the operator
        uint96 activeValidatorCount;
    }

    /// @notice Thrown when the caller is not the operator's manager.
    error ONLY_OPERATOR_MANAGER();

    /// @notice Thrown when the caller is not the operator's pending manager.
    error ONLY_PENDING_OPERATOR_MANAGER();

    /// @notice Thrown when the name is empty.
    error INVALID_NAME();

    /// @notice Thrown when the manager address is `address(0)`.
    error INVALID_MANAGER_ADDRESS();

    /// @notice Thrown when the reward address is `address(0)`.
    error INVALID_REWARD_ADDRESS();

    /// @notice Thrown when an invalid (non-existent) operator ID is provided.
    error INVALID_OPERATOR_ID();

    /// @notice Thrown when an attempt is made to activate an already active operator.
    error OPERATOR_ALREADY_ACTIVE();

    /// @notice Thrown when an attempt is made to deactivate an already inactive operator.
    error OPERATOR_ALREADY_INACTIVE();

    /// @notice Emitted when an operator is added.
    /// @param operatorId The ID of the operator.
    /// @param name The name of the operator.
    /// @param managerAddress The manager address of the operator.
    /// @param rewardAddress The reward address of the operator.
    event OperatorAdded(uint256 indexed operatorId, string name, address managerAddress, address rewardAddress);

    /// @notice Emitted when an operator is activated.
    /// @param operatorId The ID of the operator.
    event OperatorActivated(uint256 indexed operatorId);

    /// @notice Emitted when an operator is deactivated.
    /// @param operatorId The ID of the operator.
    event OperatorDeactivated(uint256 indexed operatorId);

    /// @notice Emitted when an operator's name is set.
    /// @param operatorId The ID of the operator.
    /// @param name The name of the operator.
    event OperatorNameSet(uint256 indexed operatorId, string name);

    /// @notice Emitted when an operator's pending manager address is set.
    /// @param operatorId The ID of the operator.
    /// @param managerAddress The manager address of the operator.
    event OperatorPendingManagerAddressSet(uint256 indexed operatorId, address managerAddress);

    /// @notice Emitted when an operator's manager address is set.
    /// @param operatorId The ID of the operator.
    /// @param managerAddress The manager address of the operator.
    event OperatorManagerAddressSet(uint256 indexed operatorId, address managerAddress);

    /// @notice Emitted when an operator's reward address is set.
    /// @param operatorId The ID of the operator.
    /// @param rewardAddress The reward address of the operator.
    event OperatorRewardAddressSet(uint256 indexed operatorId, address rewardAddress);

    /// @notice Adds an operator to the registry.
    /// @param name The name of the operator.
    /// @param managerAddress The manager address of the operator.
    /// @param rewardAddress The reward address of the operator.
    /// @return id The ID of the operator.
    function addOperator(string calldata name, address managerAddress, address rewardAddress)
        external
        returns (uint256 id);

    /// @notice Activates an operator.
    /// @param operatorId The ID of the operator.
    function activateOperator(uint256 operatorId) external;

    /// @notice Deactivates an operator.
    /// @param operatorId The ID of the operator.
    function deactivateOperator(uint256 operatorId) external;

    /// @notice Sets an operator's name.
    /// @param operatorId The ID of the operator.
    /// @param newName The name of the operator.
    function setOperatorName(uint256 operatorId, string calldata newName) external;

    /// @notice Sets an operator's pending manager address.
    /// @param operatorId The ID of the operator.
    /// @param newManagerAddress The manager address of the operator.
    function setPendingOperatorManagerAddress(uint256 operatorId, address newManagerAddress) external;

    /// @notice Confirms an operator's pending manager address.
    /// @param operatorId The ID of the operator.
    function confirmOperatorManagerAddress(uint256 operatorId) external;

    /// @notice Sets an operator's reward address.
    /// @param operatorId The ID of the operator.
    /// @param newRewardAddress The new reward address of the operator.
    function setOperatorRewardAddress(uint256 operatorId, address newRewardAddress) external;
}
