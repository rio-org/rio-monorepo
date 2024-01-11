// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IPriceFeed} from 'contracts/interfaces/oracle/IPriceFeed.sol';

contract MockPriceFeed is IPriceFeed {
    uint256 internal _price;

    constructor(uint256 price) {
       _price = price;
    }

    function decimals() external pure override returns (uint8) {
        return 18;
    }

    function description() external pure override returns (string memory) {
        return 'Mock Price Feed';
    }

    function getPrice() external view override returns (uint256) {
        return _price;
    }
}
