// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';

/// @title Array utility functions
library Array {
    /// @notice Convert a `uint256` element to an array.
    /// @param element The element to convert.
    function toArray(uint256 element) internal pure returns (uint256[] memory array) {
        array = new uint256[](1);
        array[0] = element;
    }

    /// @notice Convert an `IERC20` element to an array.
    /// @param element The element to convert.
    function toArray(IERC20 element) internal pure returns (IERC20[] memory array) {
        array = new IERC20[](1);
        array[0] = element;
    }

    /// @notice Convert an `address` element to an `address` array.
    /// @param element The element to convert.
    function toArray(address element) internal pure returns (address[] memory array) {
        array = new address[](1);
        array[0] = address(element);
    }

    /// @notice Returns the passed array prepended with `value`.
    /// @param array The array to prepend to.
    /// @param value The value to prepend.
    function prepend(address[] memory array, address value) internal pure returns (address[] memory newArray) {
        newArray = new address[](array.length + 1);
        newArray[0] = value;
        for (uint256 i = 0; i < array.length; ++i) {
            newArray[i + 1] = array[i];
        }
    }

    /// @notice Returns the passed array prepended with `value`.
    /// @param array The array to prepend to.
    /// @param value The value to prepend.
    function prepend(uint256[] memory array, uint256 value) internal pure returns (uint256[] memory newArray) {
        newArray = new uint256[](array.length + 1);
        newArray[0] = value;
        for (uint256 i = 0; i < array.length; ++i) {
            newArray[i + 1] = array[i];
        }
    }
}
