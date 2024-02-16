// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {SafeCast} from '@openzeppelin/contracts/utils/math/SafeCast.sol';
import {ETH_ADDRESS, GWEI_TO_WEI} from 'contracts/utils/Constants.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';

/// @title Asset utility functions.
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

    /// @dev Converts an amount of Gwei to Wei.
    /// @param amountGwei The amount in Gwei to convert.
    function toWei(uint256 amountGwei) internal pure returns (uint256) {
        return amountGwei * GWEI_TO_WEI;
    }

    /// @dev Converts an amount of Wei to Gwei.
    /// @param amountWei The amount in Wei to convert.
    function toGwei(uint256 amountWei) internal pure returns (uint64) {
        return SafeCast.toUint64(amountWei / GWEI_TO_WEI);
    }

    /// @notice Reduces the precision of the given amount to the nearest Gwei.
    /// @param amountWei The amount whose precision is to be reduced.
    function reducePrecisionToGwei(uint256 amountWei) internal pure returns (uint256) {
        return amountWei - (amountWei % GWEI_TO_WEI);
    }
}
