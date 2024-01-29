// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {LibMap} from '@solady/utils/LibMap.sol';
import {IRioLRTOperatorRegistry} from 'contracts/interfaces/IRioLRTOperatorRegistry.sol';

abstract contract RioLRTOperatorRegistryStorageV1 is IRioLRTOperatorRegistry {
    /// @notice The V1 storage layout for the RioLRTOperatorRegistry contract.
    StorageV1 s;

    /// @notice The storage struct for the RioLRTOperatorRegistry contract.
    struct StorageV1 {
        /// @notice The total number of operators in the registry.
        uint8 operatorCount;
        /// @notice The number of active operators in the registry.
        uint8 activeOperatorCount;
        /// @notice The minimum acceptable delay between an operator signaling intent to register
        // for an AVS and completing registration.
        uint24 minStakerOptOutBlocks;
        /// @notice The amount of time (in seconds) before uploaded validator keys are considered "vetted".
        uint24 validatorKeyReviewPeriod;
        /// @notice The security daemon, which is responsible for removal of duplicate
        /// or invalid validator keys.
        address securityDaemon;
        /// @notice The proof uploader, which is has permission to upload proofs that verify
        /// validator withdrawal credentials on behalf of operators.
        address proofUploader;
        /// @notice The packed operator IDs, stored in a utilization priority queue, for ETH validators.
        LibMap.Uint8Map activeOperatorsByETHDepositUtilization;
        /// @notice The packed operator IDs, stored in a utilization priority queue, indexed by strategy address.
        mapping(address => LibMap.Uint8Map) activeOperatorsByStrategyShareUtilization;
        /// @notice A mapping of operator ids to their detailed information.
        mapping(uint8 => OperatorDetails) operatorDetails;
    }
}
