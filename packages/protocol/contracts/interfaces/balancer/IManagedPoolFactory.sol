// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IManagedPool} from 'contracts/interfaces/balancer/IManagedPool.sol';

interface IManagedPoolFactory {
    function create(
        IManagedPool.ManagedPoolParams memory params,
        IManagedPool.ManagedPoolSettingsParams memory settingsParams,
        address owner,
        bytes32 salt
    ) external returns (address pool);
}
