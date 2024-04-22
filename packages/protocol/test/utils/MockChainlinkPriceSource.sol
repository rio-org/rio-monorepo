// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {IChainlinkAggregatorV3} from 'contracts/interfaces/oracle/IChainlinkAggregatorV3.sol';

contract MockChainlinkPriceSource is IChainlinkAggregatorV3 {
    uint8 public decimals = 18;
    string public description = 'Mock Chainlink Price Source';
    uint256 public version = 1;

    uint80 internal _roundId = 1;
    int256 internal _answer = 1.05e18;
    uint256 internal _startedAt = block.timestamp;
    uint256 internal _updatedAt = block.timestamp;
    uint80 internal _answeredInRound = 10;

    function setDecimals(uint8 _decimals) external {
        decimals = _decimals;
    }

    function setDescription(string calldata _description) external {
        description = _description;
    }

    function setVersion(uint256 _version) external {
        version = _version;
    }

    function setRoundId(uint80 roundId) external {
        _roundId = roundId;
    }

    function setAnswer(int256 answer) external {
        _answer = answer;
    }

    function setStartedAt(uint256 startedAt) external {
        _startedAt = startedAt;
    }

    function setUpdatedAt(uint256 updatedAt) external {
        _updatedAt = updatedAt;
    }

    function setAnsweredInRound(uint80 answeredInRound) external {
        _answeredInRound = answeredInRound;
    }

    /// @notice Provides the latest data round's details including round ID, price, timestamps, and completion status.
    function latestRoundData()
        external
        view
        returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)
    {
        return (_roundId, _answer, _startedAt, _updatedAt, _answeredInRound);
    }
}
