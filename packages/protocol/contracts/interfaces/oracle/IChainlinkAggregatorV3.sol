// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

interface IChainlinkAggregatorV3 {
    /// @notice Returns the number of decimals for the data returned by `latestRoundData`.
    function decimals() external view returns (uint8);

    /// @notice Provides a human-readable description of the aggregator.
    function description() external view returns (string memory);

    /// @notice Returns the version number of the aggregator interface.
    function version() external view returns (uint256);

    /// @notice Provides the latest data round's details including round ID, price, timestamps, and completion status.
    function latestRoundData()
        external
        view
        returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);
}
