// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IERC20Permit} from '@balancer-v2/contracts/interfaces/contracts/solidity-utils/openzeppelin/IERC20Permit.sol';
import {IERC20} from '@balancer-v2/contracts/interfaces/contracts/solidity-utils/openzeppelin/IERC20.sol';
import {IVault} from '@balancer-v2/contracts/interfaces/contracts/vault/IVault.sol';

interface IBurnableBPT is IERC20, IERC20Permit {
    /// @notice Returns the Vault contract.
    function getVault() external view returns (IVault);

    /// @notice Burns `amount` from `msg.sender`.
    /// @param amount Amount of BPT to burn.
    function burn(uint256 amount) external;
}
