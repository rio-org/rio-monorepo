// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {UUPSUpgradeable} from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {IOperatorRegistry} from './interfaces/IOperatorRegistry.sol';

contract OperatorRegistry is IOperatorRegistry, OwnableUpgradeable, UUPSUpgradeable {
    /// @notice The number of operators in the registry.
    uint256 public operatorCount;

    /// @notice A mapping of operator IDs to operator information.
    mapping(uint256 => Operator) public operators;

    /// @notice Require that the caller is the operator's manager.
    /// @param operatorId The ID of the operator.
    modifier onlyOperatorManager(uint256 operatorId) {
        if (msg.sender != operators[operatorId].managerAddress) revert ONLY_OPERATOR_MANAGER();
        _;
    }

    /// @notice Initializes the contract.
    /// @param initialOwner The initial owner of the contract.
    function initialize(address initialOwner) external initializer {
        __UUPSUpgradeable_init();
        _transferOwnership(initialOwner);
    }

    /// @notice Adds an operator to the registry.
    /// @param name The name of the operator.
    /// @param managerAddress The manager address of the operator.
    /// @param rewardAddress The reward address of the operator.
    /// @return id The ID of the operator.
    function addOperator(string calldata name, address managerAddress, address rewardAddress)
        external
        onlyOwner
        returns (uint256 id)
    {
        if (bytes(name).length == 0) revert INVALID_NAME();
        if (managerAddress == address(0)) revert INVALID_MANAGER_ADDRESS();
        if (rewardAddress == address(0)) revert INVALID_REWARD_ADDRESS();

        id = ++operatorCount;

        Operator storage operator = operators[id];
        operator.name = name;
        operator.active = true;
        operator.managerAddress = managerAddress;
        operator.rewardAddress = rewardAddress;

        emit OperatorAdded(id, name, managerAddress, rewardAddress);
    }

    /// @notice Activates an operator.
    /// @param operatorId The ID of the operator.
    function activateOperator(uint256 operatorId) external onlyOwner {
        if (operatorId == 0 || operatorId > operatorCount) revert INVALID_OPERATOR_ID();

        Operator storage operator = operators[operatorId];
        if (operator.active) revert OPERATOR_ALREADY_ACTIVE();

        operators[operatorId].active = true;

        emit OperatorActivated(operatorId);
    }

    /// @notice Deactivates an operator.
    /// @param operatorId The ID of the operator.
    function deactivateOperator(uint256 operatorId) external onlyOwner {
        if (operatorId == 0 || operatorId > operatorCount) revert INVALID_OPERATOR_ID();

        Operator storage operator = operators[operatorId];
        if (!operator.active) revert OPERATOR_ALREADY_INACTIVE();

        operators[operatorId].active = false;

        emit OperatorDeactivated(operatorId);
    }

    /// @notice Sets an operator's name.
    /// @param operatorId The ID of the operator.
    /// @param newName The name of the operator.
    function setOperatorName(uint256 operatorId, string calldata newName) external onlyOperatorManager(operatorId) {
        if (bytes(newName).length == 0) revert INVALID_NAME();

        operators[operatorId].name = newName;

        emit OperatorNameSet(operatorId, newName);
    }

    /// @notice Sets an operator's pending manager address.
    /// @param operatorId The ID of the operator.
    /// @param newManagerAddress The manager address of the operator.
    function setPendingOperatorManagerAddress(uint256 operatorId, address newManagerAddress)
        external
        onlyOperatorManager(operatorId)
    {
        if (newManagerAddress == address(0)) revert INVALID_MANAGER_ADDRESS();

        operators[operatorId].pendingManagerAddress = newManagerAddress;

        emit OperatorPendingManagerAddressSet(operatorId, newManagerAddress);
    }

    /// @notice Confirms an operator's pending manager address.
    /// @param operatorId The ID of the operator.
    function confirmOperatorManagerAddress(uint256 operatorId) external {
        address sender = _msgSender();

        Operator storage operator = operators[operatorId];
        if (sender != operator.pendingManagerAddress) revert ONLY_PENDING_OPERATOR_MANAGER();

        delete operator.pendingManagerAddress;
        operator.managerAddress = sender;

        emit OperatorManagerAddressSet(operatorId, sender);
    }

    /// @notice Sets an operator's reward address.
    /// @param operatorId The ID of the operator.
    /// @param newRewardAddress The new reward address of the operator.
    function setOperatorRewardAddress(uint256 operatorId, address newRewardAddress)
        external
        onlyOperatorManager(operatorId)
    {
        if (newRewardAddress == address(0)) revert INVALID_REWARD_ADDRESS();

        operators[operatorId].rewardAddress = newRewardAddress;

        emit OperatorRewardAddressSet(operatorId, newRewardAddress);
    }

    function getPoRAddressListLength() external view override returns (uint256) {}

    function getPoRAddressList(uint256 startIndex, uint256 endIndex) external view override returns (string[] memory) {}

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
