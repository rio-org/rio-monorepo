// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IManagedPoolSettings} from './IManagedPoolSettings.sol';

interface IManagedPoolFactory {
    function create(
        IManagedPoolSettings.ManagedPoolParams memory params,
        IManagedPoolSettings.ManagedPoolSettingsParams memory settingsParams,
        address owner,
        bytes32 salt
    ) external returns (address pool);
}
