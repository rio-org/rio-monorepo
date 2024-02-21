// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {Test} from 'forge-std/Test.sol';
import {MockChainlinkPriceSource} from 'test/utils/MockChainlinkPriceSource.sol';
import {ChainlinkPriceFeed} from 'contracts/oracle/ChainlinkPriceFeed.sol';
import {IPriceFeed} from 'contracts/interfaces/oracle/IPriceFeed.sol';

contract ChainlinkPriceFeedTest is Test {
    MockChainlinkPriceSource public priceSource;
    ChainlinkPriceFeed public priceFeed;

    function setUp() public {
        priceSource = new MockChainlinkPriceSource();
        priceFeed = new ChainlinkPriceFeed(address(priceSource), 1 days + 1 hours);
    }

    function test_decimalsSet() public {
        assertEq(priceFeed.decimals(), priceSource.decimals());
    }

    function test_descriptionSet() public {
        assertEq(priceFeed.description(), priceSource.description());
    }

    function test_getPriceStaleReverts() public {
        vm.warp(block.timestamp + 2 days);

        vm.expectRevert(abi.encodeWithSelector(IPriceFeed.STALE_PRICE.selector));
        priceFeed.getPrice();
    }

    function test_getPriceBadPriceReverts() public {
        priceSource.setAnswer(-1);

        vm.expectRevert(abi.encodeWithSelector(IPriceFeed.BAD_PRICE.selector));
        priceFeed.getPrice();
    }

    function test_getPrice() public {
        priceSource.setAnswer(1.06e18);
        assertEq(priceFeed.getPrice(), 1.06e18);
    }
}
