// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {LibMap} from '@solady/utils/LibMap.sol';
import {CREATE3} from '@solady/utils/CREATE3.sol';
import {FixedPointMathLib} from '@solady/utils/FixedPointMathLib.sol';
import {BeaconProxy} from '@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol';
import {RioLRTOperatorRegistryStorageV1} from 'contracts/restaking/storage/RioLRTOperatorRegistryStorageV1.sol';
import {IRioLRTOperatorDelegator} from 'contracts/interfaces/IRioLRTOperatorDelegator.sol';
import {IRioLRTOperatorRegistry} from 'contracts/interfaces/IRioLRTOperatorRegistry.sol';
import {OperatorUtilizationHeap} from 'contracts/utils/OperatorUtilizationHeap.sol';
import {IRioLRTAssetRegistry} from 'contracts/interfaces/IRioLRTAssetRegistry.sol';
import {ValidatorDetails} from 'contracts/utils/ValidatorDetails.sol';
import {BEACON_CHAIN_STRATEGY} from 'contracts/utils/Constants.sol';
import {Array} from 'contracts/utils/Array.sol';
import {Asset} from 'contracts/utils/Asset.sol';

/// @title Administrative functions for the operator registry.
library OperatorRegistryV1Admin {
    using OperatorRegistryV1Admin for RioLRTOperatorRegistryStorageV1.StorageV1;
    using OperatorRegistryV1Admin for IRioLRTOperatorRegistry.OperatorDetails;
    using OperatorUtilizationHeap for OperatorUtilizationHeap.Data;
    using ValidatorDetails for bytes32;
    using FixedPointMathLib for *;
    using LibMap for *;
    using Array for *;
    using Asset for *;

    /// @notice The maximum number of operators allowed in the registry.
    uint8 public constant MAX_OPERATOR_COUNT = 254;

    /// @notice The maximum number of active operators allowed. This may be increased
    /// to `64` in the future.
    uint8 public constant MAX_ACTIVE_OPERATOR_COUNT = 32;

    /// @dev The validator details storage position.
    bytes32 internal constant VALIDATOR_DETAILS_POSITION = keccak256('RIO.OPERATOR_REGISTRY.VALIDATOR_DETAILS');

    /// @notice Adds a new operator to the registry, deploying a delegator contract and
    /// delegating to the provided `operator`.
    /// @param s The operator registry v1 storage accessor.
    /// @param token The address of the liquid restaking token.
    /// @param operatorDelegatorBeacon The operator delegator beacon address.
    /// @param config The new operator's configuration.
    function addOperator(
        RioLRTOperatorRegistryStorageV1.StorageV1 storage s,
        address token,
        address operatorDelegatorBeacon,
        IRioLRTOperatorRegistry.OperatorConfig memory config
    ) external returns (uint8 operatorId, address delegator) {
        if (config.operator == address(0)) revert IRioLRTOperatorRegistry.INVALID_OPERATOR();
        if (config.initialManager == address(0)) revert IRioLRTOperatorRegistry.INVALID_MANAGER();
        if (config.initialEarningsReceiver == address(0)) revert IRioLRTOperatorRegistry.INVALID_EARNINGS_RECEIVER();

        if (s.operatorCount == MAX_OPERATOR_COUNT) revert IRioLRTOperatorRegistry.MAX_OPERATOR_COUNT_EXCEEDED();
        if (s.activeOperatorCount == MAX_ACTIVE_OPERATOR_COUNT) {
            revert IRioLRTOperatorRegistry.MAX_ACTIVE_OPERATOR_COUNT_EXCEEDED();
        }

        // Increment the operator count before assignment (First operator ID is 1)
        operatorId = ++s.operatorCount;
        s.activeOperatorCount += 1;

        // Create the operator with the provided salt and initialize it.
        delegator = CREATE3.deploy(
            computeOperatorSalt(operatorId),
            abi.encodePacked(type(BeaconProxy).creationCode, abi.encode(operatorDelegatorBeacon, '')),
            0
        );
        IRioLRTOperatorDelegator(delegator).initialize(token, config.operator);

        IRioLRTOperatorRegistry.OperatorDetails storage _operator = s.operatorDetails[operatorId];
        _operator.active = true;
        _operator.manager = config.initialManager;
        _operator.earningsReceiver = config.initialEarningsReceiver;
        _operator.delegator = delegator;

        emit IRioLRTOperatorRegistry.OperatorAdded(
            operatorId,
            config.operator,
            delegator,
            config.initialManager,
            config.initialEarningsReceiver,
            config.initialMetadataURI
        );

        // Populate the strategy share allocation caps for the operator.
        for (uint256 i = 0; i < config.strategyShareCaps.length; ++i) {
            s.setOperatorStrategyCap(operatorId, config.strategyShareCaps[i]);
        }

        // Populate the validator cap for the operator, if applicable.
        if (config.validatorCap > 0) {
            s.setOperatorValidatorCapInternal(operatorId, config.validatorCap);
        }
    }

    /// @notice Activates an operator.
    /// @param s The operator registry v1 storage accessor.
    /// @param operatorId The operator's ID.
    function activateOperator(RioLRTOperatorRegistryStorageV1.StorageV1 storage s, uint8 operatorId) external {
        IRioLRTOperatorRegistry.OperatorDetails storage operator = s.operatorDetails[operatorId];

        if (operator.delegator == address(0)) revert IRioLRTOperatorRegistry.INVALID_OPERATOR_DELEGATOR();
        if (operator.active) revert IRioLRTOperatorRegistry.OPERATOR_ALREADY_ACTIVE();

        operator.active = true;
        s.activeOperatorCount += 1;

        emit IRioLRTOperatorRegistry.OperatorActivated(operatorId);
    }

    /// Deactivates an operator, exiting all remaining stake to the
    /// deposit pool.
    /// @param s The operator registry v1 storage accessor.
    /// @param assetRegistry The asset registry contract.
    /// @param operatorId The operator's ID.
    function deactivateOperator(
        RioLRTOperatorRegistryStorageV1.StorageV1 storage s,
        IRioLRTAssetRegistry assetRegistry,
        uint8 operatorId
    ) external {
        IRioLRTOperatorRegistry.OperatorDetails storage operator = s.operatorDetails[operatorId];

        if (operator.delegator == address(0)) revert IRioLRTOperatorRegistry.INVALID_OPERATOR_DELEGATOR();
        if (!operator.active) revert IRioLRTOperatorRegistry.OPERATOR_ALREADY_INACTIVE();

        // Queue exits for all strategies with non-zero allocations.
        address[] memory strategies = assetRegistry.getAssetStrategies();
        for (uint256 i = 0; i < strategies.length; ++i) {
            s.setOperatorStrategyCap(
                operatorId, IRioLRTOperatorRegistry.StrategyShareCap({strategy: strategies[i], cap: 0})
            );
        }
        if (operator.validatorDetails.cap > 0) {
            s.setOperatorValidatorCapInternal(operatorId, 0);
        }

        operator.active = false;
        s.activeOperatorCount -= 1;

        emit IRioLRTOperatorRegistry.OperatorDeactivated(operatorId);
    }

    // forgefmt: disable-next-item
    /// Queues a complete exit from the specified strategy for the provided operator.
    /// @param operator The storage accessor for the operator that's exiting.
    /// @param operatorId The operator's ID.
    /// @param strategy The strategy to exit.
    function queueOperatorStrategyExit(IRioLRTOperatorRegistry.OperatorDetails storage operator, uint8 operatorId, address strategy) internal {
        IRioLRTOperatorDelegator delegator = IRioLRTOperatorDelegator(operator.delegator);

        uint256 sharesToExit;
        if (strategy == BEACON_CHAIN_STRATEGY) {
            // Queues an exit for verified validators only. Unverified validators must by exited once verified,
            // and ETH must be scraped into the deposit pool. Exits are rounded to the nearest Gwei. It is not
            // possible to exit ETH with precision less than 1 Gwei. We do not populate `sharesToExit` if the
            // Eigen Pod shares are not greater than 0.
            int256 eigenPodShares = delegator.getEigenPodShares();
            if (eigenPodShares > 0) {
                sharesToExit = uint256(eigenPodShares).reducePrecisionToGwei();
            }
        } else {
            sharesToExit = operator.shareDetails[strategy].allocation;
        }
        if (sharesToExit == 0) revert IRioLRTOperatorRegistry.CANNOT_EXIT_ZERO_SHARES();

        // Queues a withdrawal to the deposit pool.
        bytes32 withdrawalRoot = delegator.queueWithdrawalForOperatorExit(strategy, sharesToExit);
        emit IRioLRTOperatorRegistry.OperatorStrategyExitQueued(operatorId, strategy, sharesToExit, withdrawalRoot);
    }

    /// @notice Sets the operator's strategy share allocation caps.
    /// @param s The operator registry v1 storage accessor.
    /// @param operatorId The operator's ID.
    /// @param newStrategyShareCaps The new strategy share allocation caps.
    function setOperatorStrategyShareCaps(
        RioLRTOperatorRegistryStorageV1.StorageV1 storage s,
        uint8 operatorId,
        IRioLRTOperatorRegistry.StrategyShareCap[] calldata newStrategyShareCaps
    ) external {
        for (uint256 i = 0; i < newStrategyShareCaps.length; ++i) {
            s.setOperatorStrategyCap(operatorId, newStrategyShareCaps[i]);
        }
    }

    /// @notice Sets the security daemon to a new account (`newSecurityDaemon`).
    /// @param s The operator registry v1 storage accessor.
    /// @param newSecurityDaemon The new security daemon address.
    function setSecurityDaemon(RioLRTOperatorRegistryStorageV1.StorageV1 storage s, address newSecurityDaemon)
        external
    {
        s.securityDaemon = newSecurityDaemon;

        emit IRioLRTOperatorRegistry.SecurityDaemonSet(newSecurityDaemon);
    }

    /// @notice Sets the proof uploader to a new account (`newProofUploader`).
    /// @param s The operator registry v1 storage accessor.
    /// @param newProofUploader The new proof uploader address.
    function setProofUploader(RioLRTOperatorRegistryStorageV1.StorageV1 storage s, address newProofUploader) external {
        s.proofUploader = newProofUploader;

        emit IRioLRTOperatorRegistry.ProofUploaderSet(newProofUploader);
    }

    /// @notice Sets the minimum acceptable delay between an operator signaling intent to register
    // for an AVS and completing registration.
    /// @param s The operator registry v1 storage accessor.
    /// @param newMinStakerOptOutBlocks The new min staker opt out blocks.
    function setMinStakerOptOutBlocks(
        RioLRTOperatorRegistryStorageV1.StorageV1 storage s,
        uint24 newMinStakerOptOutBlocks
    ) external {
        s.minStakerOptOutBlocks = newMinStakerOptOutBlocks;

        emit IRioLRTOperatorRegistry.MinStakerOptOutBlocksSet(newMinStakerOptOutBlocks);
    }

    /// @dev Sets the amount of time (in seconds) before uploaded validator keys are considered "vetted".
    /// @param s The operator registry v1 storage accessor.
    /// @param newValidatorKeyReviewPeriod The new validator key review period.
    function setValidatorKeyReviewPeriod(
        RioLRTOperatorRegistryStorageV1.StorageV1 storage s,
        uint24 newValidatorKeyReviewPeriod
    ) external {
        s.validatorKeyReviewPeriod = newValidatorKeyReviewPeriod;

        emit IRioLRTOperatorRegistry.ValidatorKeyReviewPeriodSet(newValidatorKeyReviewPeriod);
    }

    /// @notice Sets the operator's maximum active validator cap.
    /// @param s The operator registry v1 storage accessor.
    /// @param operatorId The unique identifier of the operator.
    /// @param newValidatorCap The new maximum active validator cap.
    function setOperatorValidatorCap(
        RioLRTOperatorRegistryStorageV1.StorageV1 storage s,
        uint8 operatorId,
        uint40 newValidatorCap
    ) external {
        s.setOperatorValidatorCapInternal(operatorId, newValidatorCap);
    }

    // forgefmt: disable-next-item
    /// @notice Sets the strategy share cap for a given operator.
    /// @param s The operator registry v1 storage accessor.
    /// @param operatorId The unique identifier of the operator.
    /// @param newShareCap The new share cap details including the strategy and cap.
    function setOperatorStrategyCap(
        RioLRTOperatorRegistryStorageV1.StorageV1 storage s,
        uint8 operatorId,
        IRioLRTOperatorRegistry.StrategyShareCap memory newShareCap
    ) internal {
        IRioLRTOperatorRegistry.OperatorDetails storage operatorDetails = s.operatorDetails[operatorId];
        if (operatorDetails.delegator == address(0)) revert IRioLRTOperatorRegistry.INVALID_OPERATOR_DELEGATOR();

        IRioLRTOperatorRegistry.OperatorShareDetails memory currentShareDetails = operatorDetails.shareDetails[newShareCap.strategy];

        // If the new cap is the same as the current, no update is necessary.
        if (currentShareDetails.cap == newShareCap.cap) {
            return;
        }
        OperatorUtilizationHeap.Data memory utilizationHeap = s.getOperatorUtilizationHeapForStrategy(newShareCap.strategy);

        // If the current cap is greater than 0 and the new cap is 0, remove the operator from the strategy.
        if (currentShareDetails.cap > 0 && newShareCap.cap == 0) {
            // If the operator has allocations, queue them for exit.
            if (currentShareDetails.allocation > 0) {
                operatorDetails.queueOperatorStrategyExit(operatorId, newShareCap.strategy);
                operatorDetails.shareDetails[newShareCap.strategy].allocation = 0;
            }
            // Remove the operator from the utilization heap.
            utilizationHeap.removeByID(operatorId);
        } else if (currentShareDetails.cap == 0 && newShareCap.cap > 0) {
            // If the current cap is 0 and the new cap is greater than 0, insert the operator into the heap.
            utilizationHeap.insert(OperatorUtilizationHeap.Operator(operatorId, 0));
        } else {
            // Otherwise, update the operator's utilization in the heap.
            utilizationHeap.updateUtilizationByID(operatorId, currentShareDetails.allocation.divWad(newShareCap.cap));
        }

        // Persist the updated heap to the active operators tracking.
        utilizationHeap.store(
            s.activeOperatorsByStrategyShareUtilization[newShareCap.strategy],
            OperatorRegistryV1Admin.MAX_ACTIVE_OPERATOR_COUNT
        );

        // Update the share cap in the operator details.
        operatorDetails.shareDetails[newShareCap.strategy].cap = newShareCap.cap;

        emit IRioLRTOperatorRegistry.OperatorStrategyShareCapSet(operatorId, newShareCap.strategy, newShareCap.cap);
    }

    /// @notice Sets the operator's maximum active validator cap.
    /// @param s The operator registry v1 storage accessor.
    /// @param operatorId The unique identifier of the operator.
    /// @param newValidatorCap The new maximum active validator cap.
    function setOperatorValidatorCapInternal(
        RioLRTOperatorRegistryStorageV1.StorageV1 storage s,
        uint8 operatorId,
        uint40 newValidatorCap
    ) internal {
        IRioLRTOperatorRegistry.OperatorDetails storage operatorDetails = s.operatorDetails[operatorId];
        if (operatorDetails.delegator == address(0)) revert IRioLRTOperatorRegistry.INVALID_OPERATOR_DELEGATOR();

        IRioLRTOperatorRegistry.OperatorValidatorDetails memory validatorDetails = operatorDetails.validatorDetails;

        // If the new validator cap is the same as the current, no update is necessary.
        if (validatorDetails.cap == newValidatorCap) {
            return;
        }

        // Calculate the active deposits (deposited minus exited).
        uint40 activeDeposits = validatorDetails.deposited - validatorDetails.exited;
        OperatorUtilizationHeap.Data memory utilizationHeap = s.getOperatorUtilizationHeapForETH();

        // If the current cap is greater than 0 and the new cap is 0, remove the operator from ETH deposit tracking.
        if (validatorDetails.cap > 0 && newValidatorCap == 0) {
            // If there are active deposits, queue the operator for strategy exit.
            if (activeDeposits > 0) {
                // Unlike ERC20 strategies, we MUST emit the `ETHDepositsDeallocated` event here to
                // trigger the operator's validator exit automation software.
                bytes memory pubKeyBatch = ValidatorDetails.allocateMemoryForPubKeys(activeDeposits);
                VALIDATOR_DETAILS_POSITION.loadValidatorDetails(
                    operatorId, validatorDetails.exited, activeDeposits, pubKeyBatch, new bytes(0), 0
                );
                emit IRioLRTOperatorRegistry.ETHDepositsDeallocated(operatorId, activeDeposits, pubKeyBatch);

                operatorDetails.queueOperatorStrategyExit(operatorId, BEACON_CHAIN_STRATEGY);
                s.operatorDetails[operatorId].validatorDetails.exited += activeDeposits;
            }
            // Remove the operator from the utilization heap.
            utilizationHeap.removeByID(operatorId);
        } else if (validatorDetails.cap == 0 && newValidatorCap > 0) {
            // If the current cap is 0 and the new cap is greater than 0, insert the operator into the heap.
            utilizationHeap.insert(OperatorUtilizationHeap.Operator(operatorId, 0));
        } else {
            // Otherwise, update the operator's utilization in the heap.
            utilizationHeap.updateUtilizationByID(operatorId, activeDeposits.divWad(newValidatorCap));
        }

        // Persist the updated heap to the active operators tracking for ETH deposits.
        utilizationHeap.store(
            s.activeOperatorsByETHDepositUtilization, OperatorRegistryV1Admin.MAX_ACTIVE_OPERATOR_COUNT
        );

        // Update the validator cap in the operator details.
        operatorDetails.validatorDetails.cap = newValidatorCap;

        emit IRioLRTOperatorRegistry.OperatorValidatorCapSet(operatorId, newValidatorCap);
    }

    // forgefmt: disable-next-item
    /// @dev Returns the operator utilization heap for the specified strategy.
    /// Utilization is calculated as the operator's current allocation divided by their cap,
    /// unless the cap is 0, in which case the operator is considered to have max utilization.
    /// @param s The operator registry v1 storage accessor.
    /// @param strategy The strategy to get the heap for.
    function getOperatorUtilizationHeapForStrategy(RioLRTOperatorRegistryStorageV1.StorageV1 storage s, address strategy) internal view returns (OperatorUtilizationHeap.Data memory heap) {
        uint8 numActiveOperators = s.activeOperatorCount;
        if (numActiveOperators == 0) return OperatorUtilizationHeap.Data(new OperatorUtilizationHeap.Operator[](0), 0);
        
        heap = OperatorUtilizationHeap.initialize(MAX_ACTIVE_OPERATOR_COUNT);
        LibMap.Uint8Map storage operators = s.activeOperatorsByStrategyShareUtilization[strategy];

        IRioLRTOperatorRegistry.OperatorShareDetails memory operatorShares;
        unchecked {
            uint8 i;
            for (i = 0; i < numActiveOperators; ++i) {
                uint8 operatorId = operators.get(i);

                // Non-existent operator ID. We've reached the end of the heap.
                if (operatorId == 0) break;

                operatorShares = s.operatorDetails[operatorId].shareDetails[strategy];
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
    /// @param s The operator registry v1 storage accessor.
    function getOperatorUtilizationHeapForETH(RioLRTOperatorRegistryStorageV1.StorageV1 storage s)
        internal
        view
        returns (OperatorUtilizationHeap.Data memory heap)
    {
        uint8 numActiveOperators = s.activeOperatorCount;
        if (numActiveOperators == 0) return OperatorUtilizationHeap.Data(new OperatorUtilizationHeap.Operator[](0), 0);

        heap = OperatorUtilizationHeap.initialize(MAX_ACTIVE_OPERATOR_COUNT);

        uint256 activeDeposits;
        IRioLRTOperatorRegistry.OperatorValidatorDetails memory validators;
        unchecked {
            uint8 i;
            for (i = 0; i < numActiveOperators; ++i) {
                uint8 operatorId = s.activeOperatorsByETHDepositUtilization.get(i);

                // Non-existent operator ID. We've reached the end of the heap.
                if (operatorId == 0) break;

                validators = s.operatorDetails[operatorId].validatorDetails;
                activeDeposits = validators.deposited - validators.exited;
                heap.operators[i + 1] = OperatorUtilizationHeap.Operator({
                    id: operatorId,
                    utilization: activeDeposits.divWad(validators.cap)
                });
            }
            heap.count = i;
        }
    }

    /// @notice Computes the salt for an operator delegator, which is the
    /// operator ID converted to `bytes32`.
    /// @param operatorId The operator's ID.
    function computeOperatorSalt(uint8 operatorId) internal pure returns (bytes32) {
        return bytes32(uint256(operatorId));
    }
}
