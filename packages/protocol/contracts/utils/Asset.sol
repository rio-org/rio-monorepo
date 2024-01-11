// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {ETH_ADDRESS} from 'contracts/utils/Constants.sol';

/// @title Asset utility functions
library Asset {
    using SafeERC20 for IERC20;
    using Asset for address;

    /// @notice Thrown when an ETH transfer fails.
    error ETH_TRANSFER_FAILED();

    /// @notice Returns the amount of the asset held by this contract.
    /// @param asset The asset to check.
    function getSelfBalance(address asset) internal view returns (uint256) {
        if (asset == ETH_ADDRESS) {
            return address(this).balance;
        }
        return IERC20(asset).balanceOf(address(this));
    }

    /// @dev Sends `amount` of the given asset to `recipient`.
    /// @param asset The asset to send.
    /// @param recipient The asset recipient.
    /// @param amount The amount of the asset to send.
    function transferTo(address asset, address recipient, uint256 amount) internal {
        if (asset == ETH_ADDRESS) {
            return recipient.transferETH(amount);
        }
        IERC20(asset).safeTransfer(recipient, amount);
    }

    /// @dev Sends `amount` of ETH to `recipient`.
    /// @param recipient The asset recipient.
    /// @param amount The amount of ETH to send.
    /// @dev This function limits the gas passed with the call to 10,000.
    function transferETH(address recipient, uint256 amount) internal {
        (bool success,) = recipient.call{value: amount, gas: 10_000}('');
        if (!success) {
            revert ETH_TRANSFER_FAILED();
        }
    }
}
