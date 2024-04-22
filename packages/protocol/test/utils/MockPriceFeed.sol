// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {IPriceFeed} from 'contracts/interfaces/oracle/IPriceFeed.sol';

contract MockPriceFeed is IPriceFeed {
    uint256 internal _price;
    uint8 internal _decimals = 18;

    constructor(uint256 price) {
        _price = price;
    }

    string public constant FEED_TYPE = 'MOCK';

    function source() external view returns (address) {
        return address(this);
    }

    function decimals() external view returns (uint8) {
        return _decimals;
    }

    function description() external pure returns (string memory) {
        return 'Mock Price Feed';
    }

    function getPrice() external view returns (uint256) {
        return _price;
    }

    function setDecimals(uint8 decimals_) external {
        _decimals = decimals_;
    }
}
