// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {LibMap} from '@solady/utils/LibMap.sol';
import {FixedPointMathLib} from '@solady/utils/FixedPointMathLib.sol';
import {BeaconProxy} from '@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol';
import {UpgradeableBeacon} from '@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol';
import {UUPSUpgradeable} from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {IRioLRTOperatorDelegator} from 'contracts/interfaces/IRioLRTOperatorDelegator.sol';
import {IBeaconChainProofs} from 'contracts/interfaces/eigenlayer/IBeaconChainProofs.sol';
import {IRioLRTOperatorRegistry} from 'contracts/interfaces/IRioLRTOperatorRegistry.sol';
import {OperatorUtilizationHeap} from 'contracts/utils/OperatorUtilizationHeap.sol';
import {IRioLRTAssetRegistry} from 'contracts/interfaces/IRioLRTAssetRegistry.sol';
import {IRioLRTCoordinator} from 'contracts/interfaces/IRioLRTCoordinator.sol';
import {IRioLRTAVSRegistry} from 'contracts/interfaces/IRioLRTAVSRegistry.sol';
import {IStrategy} from 'contracts/interfaces/eigenlayer/IStrategy.sol';
import {ValidatorDetails} from 'contracts/utils/ValidatorDetails.sol';
import {BEACON_CHAIN_STRATEGY} from 'contracts/utils/Constants.sol';

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

    /// @notice The operator beacon contract implementation.
    address public immutable operatorBeaconImpl;

    /// @notice The LRT coordinator contract.
    IRioLRTCoordinator public coordinator;

    /// @notice The contract that stores information about supported underlying assets.
    IRioLRTAssetRegistry public assetRegistry;

    /// @notice The AVS registry.
    IRioLRTAVSRegistry public avsRegistry;

    /// @notice The contract that holds funds awaiting deposit into EigenLayer.
    address public depositPool;

    /// @notice The LRT reward distributor.
    address public rewardDistributor;

    /// @notice The security daemon, which is responsible for removal of duplicate
    /// or invalid validator keys.
    address public securityDaemon;

    /// @notice The total number of operators in the registry.
    uint8 public operatorCount;

    /// @notice The number of active operators in the registry.
    uint8 public activeOperatorCount;

    /// @notice The minimum acceptable delay between an operator signaling intent to register
    // for an AVS and completing registration.
    uint24 public minStakerOptOutBlocks;

    /// @notice The amount of time (in seconds) before uploaded validator keys are considered "vetted".
    uint24 public validatorKeyReviewPeriod;

    /// @notice The packed operator IDs, stored in a utilization priority queue, for ETH validators.
    LibMap.Uint8Map internal activeOperatorsByETHDepositUtilization;

    /// @notice The packed operator IDs, stored in a utilization priority queue, indexed by strategy address.
    mapping(address => LibMap.Uint8Map) internal activeOperatorsByStrategyShareUtilization;

    /// @notice A mapping of operator ids to their detailed information.
    mapping(uint8 => OperatorDetails) internal operatorDetails;

    /// @notice Require that the caller is the coordinator.
    modifier onlyCoordinator() {
        if (msg.sender != address(coordinator)) revert ONLY_COORDINATOR();
        _;
    }

    /// @notice Require that the caller is the deposit pool.
    modifier onlyDepositPool() {
        if (msg.sender != depositPool) revert ONLY_DEPOSIT_POOL();
        _;
    }

    /// @notice Require that the caller is the operator's manager.
    /// @param operatorId The operator's ID.
    modifier onlyOperatorManager(uint8 operatorId) {
        if (msg.sender != operatorDetails[operatorId].manager) revert ONLY_OPERATOR_MANAGER();
        _;
    }

    /// @notice Require that the caller is the operator's manager OR the security daemon's
    /// wallet that has been configured by the security council.
    /// @param operatorId The operator's ID.
    modifier onlyOperatorManagerOrSecurityDaemon(uint8 operatorId) {
        if (msg.sender != operatorDetails[operatorId].manager && msg.sender != securityDaemon) {
            revert ONLY_OPERATOR_MANAGER_OR_SECURITY_DAEMON();
        }
        _;
    }

    /// @param initialBeaconOwner The initial owner who can upgrade the operator beacon contract.
    /// @param operatorImpl_ The operator contract implementation.
    constructor(address initialBeaconOwner, address operatorImpl_) {
        _disableInitializers();

        operatorBeaconImpl = address(new UpgradeableBeacon(operatorImpl_, initialBeaconOwner));
    }

    // forgefmt: disable-next-item
    /// @notice Initializes the contract.
    /// @param initialOwner The initial owner of the contract.
    /// @param coordinator_ The LRT coordinator contract address.
    /// @param assetRegistry_ The LRT asset registry.
    /// @param avsRegistry_ The AVS registry.
    /// @param depositPool_ The LRT deposit pool.
    /// @param rewardDistributor_ The LRT reward distributor.
    function initialize(address initialOwner, address coordinator_, address assetRegistry_, address avsRegistry_, address depositPool_, address rewardDistributor_) external initializer {
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();

        coordinator = IRioLRTCoordinator(coordinator_);
        assetRegistry = IRioLRTAssetRegistry(assetRegistry_);
        avsRegistry = IRioLRTAVSRegistry(avsRegistry_);
        depositPool = depositPool_;
        rewardDistributor = rewardDistributor_;

        _setValidatorKeyReviewPeriod(1 days);
    }

    /// @notice Returns the operator details for the provided operator ID.
    /// @param operatorId The operator's ID.
    function getOperatorDetails(uint8 operatorId) external view returns (OperatorPublicDetails memory) {
        OperatorDetails storage operator = operatorDetails[operatorId];
        return OperatorPublicDetails(
            operator.active,
            operator.delegator,
            operator.manager,
            operator.pendingManager,
            operator.earningsReceiver,
            operator.validatorDetails
        );
    }

    // forgefmt: disable-next-item
    /// @notice Returns the operator's share details for the provided operator ID and strategy.
    /// @param operatorId The operator's ID.
    /// @param strategy The strategy to get the share details for.
    function getOperatorShareDetails(uint8 operatorId, address strategy) external view returns (OperatorShareDetails memory) {
        return operatorDetails[operatorId].shareDetails[strategy];
    }

    /// @notice Deploys an operator delegator contract and delegates to the provided `operator`.
    /// @param operator The operator's address.
    /// @param initialManager The initial manager of the operator.
    /// @param initialEarningsReceiver The initial reward address of the operator.
    /// @param strategyShareCaps The maximum number of shares that can be allocated to
    /// the operator for each strategy.
    /// @param validatorCap The maximum number of active validators allowed.
    function createOperatorDelegator(
        address operator,
        address initialManager,
        address initialEarningsReceiver,
        StrategyShareCap[] calldata strategyShareCaps,
        uint40 validatorCap
    ) external onlyOwner returns (uint8 operatorId, address delegator) {
        if (operator == address(0)) revert INVALID_OPERATOR();
        if (initialManager == address(0)) revert INVALID_MANAGER();
        if (initialEarningsReceiver == address(0)) revert INVALID_EARNINGS_RECEIVER();

        if (operatorCount == MAX_OPERATOR_COUNT) revert MAX_OPERATOR_COUNT_EXCEEDED();
        if (activeOperatorCount == MAX_ACTIVE_OPERATOR_COUNT) revert MAX_ACTIVE_OPERATOR_COUNT_EXCEEDED();

        // Increment the operator count before assignment (First operator ID is 1)
        operatorId = ++operatorCount;
        activeOperatorCount += 1;

        // Create the operator with the provided salt and initialize it.
        delegator = address(new BeaconProxy(operatorBeaconImpl, ''));
        IRioLRTOperatorDelegator(delegator).initialize(depositPool, rewardDistributor, operator);

        OperatorDetails storage _operator = operatorDetails[operatorId];
        _operator.active = true;
        _operator.manager = initialManager;
        _operator.earningsReceiver = initialEarningsReceiver;
        _operator.delegator = delegator;

        emit OperatorCreated(operatorId, delegator, delegator, initialManager, initialEarningsReceiver);

        StrategyShareCap memory shareCap;
        OperatorUtilizationHeap.Data memory heap;

        // Populate the strategy share allocation caps for the operator.
        for (uint256 i = 0; i < strategyShareCaps.length; ++i) {
            shareCap = strategyShareCaps[i];
            if (shareCap.cap == 0) continue;

            _operator.shareDetails[shareCap.strategy].cap = shareCap.cap;

            heap = _getOperatorUtilizationHeapForStrategy(shareCap.strategy);
            heap.insert(OperatorUtilizationHeap.Operator(operatorId, 0));
            heap.store(activeOperatorsByStrategyShareUtilization[shareCap.strategy]);

            emit OperatorStrategyShareCapSet(operatorId, shareCap.strategy, shareCap.cap);
        }

        // Populate the validator cap for the operator, if applicable.
        if (validatorCap > 0) {
            _operator.validatorDetails.cap = validatorCap;

            heap = _getOperatorUtilizationHeapForETH();
            heap.insert(OperatorUtilizationHeap.Operator(operatorId, 0));
            heap.store(activeOperatorsByETHDepositUtilization);

            emit OperatorValidatorCapSet(operatorId, validatorCap);
        }
    }

    /// @notice Activates an operator.
    /// @param operatorId The operator's ID.
    function activateOperator(uint8 operatorId) external onlyOwner {
        OperatorDetails storage operator = operatorDetails[operatorId];

        if (operator.manager == address(0)) revert INVALID_OPERATOR_DELEGATOR();
        if (operator.active) revert OPERATOR_ALREADY_ACTIVE();

        operator.active = true;
        activeOperatorCount += 1;

        OperatorUtilizationHeap.Data memory heap;
        address[] memory strategies = assetRegistry.getAssetStrategies();

        // Insert the operator into the utilization heap for all strategies that have a non-zero cap.
        for (uint256 i = 0; i < strategies.length; ++i) {
            address strategy = strategies[i];
            OperatorShareDetails memory operatorShares = operator.shareDetails[strategy];

            if (operatorShares.cap == 0) continue;

            heap = _getOperatorUtilizationHeapForStrategy(strategy);
            heap.insert(OperatorUtilizationHeap.Operator(operatorId, 0));
            heap.store(activeOperatorsByStrategyShareUtilization[strategy]);
        }
        emit OperatorActivated(operatorId);
    }

    /// Deactivates an operator, exiting all remaining stake to the
    /// asset manager.
    /// @param operatorId The operator's ID.
    function deactivateOperator(uint8 operatorId) external onlyOwner {
        OperatorDetails storage operator = operatorDetails[operatorId];

        if (operator.manager == address(0)) revert INVALID_OPERATOR_DELEGATOR();
        if (!operator.active) revert OPERATOR_ALREADY_INACTIVE();

        address[] memory strategies = assetRegistry.getAssetStrategies();
        for (uint256 i = 0; i < strategies.length; ++i) {
            address strategy = strategies[i];
            if (operator.shareDetails[strategy].allocation > 0) {
                _queueOperatorStrategyExit(operatorId, operator, strategy);

                OperatorUtilizationHeap.Data memory heap = _getOperatorUtilizationHeapForStrategy(strategy);
                heap.removeByID(operatorId);
                heap.store(activeOperatorsByStrategyShareUtilization[strategy]);

                delete operator.shareDetails[strategy];
            }
        }
        operator.active = false;
        activeOperatorCount -= 1;

        emit OperatorDeactivated(operatorId);
    }

    // forgefmt: disable-next-item
    /// @notice Sets the operator's strategy share allocation caps.
    /// @param operatorId The operator's ID.
    /// @param newStrategyShareCaps The new strategy share allocation caps.
    function setOperatorStrategyShareCaps(uint8 operatorId, StrategyShareCap[] calldata newStrategyShareCaps) external onlyOwner {
        OperatorDetails storage operator = operatorDetails[operatorId];
        if (operator.manager == address(0)) revert INVALID_OPERATOR_DELEGATOR();

        for (uint256 i = 0; i < newStrategyShareCaps.length; ++i) {
            StrategyShareCap memory incoming = newStrategyShareCaps[i];
            OperatorShareDetails memory current = operator.shareDetails[incoming.strategy];

            if (current.cap == incoming.cap) continue; // No change

            // Update the operator's utilization using the new cap. We exit the operator's remaining
            // stake if their cap is set to 0.
            OperatorUtilizationHeap.Data memory heap = _getOperatorUtilizationHeapForStrategy(incoming.strategy);
            if (current.cap > 0 && incoming.cap == 0) {
                if (current.allocation > 0) {
                    _queueOperatorStrategyExit(operatorId, operator, incoming.strategy);
                }
                heap.removeByID(operatorId);
            }  else if (current.cap == 0 && incoming.cap > 0) {
                heap.insert(OperatorUtilizationHeap.Operator(operatorId, 0));
            } else {
                heap.updateUtilizationByID(operatorId, current.allocation.divWad(incoming.cap));
            }
            heap.store(activeOperatorsByStrategyShareUtilization[incoming.strategy]);

            // Update the operator's cap in storage.
            operator.shareDetails[incoming.strategy].cap = incoming.cap;

            emit OperatorStrategyShareCapSet(operatorId, incoming.strategy, incoming.cap);
        }
    }

    /// @notice Sets the operator's maximum active validator cap.
    /// @param operatorId The operator's ID.
    /// @param newValidatorCap The new maximum active validator cap.
    function setOperatorValidatorCap(uint8 operatorId, uint40 newValidatorCap) external onlyOwner {
        OperatorDetails storage operator = operatorDetails[operatorId];
        if (operator.manager == address(0)) revert INVALID_OPERATOR_DELEGATOR();

        OperatorValidatorDetails memory validators = operator.validatorDetails;
        if (validators.cap == newValidatorCap) return; // No change

        uint40 activeDeposits = validators.deposited - validators.exited;

        // Update the operator's utilization using the new cap. We exit the operator's remaining
        // deposits if their cap is set to 0.
        OperatorUtilizationHeap.Data memory heap = _getOperatorUtilizationHeapForETH();
        if (validators.cap > 0 && newValidatorCap == 0) {
            if (activeDeposits > 0) {
                _queueOperatorStrategyExit(operatorId, operator, BEACON_CHAIN_STRATEGY);
            }
            heap.removeByID(operatorId);
        } else if (validators.cap == 0 && newValidatorCap > 0) {
            heap.insert(OperatorUtilizationHeap.Operator(operatorId, 0));
        } else {
            heap.updateUtilizationByID(operatorId, activeDeposits.divWad(newValidatorCap));
        }
        heap.store(activeOperatorsByETHDepositUtilization);

        // Update the operator's cap in storage.
        operator.validatorDetails.cap = newValidatorCap;

        emit OperatorValidatorCapSet(operatorId, newValidatorCap);
    }

    /// @notice Sets the security daemon to a new account (`newSecurityDaemon`).
    /// @param newSecurityDaemon The new security daemon address.
    function setSecurityDaemon(address newSecurityDaemon) external onlyOwner {
        securityDaemon = newSecurityDaemon;

        emit SecurityDaemonSet(newSecurityDaemon);
    }

    /// @notice Sets the minimum acceptable delay between an operator signaling intent to register
    // for an AVS and completing registration.
    /// @param newMinStakerOptOutBlocks The new min staker opt out blocks.
    function setMinStakerOptOutBlocks(uint24 newMinStakerOptOutBlocks) external onlyOwner {
        minStakerOptOutBlocks = newMinStakerOptOutBlocks;

        emit MinStakerOptOutBlocksSet(newMinStakerOptOutBlocks);
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

        operatorDetails[operatorId].earningsReceiver = newEarningsReceiver;

        emit OperatorEarningsReceiverSet(operatorId, newEarningsReceiver);
    }

    // forgefmt: disable-next-item
    /// @notice Sets an operator's pending manager.
    /// @param operatorId The operator's ID.
    /// @param newPendingManager The new pending manager of the operator.
    function setOperatorPendingManager(uint8 operatorId, address newPendingManager) external onlyOperatorManager(operatorId) {
        if (newPendingManager == address(0)) revert INVALID_PENDING_MANAGER();

        operatorDetails[operatorId].pendingManager = newPendingManager;

        emit OperatorPendingManagerSet(operatorId, newPendingManager);
    }

    /// @notice Confirms an operator's pending manager.
    /// @param operatorId The operator's ID.
    function confirmOperatorManager(uint8 operatorId) external {
        address sender = _msgSender();

        OperatorDetails storage operator = operatorDetails[operatorId];
        if (sender != operator.pendingManager) revert ONLY_OPERATOR_PENDING_MANAGER();

        delete operator.pendingManager;
        operator.manager = sender;

        emit OperatorManagerSet(operatorId, sender);
    }

    /// @notice Verifies withdrawal credentials of validator(s) owned by the provided
    /// operator's EigenPod. It also verifies the effective balance of the validator(s).
    /// @param operatorId The operator's ID.
    /// @param oracleTimestamp The timestamp of the oracle that submitted the proof.
    /// @param stateRootProof The state root proof.
    /// @param validatorIndices The indices of the validators to verify.
    /// @param validatorFieldsProofs The validator fields proofs.
    /// @param validatorFields The validator fields.
    function verifyWithdrawalCredentials(
        uint8 operatorId,
        uint64 oracleTimestamp,
        IBeaconChainProofs.StateRootProof calldata stateRootProof,
        uint40[] calldata validatorIndices,
        bytes[] calldata validatorFieldsProofs,
        bytes32[][] calldata validatorFields
    ) external onlyOperatorManager(operatorId) {
        OperatorDetails storage operator = operatorDetails[operatorId];
        IRioLRTOperatorDelegator(operator.delegator).verifyWithdrawalCredentials(
            oracleTimestamp, stateRootProof, validatorIndices, validatorFieldsProofs, validatorFields
        );
        emit OperatorWithdrawalCredentialsVerified(operatorId, oracleTimestamp, validatorIndices);
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
        OperatorDetails storage operator = operatorDetails[operatorId];
        OperatorValidatorDetails memory validators = operator.validatorDetails;

        if (validatorCount == 0) revert INVALID_VALIDATOR_COUNT();

        // First check if there are any pending validator details that can be moved into a confirmed state.
        if (validators.total > validators.confirmed && block.timestamp >= validators.nextConfirmationTimestamp) {
            operator.validatorDetails.confirmed = validators.confirmed = validators.total;
        }

        operator.validatorDetails.total = VALIDATOR_DETAILS_POSITION.saveValidatorDetails(
            operatorId, validators.total, validatorCount, publicKeys, signatures
        );
        operator.validatorDetails.nextConfirmationTimestamp = uint40(block.timestamp + validatorKeyReviewPeriod);

        emit OperatorPendingValidatorDetailsAdded(operatorId, validatorCount);
    }

    // forgefmt: disable-next-item
    /// @notice Removes pending validator details (public keys and signatures) from storage for the provided operator.
    /// @param operatorId The operator's ID.
    /// @param fromIndex The index of the first validator to remove.
    /// @param validatorCount The number of validator to remove.
    function removeValidatorDetails(uint8 operatorId, uint256 fromIndex, uint256 validatorCount)
        external
        onlyOperatorManagerOrSecurityDaemon(operatorId)
    {
        OperatorDetails storage operator = operatorDetails[operatorId];
        OperatorValidatorDetails memory validators = operator.validatorDetails;

        if (validatorCount == 0) revert INVALID_VALIDATOR_COUNT();
        if (fromIndex < validators.confirmed || fromIndex + validatorCount > validators.total) revert INVALID_INDEX();

        operator.validatorDetails.total = VALIDATOR_DETAILS_POSITION.removeValidatorDetails(
            operatorId, fromIndex, validatorCount, validators.total
        );
        emit OperatorPendingValidatorDetailsRemoved(operatorId, validatorCount);
    }

    // forgefmt: disable-next-item
    /// @notice Allocates a specified amount of shares for the provided strategy to the operators with the lowest utilization.
    /// @param strategy The strategy to allocate the shares to.
    /// @param sharesToAllocate The amount of shares to allocate.
    function allocateStrategyShares(address strategy, uint256 sharesToAllocate) external onlyDepositPool returns (uint256 sharesAllocated, OperatorStrategyAllocation[] memory allocations) {
        allocations = new OperatorStrategyAllocation[](activeOperatorCount);

        OperatorUtilizationHeap.Data memory heap = _getOperatorUtilizationHeapForStrategy(strategy);
        if (heap.isEmpty()) revert NO_AVAILABLE_OPERATORS_FOR_ALLOCATION();

        uint256 allocationIndex;
        uint256 remainingShares = sharesToAllocate;

        while (remainingShares > 0) {
            OperatorDetails storage operator = operatorDetails[heap.getMin().id];
            OperatorShareDetails memory operatorShares = operator.shareDetails[strategy];

            // If the allocation of the operator with the lowest utilization rate is maxed out,
            // then exit early. We will not be able to allocate to any other operators.
            if (operatorShares.allocation >= operatorShares.cap) break;

            uint256 newShareAllocation = FixedPointMathLib.min(operatorShares.cap - operatorShares.allocation, remainingShares);
            uint256 newTokenAllocation = IStrategy(strategy).sharesToUnderlyingView(newShareAllocation);
            allocations[allocationIndex] = OperatorStrategyAllocation(
                operator.delegator,
                newShareAllocation,
                newTokenAllocation
            );
            remainingShares -= newShareAllocation;

            uint128 updatedAllocation = operatorShares.allocation + uint128(newShareAllocation);

            operator.shareDetails[strategy].allocation = updatedAllocation;
            heap.updateUtilization(OperatorUtilizationHeap.ROOT_INDEX, updatedAllocation.divWad(operatorShares.cap));

            unchecked {
                ++allocationIndex;
            }
        }
        sharesAllocated = sharesToAllocate - remainingShares;

        heap.store(activeOperatorsByStrategyShareUtilization[strategy]);

        // Shrink the array length to the number of allocations made.
        if (allocationIndex < activeOperatorCount) {
            assembly {
                mstore(allocations, allocationIndex)
            }
        }
    }

    // forgefmt: disable-next-item
    /// @notice Allocates a specified amount of ETH deposits to the operators with the lowest utilization.
    /// @param depositsToAllocate The amount of deposits to allocate (32 ETH each)
    function allocateETHDeposits(uint256 depositsToAllocate) external onlyDepositPool returns (uint256 depositsAllocated, OperatorETHAllocation[] memory allocations) {
        allocations = new OperatorETHAllocation[](activeOperatorCount);

        OperatorUtilizationHeap.Data memory heap = _getOperatorUtilizationHeapForETH();
        if (heap.isEmpty()) revert NO_AVAILABLE_OPERATORS_FOR_ALLOCATION();

        uint256 allocationIndex;
        uint256 remainingDeposits = depositsToAllocate;

        uint8 skippedOperatorCount;
        OperatorUtilizationHeap.Operator[] memory skippedOperators = new OperatorUtilizationHeap.Operator[](heap.count);

        bytes memory pubKeyBatch;
        bytes memory signatureBatch;
        while (remainingDeposits > 0 && !heap.isEmpty()) {
            uint8 operatorId = heap.getMin().id;

            OperatorDetails storage operator = operatorDetails[operatorId];
            OperatorValidatorDetails memory validators = operator.validatorDetails;
            uint256 activeDeposits = validators.deposited - validators.exited;

            // If the current deposited validator count of the operator is greater than or equal to its cap,
            // then exit early. We will not be able to allocate to any other operators.
            if (activeDeposits >= validators.cap) break;

            // If the total number of uploaded keys is greater than the number of confirmed keys AND the
            // current timestamp is greater than or equal to the next confirmation timestamp, mark all pending keys
            // as confirmed.
            if (validators.total > validators.confirmed && block.timestamp >= validators.nextConfirmationTimestamp) {
                operator.validatorDetails.confirmed = validators.confirmed = validators.total;
            }

            // We can only allocate to confirmed keys that have not yet received a deposit.
            uint256 unallocatedConfirmedKeys = validators.confirmed - validators.deposited - validators.exited;
            if (unallocatedConfirmedKeys == 0) {
                skippedOperators[skippedOperatorCount++] = heap.extractMin();
                continue;
            }

            // Each allocation is a 32 ETH deposit. We can only allocate up to the number of unallocated confirmed keys.
            uint256 updatedAllocation;
            {
                uint256 newDepositAllocation = FixedPointMathLib.min(
                    FixedPointMathLib.min(validators.cap - activeDeposits, unallocatedConfirmedKeys), remainingDeposits
                );

                // Load the allocated validator details from storage and update the deposited validator count.
                (pubKeyBatch, signatureBatch) = ValidatorDetails.allocateMemory(newDepositAllocation);
                VALIDATOR_DETAILS_POSITION.loadValidatorDetails(
                    operatorId, validators.deposited, newDepositAllocation, pubKeyBatch, signatureBatch, 0
                );
                operator.validatorDetails.deposited += uint40(newDepositAllocation);

                allocations[allocationIndex] = OperatorETHAllocation(operator.delegator, newDepositAllocation, pubKeyBatch, signatureBatch);
                remainingDeposits -= newDepositAllocation;

                updatedAllocation = activeDeposits + newDepositAllocation;
            }
            heap.updateUtilization(OperatorUtilizationHeap.ROOT_INDEX, updatedAllocation.divWad(validators.cap));

            unchecked {
                ++allocationIndex;
            }
        }
        depositsAllocated = depositsToAllocate - remainingDeposits;
        if (depositsAllocated == 0) revert NO_AVAILABLE_OPERATORS_FOR_ALLOCATION();

        // Reinsert skipped operators back into the heap.
        for (uint256 i = 0; i < skippedOperatorCount; ++i) {
            heap.insert(skippedOperators[i]);
        }
        heap.store(activeOperatorsByETHDepositUtilization);

        // Shrink the array length to the number of allocations made.
        if (allocationIndex < activeOperatorCount) {
            assembly {
                mstore(allocations, allocationIndex)
            }
        }
    }

    // forgefmt: disable-next-item
    /// @notice Deallocates a specified amount of shares for the provided strategy from the operators with the highest utilization.
    /// @param strategy The strategy to deallocate the shares from.
    /// @param sharesToDeallocate The amount of shares to deallocate.
    function deallocateStrategyShares(address strategy, uint256 sharesToDeallocate) external onlyCoordinator returns (uint256 sharesDeallocated, OperatorStrategyDeallocation[] memory deallocations) {        
        deallocations = new OperatorStrategyDeallocation[](activeOperatorCount);

        OperatorUtilizationHeap.Data memory heap = _getOperatorUtilizationHeapForStrategy(strategy);
        if (heap.isEmpty()) revert NO_AVAILABLE_OPERATORS_FOR_DEALLOCATION();

        uint256 deallocationIndex;
        uint256 remainingShares = sharesToDeallocate;

        while (remainingShares > 0) {
            OperatorDetails storage operator = operatorDetails[heap.getMax().id];
            OperatorShareDetails memory operatorShares = operator.shareDetails[strategy];

            // Exit early if the operator with the highest utilization rate has no allocation,
            // as no further deallocations can be made.
            if (operatorShares.allocation == 0) break;

            uint256 newShareDeallocation = FixedPointMathLib.min(operatorShares.allocation, remainingShares);
            uint256 newTokenDeallocation = IStrategy(strategy).sharesToUnderlyingView(newShareDeallocation);
            deallocations[deallocationIndex] = OperatorStrategyDeallocation(
                operator.delegator,
                newShareDeallocation,
                newTokenDeallocation
            );
            remainingShares -= newShareDeallocation;

            uint128 updatedAllocation = operatorShares.allocation - uint128(newShareDeallocation);

            operator.shareDetails[strategy].allocation = updatedAllocation;
            heap.updateUtilization(OperatorUtilizationHeap.ROOT_INDEX, updatedAllocation.divWad(operatorShares.cap));

            unchecked {
                ++deallocationIndex;
            }
        }
        sharesDeallocated = sharesToDeallocate - remainingShares;

        heap.store(activeOperatorsByStrategyShareUtilization[strategy]);

        // Shrink the array length to the number of deallocations made.
        if (deallocationIndex < activeOperatorCount) {
            assembly {
                mstore(deallocations, deallocationIndex)
            }
        }
    }

    // forgefmt: disable-next-item
    /// @notice Deallocates a specified amount of ETH deposits from the operators with the highest utilization.
    /// @param depositsToDeallocate The amount of deposits to deallocate (32 ETH each)
    function deallocateETHDeposits(uint256 depositsToDeallocate) external onlyCoordinator returns (uint256 depositsDeallocated, OperatorETHDeallocation[] memory deallocations) {
        deallocations = new OperatorETHDeallocation[](activeOperatorCount);

        OperatorUtilizationHeap.Data memory heap = _getOperatorUtilizationHeapForETH();
        if (heap.isEmpty()) revert NO_AVAILABLE_OPERATORS_FOR_DEALLOCATION();

        uint256 deallocationIndex;
        uint256 remainingDeposits = depositsToDeallocate;

        while (remainingDeposits > 0) {
            uint8 operatorId = heap.getMax().id;

            OperatorDetails storage operator = operatorDetails[operatorId];
            OperatorValidatorDetails memory validators = operator.validatorDetails;
            uint256 activeDeposits = validators.deposited - validators.exited;

            // Exit early if the operator with the highest utilization rate has no active deposits,
            // as no further deallocations can be made.
            if (activeDeposits == 0) break;

            // Each deallocation will trigger the withdrawal of a 32 ETH deposit. The specific validators
            // to withdraw from are chosen by the software run by the operator.
            uint256 newDepositDeallocation = FixedPointMathLib.min(activeDeposits, remainingDeposits);

            operator.validatorDetails.exited += uint40(newDepositDeallocation);

            deallocations[deallocationIndex] = OperatorETHDeallocation(operator.delegator, newDepositDeallocation);
            remainingDeposits -= newDepositDeallocation;

            uint256 updatedAllocation = activeDeposits - newDepositDeallocation;
            heap.updateUtilization(OperatorUtilizationHeap.ROOT_INDEX, updatedAllocation.divWad(validators.cap));

            unchecked {
                ++deallocationIndex;
            }
        }
        depositsDeallocated = depositsToDeallocate - remainingDeposits;

        heap.store(activeOperatorsByETHDepositUtilization);

        // Shrink the array length to the number of deallocations made.
        if (deallocationIndex < activeOperatorCount) {
            assembly {
                mstore(deallocations, deallocationIndex)
            }
        }
    }

    /// @dev Sets the amount of time (in seconds) before uploaded validator keys are considered "vetted".
    /// @param newValidatorKeyReviewPeriod The new validator key review period.
    function _setValidatorKeyReviewPeriod(uint24 newValidatorKeyReviewPeriod) internal {
        validatorKeyReviewPeriod = newValidatorKeyReviewPeriod;

        emit ValidatorKeyReviewPeriodSet(newValidatorKeyReviewPeriod);
    }

    // forgefmt: disable-next-item
    /// Queues a complete exit from the specified strategy for the provided operator.
    /// @param operatorId The operator's ID.
    /// @param operator The operator that's exiting.
    /// @param strategy The strategy to exit.
    function _queueOperatorStrategyExit(uint8 operatorId, OperatorDetails storage operator, address strategy) internal {
        IRioLRTOperatorDelegator delegator = IRioLRTOperatorDelegator(operator.delegator);

        uint256 sharesToExit;
        if (strategy == BEACON_CHAIN_STRATEGY) {
            sharesToExit = uint256(delegator.getEigenPodShares());
        } else {
            sharesToExit = operator.shareDetails[strategy].allocation;
        }
        if (sharesToExit == 0) revert CANNOT_EXIT_ZERO_SHARES();

        delegator.queueWithdrawal(strategy, sharesToExit, depositPool);

        emit OperatorStrategyExitQueued(operatorId, strategy, sharesToExit);
    }

    // forgefmt: disable-next-item
    /// @dev Returns the operator utilization heap for the specified strategy.
    /// Utilization is calculated as the operator's current allocation divided by their cap,
    /// unless the cap is 0, in which case the operator is considered to have max utilization.
    /// @param strategy The strategy to get the heap for.
    function _getOperatorUtilizationHeapForStrategy(address strategy) internal view returns (OperatorUtilizationHeap.Data memory heap) {
        uint8 numActiveOperators = activeOperatorCount;
        if (numActiveOperators == 0) return OperatorUtilizationHeap.Data(new OperatorUtilizationHeap.Operator[](0), 0);
        
        heap = OperatorUtilizationHeap.initialize(MAX_ACTIVE_OPERATOR_COUNT);
        LibMap.Uint8Map storage operators = activeOperatorsByStrategyShareUtilization[strategy];

        OperatorShareDetails memory operatorShares;
        unchecked {
            uint8 i;
            for (i = 0; i < numActiveOperators; ++i) {
                uint8 operatorId = operators.get(i);

                // Non-existent operator ID. We've reached the end of the heap.
                if (operatorId == 0) break;

                operatorShares = operatorDetails[operatorId].shareDetails[strategy];
                heap.operators[i + 1] = OperatorUtilizationHeap.Operator({
                    id: operatorId,
                    utilization: operatorShares.allocation.divWad(operatorShares.cap)
                });
            }
            heap.count = i;
        }
    }

    /// @dev Returns the ETH deposit operator utilization heap.
    /// Utilization is calculated as the operator's active deposit count divided by their cap,
    /// unless the cap is 0, in which case the operator is considered to have max utilization.
    function _getOperatorUtilizationHeapForETH() internal view returns (OperatorUtilizationHeap.Data memory heap) {
        uint8 numActiveOperators = activeOperatorCount;
        if (numActiveOperators == 0) return OperatorUtilizationHeap.Data(new OperatorUtilizationHeap.Operator[](0), 0);

        heap = OperatorUtilizationHeap.initialize(MAX_ACTIVE_OPERATOR_COUNT);

        uint256 activeDeposits;
        OperatorValidatorDetails memory validators;
        unchecked {
            uint8 i;
            for (i = 0; i < numActiveOperators; ++i) {
                uint8 operatorId = activeOperatorsByETHDepositUtilization.get(i);

                // Non-existent operator ID. We've reached the end of the heap.
                if (operatorId == 0) break;

                validators = operatorDetails[operatorId].validatorDetails;
                activeDeposits = validators.deposited - validators.exited;
                heap.operators[i + 1] = OperatorUtilizationHeap.Operator({
                    id: operatorId,
                    utilization: activeDeposits.divWad(validators.cap)
                });
            }
            heap.count = i;
        }
    }

    /// @dev Allows the owner to upgrade the operator registry implementation.
    /// @param newImplementation The implementation to upgrade to.
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
