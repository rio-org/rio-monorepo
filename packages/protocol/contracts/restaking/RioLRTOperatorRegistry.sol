// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {LibMap} from '@solady/utils/LibMap.sol';
import {FixedPointMathLib} from '@solady/utils/FixedPointMathLib.sol';
import {SafeCast} from '@openzeppelin/contracts/utils/math/SafeCast.sol';
import {UpgradeableBeacon} from '@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol';
import {UUPSUpgradeable} from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {RioLRTOperatorRegistryStorageV1} from 'contracts/restaking/storage/RioLRTOperatorRegistryStorageV1.sol';
import {IRioLRTOperatorDelegator} from 'contracts/interfaces/IRioLRTOperatorDelegator.sol';
import {IBeaconChainProofs} from 'contracts/interfaces/eigenlayer/IBeaconChainProofs.sol';
import {BLS_PUBLIC_KEY_LENGTH, ETH_DEPOSIT_SIZE} from 'contracts/utils/Constants.sol';
import {OperatorRegistryV1Admin} from 'contracts/utils/OperatorRegistryV1Admin.sol';
import {OperatorUtilizationHeap} from 'contracts/utils/OperatorUtilizationHeap.sol';
import {IStrategy} from 'contracts/interfaces/eigenlayer/IStrategy.sol';
import {IEigenPod} from 'contracts/interfaces/eigenlayer/IEigenPod.sol';
import {ValidatorDetails} from 'contracts/utils/ValidatorDetails.sol';
import {RioLRTCore} from 'contracts/restaking/base/RioLRTCore.sol';
import {Memory} from 'contracts/utils/Memory.sol';
import {Asset} from 'contracts/utils/Asset.sol';

contract RioLRTOperatorRegistry is OwnableUpgradeable, UUPSUpgradeable, RioLRTCore, RioLRTOperatorRegistryStorageV1 {
    using OperatorUtilizationHeap for OperatorUtilizationHeap.Data;
    using OperatorRegistryV1Admin for StorageV1;
    using ValidatorDetails for bytes32;
    using FixedPointMathLib for *;
    using Asset for address;
    using LibMap for *;

    /// @dev The validator details storage position.

    /// @notice The operator delegator beacon contract.
    address public immutable operatorDelegatorBeacon;

    /// @notice Require that the caller is the operator's manager.
    /// @param operatorId The operator's ID.
    modifier onlyOperatorManager(uint8 operatorId) {
        if (msg.sender != s.operatorDetails[operatorId].manager) revert ONLY_OPERATOR_MANAGER();
        _;
    }

    /// @notice Require that the caller is the operator's manager OR the security daemon's
    /// wallet that has been configured by the security council.
    /// @param operatorId The operator's ID.
    modifier onlyOperatorManagerOrSecurityDaemon(uint8 operatorId) {
        if (msg.sender != s.operatorDetails[operatorId].manager && msg.sender != s.securityDaemon) {
            revert ONLY_OPERATOR_MANAGER_OR_SECURITY_DAEMON();
        }
        _;
    }

    /// @notice Require that the caller is the operator's manager OR the proof uploader
    // wallet that has been configured by the DAO.
    /// @param operatorId The operator's ID.
    modifier onlyOperatorManagerOrProofUploader(uint8 operatorId) {
        if (msg.sender != s.operatorDetails[operatorId].manager && msg.sender != s.proofUploader) {
            revert ONLY_OPERATOR_MANAGER_OR_PROOF_UPLOADER();
        }
        _;
    }

    /// @param issuer_ The LRT issuer that's authorized to deploy this contract.
    /// @param initialBeaconOwner The initial owner who can upgrade the operator delegator beacon contract.
    /// @param operatorDelegatorImpl_ The operator contract implementation.
    constructor(address issuer_, address initialBeaconOwner, address operatorDelegatorImpl_) RioLRTCore(issuer_) {
        operatorDelegatorBeacon = address(new UpgradeableBeacon(operatorDelegatorImpl_, initialBeaconOwner));
    }

    /// @notice Initializes the contract.
    /// @param initialOwner The initial owner of the contract.
    /// @param token_ The address of the liquid restaking token.
    function initialize(address initialOwner, address token_) external initializer {
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
        __RioLRTCore_init(token_);

        s.setValidatorKeyReviewPeriod(1 days);
    }

    /// @notice Returns the total number of operators in the registry.
    function operatorCount() external view returns (uint8) {
        return s.operatorCount;
    }

    /// @notice Returns the total number of active operators in the registry.
    function activeOperatorCount() external view returns (uint8) {
        return s.activeOperatorCount;
    }

    /// @notice The minimum acceptable delay between an operator signaling intent to register
    // for an AVS and completing registration.
    function minStakerOptOutBlocks() external view returns (uint24) {
        return s.minStakerOptOutBlocks;
    }

    /// @notice The security daemon, which is responsible for removal of duplicate
    /// or invalid validator keys.
    function securityDaemon() external view returns (address) {
        return s.securityDaemon;
    }

    /// @notice The amount of time (in seconds) before uploaded validator keys are considered "vetted".
    function validatorKeyReviewPeriod() external view returns (uint24) {
        return s.validatorKeyReviewPeriod;
    }

    /// @notice Returns the operator details for the provided operator ID.
    /// @param operatorId The operator's ID.
    function getOperatorDetails(uint8 operatorId) external view returns (OperatorPublicDetails memory) {
        OperatorDetails storage operator = s.operatorDetails[operatorId];
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
        return s.operatorDetails[operatorId].shareDetails[strategy];
    }

    // forgefmt: disable-next-item
    /// @notice Adds a new operator to the registry, deploying a delegator contract and
    /// delegating to the provided operator address.
    /// @param config The new operator's configuration.
    function addOperator(OperatorConfig calldata config) external onlyOwner returns (uint8 operatorId, address delegator) {
        return s.addOperator(address(token), operatorDelegatorBeacon, config);
    }

    /// @notice Activates an operator.
    /// @param operatorId The operator's ID.
    function activateOperator(uint8 operatorId) external onlyOwner {
        s.activateOperator(operatorId);
    }

    /// Deactivates an operator, exiting all remaining stake to the
    /// deposit pool.
    /// @param operatorId The operator's ID.
    function deactivateOperator(uint8 operatorId) external onlyOwner {
        s.deactivateOperator(assetRegistry(), operatorId);
    }

    // forgefmt: disable-next-item
    /// @notice Sets the operator's strategy share allocation caps.
    /// @param operatorId The operator's ID.
    /// @param newStrategyShareCaps The new strategy share allocation caps.
    function setOperatorStrategyShareCaps(uint8 operatorId, StrategyShareCap[] calldata newStrategyShareCaps) external onlyOwner {
        s.setOperatorStrategyShareCaps(operatorId, newStrategyShareCaps);
    }

    /// @notice Sets the operator's maximum active validator cap.
    /// @param operatorId The operator's ID.
    /// @param newValidatorCap The new maximum active validator cap.
    function setOperatorValidatorCap(uint8 operatorId, uint40 newValidatorCap) external onlyOwner {
        s.setOperatorValidatorCap(operatorId, newValidatorCap);
    }

    /// @notice Sets the security daemon to a new account (`newSecurityDaemon`).
    /// @param newSecurityDaemon The new security daemon address.
    function setSecurityDaemon(address newSecurityDaemon) external onlyOwner {
        s.setSecurityDaemon(newSecurityDaemon);
    }

    /// @notice Sets the proof uploader to a new account (`newProofUploader`).
    /// @param newProofUploader The new proof uploader address.
    function setProofUploader(address newProofUploader) external onlyOwner {
        s.setProofUploader(newProofUploader);
    }

    /// @notice Sets the minimum acceptable delay between an operator signaling intent to register
    // for an AVS and completing registration.
    /// @param newMinStakerOptOutBlocks The new min staker opt out blocks.
    function setMinStakerOptOutBlocks(uint24 newMinStakerOptOutBlocks) external onlyOwner {
        s.setMinStakerOptOutBlocks(newMinStakerOptOutBlocks);
    }

    /// @notice Sets the amount of time (in seconds) before uploaded validator keys are considered "vetted".
    /// @param newValidatorKeyReviewPeriod The new validator key review period.
    function setValidatorKeyReviewPeriod(uint24 newValidatorKeyReviewPeriod) external onlyOwner {
        s.setValidatorKeyReviewPeriod(newValidatorKeyReviewPeriod);
    }

    // forgefmt: disable-next-item
    /// @notice Sets an operator's earnings receiver.
    /// @param operatorId The operator's ID.
    /// @param newEarningsReceiver The new reward address of the operator.
    function setOperatorEarningsReceiver(uint8 operatorId, address newEarningsReceiver) external onlyOperatorManager(operatorId) {
        if (newEarningsReceiver == address(0)) revert INVALID_EARNINGS_RECEIVER();
        s.operatorDetails[operatorId].earningsReceiver = newEarningsReceiver;

        emit OperatorEarningsReceiverSet(operatorId, newEarningsReceiver);
    }

    // forgefmt: disable-next-item
    /// @notice Sets an operator's pending manager.
    /// @param operatorId The operator's ID.
    /// @param newPendingManager The new pending manager of the operator.
    function setOperatorPendingManager(uint8 operatorId, address newPendingManager) external onlyOperatorManager(operatorId) {
        if (newPendingManager == address(0)) revert INVALID_PENDING_MANAGER();
        s.operatorDetails[operatorId].pendingManager = newPendingManager;

        emit OperatorPendingManagerSet(operatorId, newPendingManager);
    }

    /// @notice Confirms an operator's pending manager.
    /// @param operatorId The operator's ID.
    function confirmOperatorManager(uint8 operatorId) external {
        address sender = msg.sender;

        OperatorDetails storage operator = s.operatorDetails[operatorId];
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
    ) external onlyOperatorManagerOrProofUploader(operatorId) {
        OperatorDetails storage operator = s.operatorDetails[operatorId];
        IRioLRTOperatorDelegator(operator.delegator).verifyWithdrawalCredentials(
            oracleTimestamp, stateRootProof, validatorIndices, validatorFieldsProofs, validatorFields
        );

        // Once verified, shares are tracked as EigenPod shares.
        assetRegistry().decreaseUnverifiedValidatorETHBalance(validatorIndices.length * ETH_DEPOSIT_SIZE);

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
        OperatorDetails storage operator = s.operatorDetails[operatorId];
        OperatorValidatorDetails memory validators = operator.validatorDetails;

        if (validatorCount == 0) revert INVALID_VALIDATOR_COUNT();

        // First check if there are any pending validator details that can be moved into a confirmed state.
        if (validators.total > validators.confirmed && block.timestamp >= validators.nextConfirmationTimestamp) {
            operator.validatorDetails.confirmed = validators.confirmed = validators.total;
        }

        operator.validatorDetails.total = OperatorRegistryV1Admin.VALIDATOR_DETAILS_POSITION.saveValidatorDetails(
            operatorId, validators.total, validatorCount, publicKeys, signatures
        );
        operator.validatorDetails.nextConfirmationTimestamp = uint40(block.timestamp + s.validatorKeyReviewPeriod);

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
        OperatorDetails storage operator = s.operatorDetails[operatorId];
        OperatorValidatorDetails memory validators = operator.validatorDetails;

        if (validatorCount == 0) revert INVALID_VALIDATOR_COUNT();
        if (fromIndex < validators.confirmed || fromIndex + validatorCount > validators.total) revert INVALID_INDEX();

        operator.validatorDetails.total = OperatorRegistryV1Admin.VALIDATOR_DETAILS_POSITION.removeValidatorDetails(
            operatorId, fromIndex, validatorCount, validators.total
        );
        emit OperatorPendingValidatorDetailsRemoved(operatorId, validatorCount);
    }

    /// @notice Reports validator exits that occur prior to instruction by the protocol.
    /// @param operatorId The operator's ID.
    /// @param fromIndex The index of the first validator to report.
    /// @param validatorCount The number of validators to report.
    function reportOutOfOrderValidatorExits(uint8 operatorId, uint256 fromIndex, uint256 validatorCount) external {
        OperatorDetails storage operator = s.operatorDetails[operatorId];
        OperatorValidatorDetails memory validators = operator.validatorDetails;

        if (fromIndex < validators.exited || fromIndex + validatorCount > validators.deposited) revert INVALID_INDEX();

        bytes memory exitedPubKeyBatch = ValidatorDetails.allocateMemoryForPubKeys(validatorCount);
        OperatorRegistryV1Admin.VALIDATOR_DETAILS_POSITION.loadValidatorDetails(
            operatorId, fromIndex, validatorCount, exitedPubKeyBatch, new bytes(0), 0
        );

        // Verify that all validators have exited.
        IEigenPod pod = IRioLRTOperatorDelegator(operator.delegator).eigenPod();
        bytes memory publicKey = Memory.unsafeAllocateBytes(BLS_PUBLIC_KEY_LENGTH);
        for (uint256 i = 0; i < validatorCount; ++i) {
            Memory.copyBytes(exitedPubKeyBatch, publicKey, i * BLS_PUBLIC_KEY_LENGTH, 0, BLS_PUBLIC_KEY_LENGTH);
            if (pod.validatorStatus(_hashValidatorBLSPubKey(publicKey)) != IEigenPod.VALIDATOR_STATUS.WITHDRAWN) {
                revert VALIDATOR_NOT_EXITED();
            }
        }

        // Swap the position of the validators starting from the `fromIndex` with the validators that were next in line to be exited.
        OperatorRegistryV1Admin.VALIDATOR_DETAILS_POSITION.swapValidatorDetails(
            operatorId, fromIndex, validators.exited, validatorCount
        );
        operator.validatorDetails.exited += uint40(validatorCount);

        emit OperatorOutOfOrderValidatorExitsReported(operatorId, validatorCount);
    }

    // forgefmt: disable-next-item
    /// @notice Allocates a specified amount of shares for the provided strategy to the operators with the lowest utilization.
    /// @param strategy The strategy to allocate the shares to.
    /// @param sharesToAllocate The amount of shares to allocate.
    function allocateStrategyShares(address strategy, uint256 sharesToAllocate) external onlyDepositPool returns (uint256 sharesAllocated, OperatorStrategyAllocation[] memory allocations) {
        OperatorUtilizationHeap.Data memory heap = s.getOperatorUtilizationHeapForStrategy(strategy);
        if (heap.isEmpty()) {
            return (sharesAllocated, allocations);
        }

        uint256 allocationIndex;
        uint256 remainingShares = sharesToAllocate;

        allocations = new OperatorStrategyAllocation[](s.activeOperatorCount);
        while (remainingShares > 0) {
            uint8 operatorId = heap.getMin().id;

            OperatorDetails storage operator = s.operatorDetails[operatorId];
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

            uint128 updatedAllocation = operatorShares.allocation + SafeCast.toUint128(newShareAllocation);

            operator.shareDetails[strategy].allocation = updatedAllocation;
            heap.updateUtilization(OperatorUtilizationHeap.ROOT_INDEX, updatedAllocation.divWad(operatorShares.cap));

            emit StrategySharesAllocated(operatorId, strategy, newShareAllocation, newTokenAllocation);

            unchecked {
                ++allocationIndex;
            }
        }
        sharesAllocated = sharesToAllocate - remainingShares;

        heap.store(s.activeOperatorsByStrategyShareUtilization[strategy]);

        // Shrink the array length to the number of allocations made.
        if (allocationIndex < s.activeOperatorCount) {
            assembly {
                mstore(allocations, allocationIndex)
            }
        }
    }

    // forgefmt: disable-next-item
    /// @notice Allocates a specified amount of ETH deposits to the operators with the lowest utilization.
    /// @param depositsToAllocate The amount of deposits to allocate (32 ETH each)
    function allocateETHDeposits(uint256 depositsToAllocate) external onlyDepositPool returns (uint256 depositsAllocated, OperatorETHAllocation[] memory allocations) {
        OperatorUtilizationHeap.Data memory heap = s.getOperatorUtilizationHeapForETH();
        if (heap.isEmpty()) {
            return (depositsAllocated, allocations);
        }

        uint256 allocationIndex;
        uint256 remainingDeposits = depositsToAllocate;

        uint8 skippedOperatorCount;
        OperatorUtilizationHeap.Operator[] memory skippedOperators = new OperatorUtilizationHeap.Operator[](heap.count);

        bytes memory pubKeyBatch;
        bytes memory signatureBatch;
        allocations = new OperatorETHAllocation[](s.activeOperatorCount);
        while (remainingDeposits > 0 && !heap.isEmpty()) {
            uint8 operatorId = heap.getMin().id;

            OperatorDetails storage operator = s.operatorDetails[operatorId];
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
            uint256 unallocatedConfirmedKeys = validators.confirmed - validators.deposited;
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
                OperatorRegistryV1Admin.VALIDATOR_DETAILS_POSITION.loadValidatorDetails(
                    operatorId, validators.deposited, newDepositAllocation, pubKeyBatch, signatureBatch, 0
                );
                operator.validatorDetails.deposited += uint40(newDepositAllocation);

                allocations[allocationIndex] = OperatorETHAllocation(operator.delegator, newDepositAllocation, pubKeyBatch, signatureBatch);
                remainingDeposits -= newDepositAllocation;

                updatedAllocation = activeDeposits + newDepositAllocation;

                emit ETHDepositsAllocated(operatorId, newDepositAllocation, pubKeyBatch);
            }
            heap.updateUtilization(OperatorUtilizationHeap.ROOT_INDEX, updatedAllocation.divWad(validators.cap));

            unchecked {
                ++allocationIndex;
            }
        }
        depositsAllocated = depositsToAllocate - remainingDeposits;
        if (depositsAllocated == 0) {
            return (depositsAllocated, new OperatorETHAllocation[](0));
        }

        // Reinsert skipped operators back into the heap.
        for (uint256 i = 0; i < skippedOperatorCount; ++i) {
            heap.insert(skippedOperators[i]);
        }
        heap.store(s.activeOperatorsByETHDepositUtilization);

        // Shrink the array length to the number of allocations made.
        if (allocationIndex < s.activeOperatorCount) {
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
        deallocations = new OperatorStrategyDeallocation[](s.activeOperatorCount);

        OperatorUtilizationHeap.Data memory heap = s.getOperatorUtilizationHeapForStrategy(strategy);
        if (heap.isEmpty()) revert NO_AVAILABLE_OPERATORS_FOR_DEALLOCATION();

        uint256 deallocationIndex;
        uint256 remainingShares = sharesToDeallocate;

        while (remainingShares > 0) {
            uint8 operatorId = heap.getMax().id;

            OperatorDetails storage operator = s.operatorDetails[operatorId];
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

            uint128 updatedAllocation = operatorShares.allocation - SafeCast.toUint128(newShareDeallocation);

            operator.shareDetails[strategy].allocation = updatedAllocation;
            heap.updateUtilization(heap.getMaxIndex(), updatedAllocation.divWad(operatorShares.cap));

            emit StrategySharesDeallocated(operatorId, strategy, newShareDeallocation, newTokenDeallocation);

            unchecked {
                ++deallocationIndex;
            }
        }
        sharesDeallocated = sharesToDeallocate - remainingShares;

        heap.store(s.activeOperatorsByStrategyShareUtilization[strategy]);

        // Shrink the array length to the number of deallocations made.
        if (deallocationIndex < s.activeOperatorCount) {
            assembly {
                mstore(deallocations, deallocationIndex)
            }
        }
    }

    // forgefmt: disable-next-item
    /// @notice Deallocates a specified amount of ETH deposits from the operators with the highest utilization.
    /// @param depositsToDeallocate The amount of deposits to deallocate (32 ETH each)
    function deallocateETHDeposits(uint256 depositsToDeallocate) external onlyCoordinator returns (uint256 depositsDeallocated, OperatorETHDeallocation[] memory deallocations) {
        deallocations = new OperatorETHDeallocation[](s.activeOperatorCount);

        OperatorUtilizationHeap.Data memory heap = s.getOperatorUtilizationHeapForETH();
        if (heap.isEmpty()) revert NO_AVAILABLE_OPERATORS_FOR_DEALLOCATION();

        uint256 deallocationIndex;
        uint256 remainingDeposits = depositsToDeallocate;

        bytes memory pubKeyBatch;
        while (remainingDeposits > 0) {
            uint8 operatorId = heap.getMax().id;

            OperatorDetails storage operator = s.operatorDetails[operatorId];
            OperatorValidatorDetails memory validators = operator.validatorDetails;
            uint256 activeDeposits = validators.deposited - validators.exited;

            // Exit early if the operator with the highest utilization rate has no active deposits,
            // as no further deallocations can be made.
            if (activeDeposits == 0) break;

            // Each deallocation will trigger the withdrawal of a 32 ETH deposit. The specific validators
            // to withdraw from are chosen by the software run by the operator.
            uint256 newDepositDeallocation = FixedPointMathLib.min(activeDeposits, remainingDeposits);
            pubKeyBatch = ValidatorDetails.allocateMemoryForPubKeys(newDepositDeallocation);
            OperatorRegistryV1Admin.VALIDATOR_DETAILS_POSITION.loadValidatorDetails(
                operatorId, validators.exited, newDepositDeallocation, pubKeyBatch, new bytes(0), 0
            );

            operator.validatorDetails.exited += uint40(newDepositDeallocation);

            deallocations[deallocationIndex] = OperatorETHDeallocation(operator.delegator, newDepositDeallocation);
            remainingDeposits -= newDepositDeallocation;

            uint256 updatedAllocation = activeDeposits - newDepositDeallocation;
            heap.updateUtilization(heap.getMaxIndex(), updatedAllocation.divWad(validators.cap));

            emit ETHDepositsDeallocated(operatorId, newDepositDeallocation, pubKeyBatch);

            unchecked {
                ++deallocationIndex;
            }
        }
        depositsDeallocated = depositsToDeallocate - remainingDeposits;

        heap.store(s.activeOperatorsByETHDepositUtilization);

        // Shrink the array length to the number of deallocations made.
        if (deallocationIndex < s.activeOperatorCount) {
            assembly {
                mstore(deallocations, deallocationIndex)
            }
        }
    }

    /// @dev Hashes a validator's BLS public key and returns the hash.
    /// @param pubKey The validator's BLS public key.
    function _hashValidatorBLSPubKey(bytes memory pubKey) internal pure returns (bytes32 pubKeyHash) {
        if (pubKey.length != BLS_PUBLIC_KEY_LENGTH) {
            revert INVALID_PUBLIC_KEY_LENGTH();
        }
        return sha256(abi.encodePacked(pubKey, bytes16(0)));
    }

    /// @dev Allows the owner to upgrade the operator registry implementation.
    /// @param newImplementation The implementation to upgrade to.
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
