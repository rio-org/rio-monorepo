// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IAuthentication} from '@balancer-v2/contracts/interfaces/contracts/solidity-utils/helpers/IAuthentication.sol';

interface IBasePoolAuthentication is IAuthentication {
    /// @notice Returns the owner of the pool.
    function getOwner() external view returns (address);
}
