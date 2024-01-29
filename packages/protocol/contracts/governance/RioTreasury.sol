// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {TimelockControllerUpgradeable} from '@openzeppelin/contracts-upgradeable/governance/TimelockControllerUpgradeable.sol';

contract RioTreasury is TimelockControllerUpgradeable {
    function initialize(uint256 minDelay, address[] memory proposers, address[] memory executors, address admin) external initializer {
        __TimelockController_init(minDelay, proposers, executors, admin);
    }
}
