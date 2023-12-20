// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {IERC20Permit} from '@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol';
import {IVault} from 'contracts/interfaces/balancer/IVault.sol';

interface IBurnableBPT is IERC20, IERC20Permit {
    /// @notice Returns the Vault contract.
    function getVault() external view returns (IVault);

    /// @notice Burns `amount` from `msg.sender`.
    /// @param amount Amount of BPT to burn.
    function burn(uint256 amount) external;
}
