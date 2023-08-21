// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IRioLRTController} from './interfaces/IRioLRTController.sol';

contract RioLRTAssetManager {
    /// @notice Thrown when the caller is not the controller of the pool with the given ID.
    error NOT_CONTROLLER_FOR_POOL(bytes32 poolId);

    /// @notice Throws if called by any account other than the controller of the pool with the given ID.
    modifier onlyController(bytes32 poolId) {
        if (poolId != IRioLRTController(msg.sender).pool().getPoolId()) {
            revert NOT_CONTROLLER_FOR_POOL(poolId);
        }
        _;
    }
}
