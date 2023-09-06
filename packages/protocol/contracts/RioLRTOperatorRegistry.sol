// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {LibMap} from '@solady/utils/LibMap.sol';
import {FixedPointMathLib} from '@solady/utils/FixedPointMathLib.sol';
import {UUPSUpgradeable} from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {IERC20} from '@balancer-v2/contracts/interfaces/contracts/solidity-utils/openzeppelin/IERC20.sol';
import {IVault} from '@balancer-v2/contracts/interfaces/contracts/vault/IVault.sol';
import {IRioLRTOperatorRegistry} from './interfaces/IRioLRTOperatorRegistry.sol';
import {BeaconProxy} from '@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol';
import {OperatorUtilizationHeap} from './lib/utils/OperatorUtilizationHeap.sol';
import {IOperator} from './interfaces/IOperator.sol';

contract RioLRTOperatorRegistry is IRioLRTOperatorRegistry, OwnableUpgradeable, UUPSUpgradeable {
    using OperatorUtilizationHeap for OperatorUtilizationHeap.Data;
    using FixedPointMathLib for *;
    using LibMap for *;

    /// @notice The maximum number of operators allowed in the registry.
    uint8 public constant MAX_OPERATOR_COUNT = 254;

    /// @notice The maximum number of active operators allowed.
    uint8 public constant MAX_ACTIVE_OPERATOR_COUNT = 64;

    /// @notice The Balancer vault contract.
    IVault public immutable vault;

    /// @notice The operator contract implementation.
    address public immutable operatorImpl;

    /// @notice The LRT Balancer pool ID.
    bytes32 public poolId;

    /// @notice The LRT asset manager.
    address public assetManager;

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

    /// @notice Require that the caller is the asset manager.
    modifier onlyAssetManager() {
        if (msg.sender != assetManager) revert ONLY_ASSET_MANAGER();
        _;
    }

    /// @param _vault The Balancer vault contract.
    /// @param _operatorImpl The operator contract implementation.
    constructor(address _vault, address _operatorImpl) {
        vault = IVault(_vault);
        operatorImpl = _operatorImpl;
    }

    /// @notice Initializes the contract.
    /// @param initialOwner The initial owner of the contract.
    /// @param _poolId The LRT Balancer pool ID.
    /// @param _assetManager The LRT asset manager.
    function initialize(address initialOwner, bytes32 _poolId, address _assetManager) external initializer {
        __UUPSUpgradeable_init();
        _transferOwnership(initialOwner);

        poolId = _poolId;
        assetManager = _assetManager;
    }

    /// @notice Creates and registers a new operator.
    /// @param initialManager The initial manager of the operator.
    /// @param initialEarningsReceiver The initial reward address of the operator.
    /// @param initialMetadataURI The initial metadata URI.
    /// @param configs The asset cap configurations.
    function createOperator(
        address initialManager,
        address initialEarningsReceiver,
        string calldata initialMetadataURI,
        AssetCapConfig[] calldata configs
    ) external onlyOwner returns (uint8 operatorId) {
        if (initialManager == address(0)) revert INVALID_MANAGER();
        if (initialEarningsReceiver == address(0)) revert INVALID_EARNINGS_RECEIVER();
        if (bytes(initialMetadataURI).length == 0) revert INVALID_METADATA_URI();

        if (operatorCount == MAX_OPERATOR_COUNT) revert MAX_OPERATOR_COUNT_EXCEEDED();
        if (activeOperatorCount == MAX_ACTIVE_OPERATOR_COUNT) revert MAX_ACTIVE_OPERATOR_COUNT_EXCEEDED();

        // Increment the operator count before assignment (First operator ID is 1)
        operatorId = ++operatorCount;
        activeOperatorCount += 1;

        address operator = _deployAndRegisterOperator(initialEarningsReceiver, initialMetadataURI);

        OperatorInfo storage info = operatorInfo[operatorId];
        info.active = true;
        info.manager = initialManager;
        info.earningsReceiver = initialEarningsReceiver;
        info.operator = operator;

        for (uint256 i = 0; i < configs.length; ++i) {
            AssetCapConfig memory config = configs[i];
            if (config.cap == 0) continue;

            info.assets[config.token] = OperatorAssetInfo(config.cap, 0);
            _insertOperatorIntoUtilizationHeapForToken(config.token, operatorId, 0);
        }

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

        (IERC20[] memory registeredTokens,,) = vault.getPoolTokens(poolId);
        for (uint256 i = 0; i < registeredTokens.length; ++i) {
            OperatorAssetInfo memory asset = info.assets[address(registeredTokens[i])];
            if (asset.cap == 0) continue;

            _insertOperatorIntoUtilizationHeapForToken(
                address(registeredTokens[i]), operatorId, asset.allocation.divWad(asset.cap)
            );
        }

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

        (IERC20[] memory registeredTokens,,) = vault.getPoolTokens(poolId);
        for (uint256 i = 0; i < registeredTokens.length; ++i) {
            OperatorAssetInfo memory asset = info.assets[address(registeredTokens[i])];
            if (asset.cap == 0) continue;

            _removeOperatorFromUtilizationHeapForToken(address(registeredTokens[i]), operatorId);
        }

        emit OperatorDeactivated(operatorId);
    }

    /// @notice Sets the operator's asset caps using the provided configurations.
    /// @param operatorId The operator's ID.
    /// @param newConfigs The new asset cap configurations.
    function setOperatorAssetCaps(uint8 operatorId, AssetCapConfig[] calldata newConfigs) external onlyOwner {
        OperatorInfo storage info = operatorInfo[operatorId];
        if (info.manager == address(0)) revert INVALID_OPERATOR();

        for (uint256 i = 0; i < newConfigs.length; ++i) {
            AssetCapConfig memory incoming = newConfigs[i];
            OperatorAssetInfo memory current = info.assets[incoming.token];

            if (current.cap == incoming.cap) continue; // No change

            if (current.cap != 0 && incoming.cap == 0) {
                _removeOperatorFromUtilizationHeapForToken(incoming.token, operatorId);
            } else if (current.cap == 0 && incoming.cap != 0) {
                _insertOperatorIntoUtilizationHeapForToken(incoming.token, operatorId, current.allocation.divWad(incoming.cap));
            } else {
                _updateOperatorInUtilizationHeapForToken(incoming.token, operatorId, current.allocation.divWad(incoming.cap));
            }
            emit OperatorAssetCapSet(operatorId, incoming.token, incoming.cap);
        }
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

    /// @notice Allocates a specified amount of tokens to the operators with the lowest utilization.
    /// @param token The token to allocate.
    /// @param allocationSize The amount of tokens to allocate.
    function allocate(address token, uint256 allocationSize) external onlyAssetManager returns (uint256 allocated, OperatorAllocation[] memory allocations) {
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

        LibMap.Uint8Map storage operators = activeOperatorsByTokenUtilization[token];
        unchecked {
            for (uint8 i = 0; i < numActiveOperators; ++i) {
                uint8 operatorId = operators.get(i);

                // Non-existent operator ID. We've reached the end of the heap.
                if (operatorId == 0) break;

                OperatorAssetInfo memory asset = operatorInfo[operatorId].assets[token];
                heap.operators[i + 1] = OperatorUtilizationHeap.Operator({
                    id: operatorId,
                    utilization: asset.allocation.divWad(asset.cap)
                });
            }
        }
    }

    /// @dev Updates the operator utilization heap in storage for the specified token.
    /// @param token The token to update the heap for.
    /// @param heap The heap used to update storage.
    function _updateOperatorUtilizationHeapForToken(address token, OperatorUtilizationHeap.Data memory heap) internal {
        LibMap.Uint8Map storage operators = activeOperatorsByTokenUtilization[token];
        for (uint8 i = 0; i < heap.count;) {
            unchecked {
                operators.set(i, heap.operators[i + 1].id);
                ++i;
            }
        }
    }

    /// @dev Inserts an operator into the utilization heap for the specified token and updates the heap in storage.
    /// @param token The token address.
    /// @param operatorId The operator's ID.
    /// @param utilization The operator's utilization.
    function _insertOperatorIntoUtilizationHeapForToken(address token, uint8 operatorId, uint256 utilization) internal {
        OperatorUtilizationHeap.Data memory heap = _getOperatorUtilizationHeapForToken(token);
        heap.insert(OperatorUtilizationHeap.Operator(operatorId, utilization));

        _updateOperatorUtilizationHeapForToken(token, heap);
    }

    /// @dev Removes an operator from the utilization heap for the specified token and updates the heap in storage.
    /// @param token The token address.
    /// @param operatorId The operator's ID.
    function _removeOperatorFromUtilizationHeapForToken(address token, uint8 operatorId) internal {
        OperatorUtilizationHeap.Data memory heap = _getOperatorUtilizationHeapForToken(token);
        heap.removeByID(operatorId);

        _updateOperatorUtilizationHeapForToken(token, heap);
    }

    /// @dev Updates an operator in the utilization heap for the specified token and updates the heap in storage.
    /// @param token The token address.
    /// @param operatorId The operator's ID.
    /// @param utilization The operator's utilization.
    function _updateOperatorInUtilizationHeapForToken(address token, uint8 operatorId, uint256 utilization) internal {
        OperatorUtilizationHeap.Data memory heap = _getOperatorUtilizationHeapForToken(token);
        heap.updateUtilizationByID(operatorId, utilization);

        _updateOperatorUtilizationHeapForToken(token, heap);
    }

    // forgefmt: disable-next-item
    /// @dev Deploys and registers a new operator contract with the provided parameters.
    /// @param initialEarningsReceiver The initial reward address of the operator.
    /// @param initialMetadataURI The initial metadata URI.
    function _deployAndRegisterOperator(address initialEarningsReceiver, string calldata initialMetadataURI) internal returns (address operator) {
        operator = address(
            new BeaconProxy(operatorImpl, abi.encodeCall(IOperator.initialize, (assetManager, initialEarningsReceiver, initialMetadataURI)))
        );
    }

    /// @dev Allows the owner to upgrade the operator registry implementation.
    /// @param newImplementation The new implementation to upgrade to.
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
