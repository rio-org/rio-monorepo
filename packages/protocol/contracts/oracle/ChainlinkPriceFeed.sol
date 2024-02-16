// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {IChainlinkAggregatorV3} from 'contracts/interfaces/oracle/IChainlinkAggregatorV3.sol';
import {IPriceFeed} from 'contracts/interfaces/oracle/IPriceFeed.sol';

contract ChainlinkPriceFeed is IPriceFeed {
    /// @notice The type of the price feed.
    string public constant FEED_TYPE = 'CHAINLINK';

    /// @notice The address of the price feed source (Chainlink Aggregator).
    address public immutable source;

    /// @notice The amount of time after which an asset price is considered stale.
    uint256 public immutable stalePriceDelay;

    /// @notice The number of decimals used by the price feed.
    uint8 public immutable decimals;

    /// @notice The description of the price feed.
    string public description;

    /// @param source_ The address of the price feed source (Chainlink Aggregator).
    /// @param stalePriceDelay_ The amount of time after which an asset price is considered stale.
    constructor(address source_, uint256 stalePriceDelay_) {
        source = source_;
        stalePriceDelay = stalePriceDelay_;

        decimals = IChainlinkAggregatorV3(source_).decimals();
        description = IChainlinkAggregatorV3(source_).description();
    }

    /// @notice Get the current price.
    function getPrice() external view returns (uint256) {
        (, int256 price,, uint256 updatedAt,) = IChainlinkAggregatorV3(source).latestRoundData();
        if (block.timestamp > updatedAt + stalePriceDelay) revert STALE_PRICE();
        if (price <= 0) revert BAD_PRICE();

        return uint256(price);
    }
}
