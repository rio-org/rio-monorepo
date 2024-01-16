// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

interface IPriceFeed {
    /// @dev Thrown when the oracle price is invalid.
    error BAD_PRICE();

    /// @dev Thrown when the oracle price is stale.
    error STALE_PRICE();

    /// @notice The type of the price feed.
    function FEED_TYPE() external view returns (string memory);

    /// @notice Get the address of the price feed source.
    function source() external view returns (address);

    /// @notice Get the number of decimals used by the price feed.
    function decimals() external view returns (uint8);

    /// @notice Get the description of the price feed.
    function description() external view returns (string memory);

    /// @notice Get the current price.
    function getPrice() external view returns (uint256);
}
