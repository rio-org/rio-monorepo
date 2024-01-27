// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

/// @title Array utility functions
library Array {
    /// @notice Convert a `uint256` element to an array.
    /// @param element The element to convert.
    function toArray(uint256 element) internal pure returns (uint256[] memory array) {
        array = new uint256[](1);
        array[0] = element;
    }

    /// @notice Convert an `address` element to an `address` array.
    /// @param element The element to convert.
    function toArray(address element) internal pure returns (address[] memory array) {
        array = new address[](1);
        array[0] = address(element);
    }
}
