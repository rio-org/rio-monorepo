// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {LibMap} from '@solady/utils/LibMap.sol';
import {FixedPointMathLib} from '@solady/utils/FixedPointMathLib.sol';
import {UUPSUpgradeable} from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {BeaconProxy} from '@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol';
import {OperatorUtilizationHeap} from './lib/utils/OperatorUtilizationHeap.sol';
import {IOperatorRegistry} from './interfaces/IOperatorRegistry.sol';
import {IOperator} from './interfaces/IOperator.sol';

contract OperatorRegistry is IOperatorRegistry, OwnableUpgradeable, UUPSUpgradeable {
    using OperatorUtilizationHeap for OperatorUtilizationHeap.Data;
    using FixedPointMathLib for *;
    using LibMap for *;

    /// @notice The maximum number of operators allowed in the registry.
    uint8 public constant MAX_OPERATOR_COUNT = type(uint8).max;

    /// @notice The maximum number of active operators allowed.
    uint8 public constant MAX_ACTIVE_OPERATOR_COUNT = 64;

    /// @notice The operator contract implementation.
    address public immutable operatorImpl;

    /// @notice The total number of operators in the registry.
    uint8 public operatorCount;

    /// @notice The number of active operators in the registry.
    uint8 public activeOperatorCount;

    /// @notice The packed operator IDs, stored in a utilization priority queue, indexed by token address.
    mapping(address => LibMap.Uint8Map) activeOperatorsByTokenUtilization;

    /// @notice A mapping of operator ids to operator information.
    mapping(uint8 => OperatorInfo) public operatorInfo;

    /// @notice Require that the caller is the operator's manager.
    /// @param operatorId The operator's ID.
    modifier onlyOperatorManager(uint8 operatorId) {
        if (msg.sender != operatorInfo[operatorId].manager) revert ONLY_OPERATOR_MANAGER();
        _;
    }

    /// @param _operatorImpl The operator contract implementation.
    constructor(address _operatorImpl) {
        operatorImpl = _operatorImpl;
    }

    /// @notice Initializes the contract.
    /// @param initialOwner The initial owner of the contract.
    function initialize(address initialOwner) external initializer {
        __UUPSUpgradeable_init();
        _transferOwnership(initialOwner);
    }

    /// @notice Creates and registers a new operator.
    /// @param initialManager The initial manager of the operator.
    /// @param initialEarningsReceiver The initial reward address of the operator.
    /// @param initialMetadataURI The initial metadata URI.
    function createOperator(address initialManager, address initialEarningsReceiver, string calldata initialMetadataURI)
        external
        onlyOwner
        returns (uint8 operatorId)
    {
        if (initialManager == address(0)) revert INVALID_MANAGER();
        if (initialEarningsReceiver == address(0)) revert INVALID_EARNINGS_RECEIVER();
        if (bytes(initialMetadataURI).length == 0) revert INVALID_METADATA_URI();

        if (operatorCount == MAX_OPERATOR_COUNT) revert MAX_OPERATOR_COUNT_EXCEEDED();
        if (activeOperatorCount == MAX_ACTIVE_OPERATOR_COUNT) revert MAX_ACTIVE_OPERATOR_COUNT_EXCEEDED();

        // Increment the operator count after assignment (First operator ID is 0)
        operatorId = operatorCount++;
        activeOperatorCount++;

        address operator = _deployAndRegisterOperator(initialEarningsReceiver, initialMetadataURI);

        OperatorInfo storage info = operatorInfo[operatorId];
        info.active = true;
        info.manager = initialManager;
        info.earningsReceiver = initialEarningsReceiver;
        info.operator = operator;

        // TODO: Add asset cap(s) parameter and insert the operator into the heap.

        emit OperatorCreated(operatorId, operator, initialManager, initialEarningsReceiver, initialMetadataURI);
    }

    /// @notice Activates an operator.
    /// @param operatorId The operator's ID.
    function activateOperator(uint8 operatorId) external onlyOwner {
        OperatorInfo storage info = operatorInfo[operatorId];

        if (info.manager == address(0)) revert INVALID_OPERATOR();
        if (info.active) revert OPERATOR_ALREADY_ACTIVE();

        info.active = true;
        activeOperatorCount += 1;

        // TODO: Insert operator into the heap.

        emit OperatorActivated(operatorId);
    }

    /// @notice Deactivates an operator.
    /// @param operatorId The operator's ID.
    function deactivateOperator(uint8 operatorId) external onlyOwner {
        OperatorInfo storage info = operatorInfo[operatorId];

        if (info.manager == address(0)) revert INVALID_OPERATOR();
        if (!info.active) revert OPERATOR_ALREADY_INACTIVE();

        info.active = false;
        activeOperatorCount -= 1;

        // TODO: Remove operator from the heap.

        emit OperatorDeactivated(operatorId);
    }

    /// @notice Sets an operator's earnings receiver.
    /// @param operatorId The operator's ID.
    /// @param newEarningsReceiver The new reward address of the operator.
    function setOperatorEarningsReceiver(uint8 operatorId, address newEarningsReceiver) external onlyOperatorManager(operatorId) {
        if (newEarningsReceiver == address(0)) revert INVALID_EARNINGS_RECEIVER();

        OperatorInfo storage info = operatorInfo[operatorId];

        // Update both the Rio and EigenLayer earnings receivers.
        info.earningsReceiver = newEarningsReceiver;
        IOperator(info.operator).setEarningsReceiver(newEarningsReceiver);

        emit OperatorEarningsReceiverSet(operatorId, newEarningsReceiver);
    }

    /// @notice Sets the operator's metadata URI.
    /// @param operatorId The operator's ID.
    /// @param metadataURI The new metadata URI.
    function setOperatorMetadataURI(uint8 operatorId, string calldata metadataURI) external onlyOperatorManager(operatorId) {
        if (bytes(metadataURI).length == 0) revert INVALID_METADATA_URI();

        IOperator(operatorInfo[operatorId].operator).setMetadataURI(metadataURI);

        emit OperatorMetadataURISet(operatorId, metadataURI);
    }

    /// @notice Sets an operator's pending manager.
    /// @param operatorId The operator's ID.
    /// @param newPendingManager The new pending manager of the operator.
    function setOperatorPendingManager(uint8 operatorId, address newPendingManager) external onlyOperatorManager(operatorId) {
        if (newPendingManager == address(0)) revert INVALID_PENDING_MANAGER();

        operatorInfo[operatorId].pendingManager = newPendingManager;

        emit OperatorPendingManagerSet(operatorId, newPendingManager);
    }

    /// @notice Confirms an operator's pending manager.
    /// @param operatorId The operator's ID.
    function confirmOperatorManager(uint8 operatorId) external {
        address sender = _msgSender();

        OperatorInfo storage info = operatorInfo[operatorId];
        if (sender != info.pendingManager) revert ONLY_OPERATOR_PENDING_MANAGER();

        delete info.pendingManager;
        info.manager = sender;

        emit OperatorManagerSet(operatorId, sender);
    }

    // TODO: Restrict `allocate` function to the LRT asset manager.

    /// @notice Allocates a specified amount of tokens to the operators with the lowest utilization.
    /// @param token The token to allocate.
    /// @param allocationSize The amount of tokens to allocate.
    function allocate(address token, uint256 allocationSize) external returns (uint256 allocated, OperatorAllocation[] memory allocations) {
        allocations = new OperatorAllocation[](activeOperatorCount);

        OperatorUtilizationHeap.Data memory heap = _getOperatorUtilizationHeapForToken(token);
        if (heap.isEmpty()) revert NO_ACTIVE_OPERATORS();

        OperatorUtilizationHeap.Operator memory operator;
        uint256 allocationIndex;
        while (allocated < allocationSize) {
            operator = heap.getMin();

            OperatorInfo storage info = operatorInfo[operator.id];
            OperatorAssetInfo memory asset = info.assets[token];

            // If the allocation of the operator with the lowest utilization rate is met,
            // then exit early. We will not be able to allocate to any other operators.
            if (asset.allocation >= asset.cap) break;

            uint256 allocation = FixedPointMathLib.min(asset.cap - asset.allocation, allocationSize);

            allocations[allocationIndex] = OperatorAllocation(info.operator, allocation);
            allocated += allocation;

            heap.updateUtilization(OperatorUtilizationHeap.ROOT_INDEX, allocation.divWad(asset.cap));

            unchecked {
                ++allocationIndex;
            }
        }

        // Update the operator utilization heap in storage.
        _updateOperatorUtilizationHeapForToken(token, heap);

        // Shrink the array length to the number of allocations made.
        if (allocationIndex < activeOperatorCount) {
            assembly {
                mstore(allocations, allocationIndex)
            }
        }
    }

    function getPoRAddressListLength() external view override returns (uint256) {}

    function getPoRAddressList(uint256 startIndex, uint256 endIndex) external view override returns (string[] memory) {}

    /// @dev Returns the operator utilization heap for the specified token.
    /// @param token The token to get the heap for.
    function _getOperatorUtilizationHeapForToken(address token) internal view returns (OperatorUtilizationHeap.Data memory heap) {
        uint8 numActiveOperators = activeOperatorCount;
        if (numActiveOperators == 0) return OperatorUtilizationHeap.Data(new OperatorUtilizationHeap.Operator[](0), 0);

        heap = OperatorUtilizationHeap.initialize(MAX_ACTIVE_OPERATOR_COUNT);

        // TODO: Consider loading into memory.
        LibMap.Uint8Map storage operators = activeOperatorsByTokenUtilization[token];
        for (uint8 i = 0; i < numActiveOperators;) {
            unchecked {
                uint8 id = operators.get(i);

                OperatorAssetInfo memory asset = operatorInfo[id].assets[token];
                heap.operators[i + 1] = OperatorUtilizationHeap.Operator({
                    id: id,
                    utilization: asset.allocation.divWad(asset.cap)
                });

                ++i;
            }
        }
    }

    /// @dev Updates the operator utilization heap in storage for the specified token.
    /// @param token The token to update the heap for.
    /// @param heap The heap used to update storage.
    function _updateOperatorUtilizationHeapForToken(address token, OperatorUtilizationHeap.Data memory heap) internal {
        LibMap.Uint8Map storage operators = activeOperatorsByTokenUtilization[token];

        uint8 numActiveOperators = activeOperatorCount;
        for (uint8 i = 0; i < numActiveOperators;) {
            unchecked {
                operators.set(i, heap.operators[i + 1].id);
                ++i;
            }
        }
    }

    // forgefmt: disable-next-item
    /// @dev Deploys and registers a new operator contract with the provided parameters.
    /// @param initialEarningsReceiver The initial reward address of the operator.
    /// @param initialMetadataURI The initial metadata URI.
    function _deployAndRegisterOperator(address initialEarningsReceiver, string calldata initialMetadataURI) internal returns (address operator) {
        operator = address(
            new BeaconProxy(operatorImpl, abi.encodeCall(IOperator.initialize, (initialEarningsReceiver, initialMetadataURI)))
        );
    }

    /// @dev Allows the owner to upgrade the operator registry implementation.
    /// @param newImplementation The new implementation to upgrade to.
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
