// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IChainlinkAggregatorV3} from 'contracts/interfaces/oracle/IChainlinkAggregatorV3.sol';
import {IPriceFeed} from 'contracts/interfaces/oracle/IPriceFeed.sol';

contract ChainlinkPriceFeed is IPriceFeed {
    /// @notice The Chainlink aggregator used by the price feed.
    IChainlinkAggregatorV3 public immutable aggregator;

    /// @notice The amount of time after which an asset price is considered stale.
    uint256 public immutable stalePriceDelay;

    /// @notice The number of decimals used by the price feed.
    uint8 public immutable decimals;

    /// @notice The description of the price feed.
    string public description;

    /// @param aggregator_ The Chainlink aggregator used by the price feed.
    /// @param stalePriceDelay_ The amount of time after which an asset price is considered stale.
    constructor(address aggregator_, uint256 stalePriceDelay_) {
        aggregator = IChainlinkAggregatorV3(aggregator_);
        stalePriceDelay = stalePriceDelay_;

        decimals = aggregator.decimals();
        description = aggregator.description();
    }

    /// @notice Get the current price.
    function getPrice() external view override returns (uint256) {
        (, int256 price,, uint256 updatedAt,) = aggregator.latestRoundData();
        if (block.timestamp > updatedAt + stalePriceDelay) revert STALE_PRICE();
        if (price <= 0) revert BAD_PRICE();

        return uint256(price);
    }
}
