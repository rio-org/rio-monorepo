// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

interface IAuthentication {
    /// @dev Returns the action identifier associated with the external function described by `selector`.
    function getActionId(bytes4 selector) external view returns (bytes32);
}
