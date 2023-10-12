// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {LibMap} from '@solady/utils/LibMap.sol';
import {FixedPointMathLib} from '@solady/utils/FixedPointMathLib.sol';
import {BeaconProxy} from '@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol';
import {UUPSUpgradeable} from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {IERC20} from '@balancer-v2/contracts/interfaces/contracts/solidity-utils/openzeppelin/IERC20.sol';
import {IVault} from '@balancer-v2/contracts/interfaces/contracts/vault/IVault.sol';
import {IRioLRTOperatorRegistry} from 'contracts/interfaces/IRioLRTOperatorRegistry.sol';
import {OperatorUtilizationHeap} from 'contracts/utils/OperatorUtilizationHeap.sol';
import {IRioLRTOperator} from 'contracts/interfaces/IRioLRTOperator.sol';
import {ValidatorDetails} from 'contracts/utils/ValidatorDetails.sol';

contract RioLRTOperatorRegistry is IRioLRTOperatorRegistry, OwnableUpgradeable, UUPSUpgradeable {
    using OperatorUtilizationHeap for OperatorUtilizationHeap.Data;
    using ValidatorDetails for bytes32;
    using FixedPointMathLib for *;
    using LibMap for *;

    /// @notice The maximum number of operators allowed in the registry.
    uint8 public constant MAX_OPERATOR_COUNT = 254;

    /// @notice The maximum number of active operators allowed.
    uint8 public constant MAX_ACTIVE_OPERATOR_COUNT = 64;

    /// @dev The validator details storage position.
    bytes32 internal constant VALIDATOR_DETAILS_POSITION = keccak256('RIO.OPERATOR_REGISTRY.VALIDATOR_DETAILS');

    /// @notice The Balancer vault contract.
    IVault public immutable vault;

    /// @notice The operator contract implementation.
    address public immutable operatorImpl;

    /// @notice The LRT Balancer pool ID.
    bytes32 public poolId;

    /// @notice The LRT reward distributor.
    address public rewardDistributor;

    /// @notice The LRT asset manager.
    address public assetManager;

    /// @notice The total number of operators in the registry.
    uint8 public operatorCount;

    /// @notice The number of active operators in the registry.
    uint8 public activeOperatorCount;

    /// @notice The amount of time (in seconds) before uploaded validator keys are considered "vetted".
    uint24 public validatorKeyReviewPeriod;

    /// @notice The packed operator IDs, stored in a utilization priority queue, for ETH validators.
    LibMap.Uint8Map internal activeOperatorsByETHDepositUtilization;

    /// @notice The packed operator IDs, stored in a utilization priority queue, indexed by token address.
    mapping(address => LibMap.Uint8Map) internal activeOperatorsByTokenUtilization;

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

    // forgefmt: disable-next-item
    /// @notice Initializes the contract.
    /// @param initialOwner The initial owner of the contract.
    /// @param _poolId The LRT Balancer pool ID.
    /// @param _rewardDistributor The LRT reward distributor.
    /// @param _assetManager The LRT asset manager.
    function initialize(address initialOwner, bytes32 _poolId, address _rewardDistributor, address _assetManager) external initializer {
        __UUPSUpgradeable_init();
        _transferOwnership(initialOwner);

        poolId = _poolId;
        rewardDistributor = _rewardDistributor;
        assetManager = _assetManager;

        _setValidatorKeyReviewPeriod(3 days);
    }

    /// @notice Creates and registers a new operator.
    /// @param initialManager The initial manager of the operator.
    /// @param initialEarningsReceiver The initial reward address of the operator.
    /// @param initialMetadataURI The initial metadata URI.
    /// @param configs The token allocation cap configurations.
    /// @param validatorCap The maximum number of active validators allowed.
    function createOperator(
        address initialManager,
        address initialEarningsReceiver,
        string calldata initialMetadataURI,
        TokenCapConfig[] calldata configs,
        uint40 validatorCap
    ) external onlyOwner returns (uint8 operatorId) {
        if (initialManager == address(0)) revert INVALID_MANAGER();
        if (initialEarningsReceiver == address(0)) revert INVALID_EARNINGS_RECEIVER();
        if (bytes(initialMetadataURI).length == 0) revert INVALID_METADATA_URI();

        if (operatorCount == MAX_OPERATOR_COUNT) revert MAX_OPERATOR_COUNT_EXCEEDED();
        if (activeOperatorCount == MAX_ACTIVE_OPERATOR_COUNT) revert MAX_ACTIVE_OPERATOR_COUNT_EXCEEDED();

        // Increment the operator count before assignment (First operator ID is 1)
        operatorId = ++operatorCount;
        activeOperatorCount += 1;

        address operator = _deployAndRegisterOperator(initialMetadataURI);

        OperatorInfo storage info = operatorInfo[operatorId];
        info.active = true;
        info.manager = initialManager;
        info.earningsReceiver = initialEarningsReceiver;
        info.operator = operator;

        emit OperatorCreated(operatorId, operator, initialManager, initialEarningsReceiver, initialMetadataURI);

        TokenCapConfig memory config;
        OperatorUtilizationHeap.Data memory heap;

        // Populate the token allocation caps for the operator.
        for (uint256 i = 0; i < configs.length; ++i) {
            config = configs[i];
            if (config.cap == 0) continue;

            info.tokens[config.token] = OperatorTokenInfo(config.cap, 0);

            heap = _getOperatorUtilizationHeapForToken(config.token);
            heap.insert(OperatorUtilizationHeap.Operator(operatorId, 0));

            _updateOperatorUtilizationHeap(heap, activeOperatorsByTokenUtilization[config.token]);

            emit OperatorTokenCapSet(operatorId, config.token, config.cap);
        }

        // Populate the validator cap for the operator, if applicable.
        if (validatorCap != 0) {
            info.validators.cap = validatorCap;

            heap = _getOperatorUtilizationHeapForETH();
            heap.insert(OperatorUtilizationHeap.Operator(operatorId, 0));

            _updateOperatorUtilizationHeap(heap, activeOperatorsByETHDepositUtilization);

            emit OperatorValidatorCapSet(operatorId, validatorCap);
        }
    }

    /// @notice Activates an operator.
    /// @param operatorId The operator's ID.
    function activateOperator(uint8 operatorId) external onlyOwner {
        OperatorInfo storage info = operatorInfo[operatorId];

        if (info.manager == address(0)) revert INVALID_OPERATOR();
        if (info.active) revert OPERATOR_ALREADY_ACTIVE();

        info.active = true;
        activeOperatorCount += 1;

        address tokenAddress;
        OperatorTokenInfo memory token;
        OperatorUtilizationHeap.Data memory heap;
        (IERC20[] memory registeredTokens,,) = vault.getPoolTokens(poolId);
        for (uint256 i = 0; i < registeredTokens.length; ++i) {
            tokenAddress = address(registeredTokens[i]);
            token = info.tokens[tokenAddress];
            if (token.cap == 0) continue;

            heap = _getOperatorUtilizationHeapForToken(tokenAddress);
            heap.insert(OperatorUtilizationHeap.Operator(operatorId, token.allocation.divWad(token.cap)));

            _updateOperatorUtilizationHeap(heap, activeOperatorsByTokenUtilization[tokenAddress]);
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

        OperatorTokenInfo memory token;
        OperatorUtilizationHeap.Data memory heap;
        (IERC20[] memory registeredTokens,,) = vault.getPoolTokens(poolId);
        for (uint256 i = 0; i < registeredTokens.length; ++i) {
            token = info.tokens[address(registeredTokens[i])];
            if (token.cap == 0) continue;

            heap = _getOperatorUtilizationHeapForToken(address(registeredTokens[i]));
            heap.removeByID(operatorId);

            _updateOperatorUtilizationHeap(heap, activeOperatorsByTokenUtilization[address(registeredTokens[i])]);
        }

        emit OperatorDeactivated(operatorId);
    }

    // forgefmt: disable-next-item
    /// @notice Sets the operator's token allocation caps using the provided configurations.
    /// @param operatorId The operator's ID.
    /// @param newConfigs The new token allocation cap configurations.
    function setOperatorTokenCaps(uint8 operatorId, TokenCapConfig[] calldata newConfigs) external onlyOwner {
        OperatorInfo storage info = operatorInfo[operatorId];
        if (info.manager == address(0)) revert INVALID_OPERATOR();

        for (uint256 i = 0; i < newConfigs.length; ++i) {
            TokenCapConfig memory incoming = newConfigs[i];
            OperatorTokenInfo memory current = info.tokens[incoming.token];

            if (current.cap == incoming.cap) continue; // No change

            OperatorUtilizationHeap.Data memory heap = _getOperatorUtilizationHeapForToken(incoming.token);
            if (current.cap != 0 && incoming.cap == 0) {
                heap.removeByID(operatorId);
            } else if (current.cap == 0 && incoming.cap != 0) {
                heap.insert(OperatorUtilizationHeap.Operator(operatorId, current.allocation.divWad(incoming.cap)));
            } else {
                heap.updateUtilizationByID(operatorId, current.allocation.divWad(incoming.cap));
            }
            _updateOperatorUtilizationHeap(heap, activeOperatorsByTokenUtilization[incoming.token]);

            emit OperatorTokenCapSet(operatorId, incoming.token, incoming.cap);
        }
    }

    /// @notice Sets the operator's maximum active validator cap.
    /// @param operatorId The operator's ID.
    /// @param newValidatorCap The new maximum active validator cap.
    function setOperatorValidatorCap(uint8 operatorId, uint40 newValidatorCap) external onlyOwner {
        OperatorInfo storage info = operatorInfo[operatorId];
        if (info.manager == address(0)) revert INVALID_OPERATOR();

        OperatorValidators memory validators = info.validators;
        if (validators.cap == newValidatorCap) return; // No change

        uint40 activeDeposits = validators.deposited - validators.exited;

        OperatorUtilizationHeap.Data memory heap = _getOperatorUtilizationHeapForETH();
        if (validators.cap != 0 && newValidatorCap == 0) {
            heap.removeByID(operatorId);
        } else if (validators.cap == 0 && newValidatorCap != 0) {
            heap.insert(OperatorUtilizationHeap.Operator(operatorId, activeDeposits.divWad(newValidatorCap)));
        } else {
            heap.updateUtilizationByID(operatorId, activeDeposits.divWad(newValidatorCap));
        }
        _updateOperatorUtilizationHeap(heap, activeOperatorsByETHDepositUtilization);

        emit OperatorValidatorCapSet(operatorId, newValidatorCap);
    }

    /// @notice Sets the amount of time (in seconds) before uploaded validator keys are considered "vetted".
    /// @param newValidatorKeyReviewPeriod The new validator key review period.
    function setValidatorKeyReviewPeriod(uint24 newValidatorKeyReviewPeriod) external onlyOwner {
        _setValidatorKeyReviewPeriod(newValidatorKeyReviewPeriod);
    }

    // forgefmt: disable-next-item
    /// @notice Sets an operator's earnings receiver.
    /// @param operatorId The operator's ID.
    /// @param newEarningsReceiver The new reward address of the operator.
    function setOperatorEarningsReceiver(uint8 operatorId, address newEarningsReceiver) external onlyOperatorManager(operatorId) {
        if (newEarningsReceiver == address(0)) revert INVALID_EARNINGS_RECEIVER();

        operatorInfo[operatorId].earningsReceiver = newEarningsReceiver;

        emit OperatorEarningsReceiverSet(operatorId, newEarningsReceiver);
    }

    // forgefmt: disable-next-item
    /// @notice Sets the operator's metadata URI.
    /// @param operatorId The operator's ID.
    /// @param metadataURI The new metadata URI.
    function setOperatorMetadataURI(uint8 operatorId, string calldata metadataURI) external onlyOperatorManager(operatorId) {
        if (bytes(metadataURI).length == 0) revert INVALID_METADATA_URI();

        IRioLRTOperator(operatorInfo[operatorId].operator).setMetadataURI(metadataURI);

        emit OperatorMetadataURISet(operatorId, metadataURI);
    }

    // forgefmt: disable-next-item
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

    /// @notice Adds pending validator details (public keys and signatures) to storage for the provided operator.
    /// Each added batch extends the timestamp at which the details will be considered confirmed.
    /// @param operatorId The operator's ID.
    /// @param validatorCount The number of validators in the batch.
    /// @param publicKeys The validator public keys.
    /// @param signatures The validator signatures.
    function addValidatorDetails(
        uint8 operatorId,
        uint256 validatorCount,
        bytes calldata publicKeys,
        bytes calldata signatures
    ) external onlyOperatorManager(operatorId) {
        OperatorInfo storage info = operatorInfo[operatorId];
        OperatorValidators memory validators = info.validators;

        if (validatorCount == 0) revert INVALID_VALIDATOR_COUNT();

        // First check if there are any pending validator details that can be moved into a confirmed state.
        if (validators.total > validators.confirmed && block.timestamp >= validators.nextConfirmationTimestamp) {
            info.validators.confirmed = validators.confirmed = validators.total;
        }

        info.validators.total =VALIDATOR_DETAILS_POSITION.saveValidatorDetails(
            operatorId, validators.total, validatorCount, publicKeys, signatures
        );
        info.validators.nextConfirmationTimestamp = uint40(block.timestamp + validatorKeyReviewPeriod);

        emit OperatorPendingValidatorDetailsAdded(operatorId, validatorCount);
    }

    /// @notice Removes pending validator details (public keys and signatures) from storage for the provided operator.
    /// @param operatorId The operator's ID.
    /// @param fromIndex The index of the first validator to remove.
    /// @param validatorCount The number of validator to remove.
    function removeValidatorDetails(uint8 operatorId, uint256 fromIndex, uint256 validatorCount) external onlyOperatorManager(operatorId) {
        OperatorInfo storage info = operatorInfo[operatorId];
        OperatorValidators memory validators = info.validators;

        if (validatorCount == 0) revert INVALID_VALIDATOR_COUNT();
        if (fromIndex < validators.confirmed || fromIndex + validatorCount > validators.total) revert INVALID_INDEX();

        info.validators.total = VALIDATOR_DETAILS_POSITION.removeValidatorDetails(
            operatorId, fromIndex, validatorCount, validators.total
        );
        emit OperatorPendingValidatorDetailsRemoved(operatorId, validatorCount);
    }

    // forgefmt: disable-next-item
    /// @notice Allocates a specified amount of ERC20 tokens to the operators with the lowest utilization.
    /// @param tokenToAllocate The token to allocate.
    /// @param allocationSize The amount of tokens to allocate.
    function allocateERC20(address tokenToAllocate, uint256 allocationSize) external onlyAssetManager returns (uint256 allocated, OperatorTokenAllocation[] memory allocations) {
        allocations = new OperatorTokenAllocation[](activeOperatorCount);

        OperatorUtilizationHeap.Data memory heap = _getOperatorUtilizationHeapForToken(tokenToAllocate);
        if (heap.isEmpty()) revert NO_ACTIVE_OPERATORS_WITH_NON_ZERO_CAP();

        OperatorUtilizationHeap.Operator memory operator;
        OperatorTokenInfo memory token;
        uint256 allocationIndex;
        uint256 allocation;
        while (allocated < allocationSize) {
            operator = heap.getMin();

            OperatorInfo storage info = operatorInfo[operator.id];
            token = info.tokens[tokenToAllocate];

            // If the allocation of the operator with the lowest utilization rate is met,
            // then exit early. We will not be able to allocate to any other operators.
            if (token.allocation >= token.cap) break;

            allocation = FixedPointMathLib.min(token.cap - token.allocation, allocationSize);

            allocations[allocationIndex] = OperatorTokenAllocation(info.operator, allocation);
            allocated += allocation;

            heap.updateUtilization(OperatorUtilizationHeap.ROOT_INDEX, (token.allocation + allocation).divWad(token.cap));

            unchecked {
                ++allocationIndex;
            }
        }

        // Update the operator utilization heap in storage.
        _updateOperatorUtilizationHeap(heap, activeOperatorsByTokenUtilization[tokenToAllocate]);

        // Shrink the array length to the number of allocations made.
        if (allocationIndex < activeOperatorCount) {
            assembly {
                mstore(allocations, allocationIndex)
            }
        }
    }

    // forgefmt: disable-next-item
    /// @notice Allocates a specified amount of ETH deposits to the operators with the lowest utilization.
    /// @param depositSize The amount of deposits to allocate (32 ETH each)
    function allocateETHDeposits(uint256 depositSize) external onlyAssetManager returns (uint256 depositsAllocated, OperatorETHAllocation[] memory allocations) {
        allocations = new OperatorETHAllocation[](activeOperatorCount);

        OperatorUtilizationHeap.Data memory heap = _getOperatorUtilizationHeapForETH();
        if (heap.isEmpty()) revert NO_ACTIVE_OPERATORS_WITH_NON_ZERO_CAP();

        OperatorUtilizationHeap.Operator memory operator;
        bytes memory pubKeyBatch;
        bytes memory signatureBatch;
        uint256 depositAllocation;
        uint256 allocationIndex;
        uint256 activeDeposits;
        uint256 unallocatedConfirmedKeys;
        while (depositsAllocated < depositSize) {
            operator = heap.getMin();

            OperatorInfo storage info = operatorInfo[operator.id];
            OperatorValidators memory validators = info.validators;
            activeDeposits = validators.deposited - validators.exited;

            // If the current deposited validator count of the operator is greater than or equal to its cap,
            // then exit early. We will not be able to allocate to any other operators.
            if (activeDeposits >= validators.cap) break;

            // If the total number of uploaded keys is greater than the number of confirmed keys AND the
            // current timestamp is greater than or equal to the next confirmation timestamp, then mark all pending keys
            // as confirmed.
            if (validators.total > validators.confirmed && block.timestamp >= validators.nextConfirmationTimestamp) {
                info.validators.confirmed = validators.confirmed = validators.total;
            }

            // We can only allocate to confirmed keys that have not yet received a deposit.
            unallocatedConfirmedKeys = validators.confirmed - validators.deposited - validators.exited;
            if (unallocatedConfirmedKeys == 0) {
                continue;
            }

            // Each allocation is a 32 ETH deposit. We can only allocate up to the number of unallocated confirmed keys.
            depositAllocation = FixedPointMathLib.min(
                FixedPointMathLib.min(validators.cap - activeDeposits, unallocatedConfirmedKeys), depositSize
            );

            // Load the allocated validator details from storage and update the deposited validator count.
            (pubKeyBatch, signatureBatch) = ValidatorDetails.allocateMemory(depositAllocation);
            VALIDATOR_DETAILS_POSITION.loadValidatorDetails(
                operator.id, validators.deposited, depositAllocation, pubKeyBatch, signatureBatch, 0
            );
            info.validators.deposited += uint40(depositAllocation);

            allocations[allocationIndex] = OperatorETHAllocation(info.operator, depositAllocation, pubKeyBatch, signatureBatch);
            depositsAllocated += depositAllocation;

            heap.updateUtilization(OperatorUtilizationHeap.ROOT_INDEX, (activeDeposits + depositAllocation).divWad(validators.cap));

            unchecked {
                ++allocationIndex;
            }
        }

        // Update the operator utilization heap in storage.
        _updateOperatorUtilizationHeap(heap, activeOperatorsByETHDepositUtilization);

        // Shrink the array length to the number of allocations made.
        if (allocationIndex < activeOperatorCount) {
            assembly {
                mstore(allocations, allocationIndex)
            }
        }
    }

    // forgefmt: disable-next-item
    function deallocate(address token, uint256 deallocationSize) external onlyAssetManager returns (uint256 deallocated, OperatorDeallocation[] memory deallocations) {}

    function getPoRAddressListLength() external view override returns (uint256) {}

    function getPoRAddressList(uint256 startIndex, uint256 endIndex) external view override returns (string[] memory) {}

    /// @dev Sets the amount of time (in seconds) before uploaded validator keys are considered "vetted".
    /// @param newValidatorKeyReviewPeriod The new validator key review period.
    function _setValidatorKeyReviewPeriod(uint24 newValidatorKeyReviewPeriod) internal {
        validatorKeyReviewPeriod = newValidatorKeyReviewPeriod;

        emit ValidatorKeyReviewPeriodSet(newValidatorKeyReviewPeriod);
    }

    // forgefmt: disable-next-item
    /// @dev Returns the operator utilization heap for the specified token.
    /// Operators MUST have a non-zero cap for the token to be included in the heap.
    /// @param tokenAddress The token to get the heap for.
    function _getOperatorUtilizationHeapForToken(address tokenAddress) internal view returns (OperatorUtilizationHeap.Data memory heap) {
        uint8 numActiveOperators = activeOperatorCount;
        if (numActiveOperators == 0) return OperatorUtilizationHeap.Data(new OperatorUtilizationHeap.Operator[](0), 0);
        
        heap = OperatorUtilizationHeap.initialize(MAX_ACTIVE_OPERATOR_COUNT);
        LibMap.Uint8Map storage operators = activeOperatorsByTokenUtilization[tokenAddress];

        OperatorTokenInfo memory token;
        uint8 operatorId;
        unchecked {
            for (uint8 i = 0; i < numActiveOperators; ++i) {
                operatorId = operators.get(i);

                // Non-existent operator ID. We've reached the end of the heap.
                if (operatorId == 0) break;

                token = operatorInfo[operatorId].tokens[tokenAddress];
                heap.operators[i + 1] = OperatorUtilizationHeap.Operator({
                    id: operatorId,
                    utilization: token.allocation.divWad(token.cap)
                });
            }
        }
    }

    /// @dev Returns the ETH deposit operator utilization heap.
    /// Operators MUST have a non-zero cap to be included in the heap.
    function _getOperatorUtilizationHeapForETH() internal view returns (OperatorUtilizationHeap.Data memory heap) {
        uint8 numActiveOperators = activeOperatorCount;
        if (numActiveOperators == 0) return OperatorUtilizationHeap.Data(new OperatorUtilizationHeap.Operator[](0), 0);

        heap = OperatorUtilizationHeap.initialize(MAX_ACTIVE_OPERATOR_COUNT);

        uint256 activeDeposits;
        OperatorValidators memory validators;
        uint8 operatorId;
        unchecked {
            for (uint8 i = 0; i < numActiveOperators; ++i) {
                operatorId = activeOperatorsByETHDepositUtilization.get(i);

                // Non-existent operator ID. We've reached the end of the heap.
                if (operatorId == 0) break;

                validators = operatorInfo[operatorId].validators;
                activeDeposits = validators.deposited - validators.exited;
                heap.operators[i + 1] = OperatorUtilizationHeap.Operator({
                    id: operatorId,
                    utilization: activeDeposits.divWad(validators.cap)
                });
            }
        }
    }

    /// @dev Updates the `storageUtilizationHeap` using the provided `memoryUtilizationHeap`.
    /// @param memoryHeap The in-memory heap used to update storage.
    /// @param storageHeap The packed storage heap.
    function _updateOperatorUtilizationHeap(OperatorUtilizationHeap.Data memory memoryHeap, LibMap.Uint8Map storage storageHeap) internal {
        for (uint8 i = 0; i < memoryHeap.count;) {
            unchecked {
                storageHeap.set(i, memoryHeap.operators[i + 1].id);
                ++i;
            }
        }
    }

    // forgefmt: disable-next-item
    /// @dev Deploys and registers a new operator contract with the provided parameters.
    /// @param initialMetadataURI The initial metadata URI.
    function _deployAndRegisterOperator(string calldata initialMetadataURI) internal returns (address operator) {
        operator = address(
            new BeaconProxy(operatorImpl, abi.encodeCall(IRioLRTOperator.initialize, (assetManager, rewardDistributor, initialMetadataURI)))
        );
    }

    /// @dev Allows the owner to upgrade the operator registry implementation.
    /// @param newImplementation The implementation to upgrade to.
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
