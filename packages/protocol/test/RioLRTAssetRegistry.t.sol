// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {MockERC20} from '@solady/../test/utils/mocks/MockERC20.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {IRioLRTAssetRegistry} from 'contracts/interfaces/IRioLRTAssetRegistry.sol';
import {ETH_ADDRESS, BEACON_CHAIN_STRATEGY} from 'contracts/utils/Constants.sol';
import {MockPriceFeed} from 'test/utils/MockPriceFeed.sol';
import {MockStrategy} from 'test/utils/MockStrategy.sol';
import {RioDeployer} from 'test/utils/RioDeployer.sol';

contract RioLRTAssetRegistryTest is RioDeployer {
    TestLRTDeployment public reETH;
    TestLRTDeployment public reLST;

    function setUp() public {
        deployRio();

        (reETH,) = issueRestakedETH();
        (reLST,) = issueRestakedLST();
    }

    function test_addAssetNonOwnerReverts() public {
        vm.prank(address(42));
        vm.expectRevert(abi.encodeWithSelector(OwnableUpgradeable.OwnableUnauthorizedAccount.selector, address(42)));
        reETH.assetRegistry.addAsset(
            IRioLRTAssetRegistry.AssetConfig({
                asset: address(1),
                depositCap: 0,
                priceFeed: address(2),
                strategy: address(3)
            })
        );
    }

    function test_addAssetWithInvalidAddressReverts() public {
        vm.expectRevert(abi.encodeWithSelector(IRioLRTAssetRegistry.INVALID_ASSET_ADDRESS.selector));
        reETH.assetRegistry.addAsset(
            IRioLRTAssetRegistry.AssetConfig({
                asset: address(0),
                depositCap: 0,
                priceFeed: address(2),
                strategy: address(3)
            })
        );
    }

    function test_addAssetAlreadySupportedReverts() public {
        vm.expectRevert(abi.encodeWithSelector(IRioLRTAssetRegistry.ASSET_ALREADY_SUPPORTED.selector, ETH_ADDRESS));
        reETH.assetRegistry.addAsset(
            IRioLRTAssetRegistry.AssetConfig({
                asset: ETH_ADDRESS,
                depositCap: 0,
                priceFeed: address(0),
                strategy: BEACON_CHAIN_STRATEGY
            })
        );
    }

    function test_addERC20WithInvalidDecimalsReverts() public {
        address token = address(new MockERC20('Test', 'TEST', 19));

        vm.expectRevert(abi.encodeWithSelector(IRioLRTAssetRegistry.INVALID_ASSET_DECIMALS.selector));
        reLST.assetRegistry.addAsset(
            IRioLRTAssetRegistry.AssetConfig({asset: token, depositCap: 0, priceFeed: address(2), strategy: address(3)})
        );
    }

    function test_addERC20WithInvalidPriceFeedReverts() public {
        address token = address(new MockERC20('Test', 'TEST', 18));

        vm.expectRevert(abi.encodeWithSelector(IRioLRTAssetRegistry.INVALID_PRICE_FEED.selector));
        reLST.assetRegistry.addAsset(
            IRioLRTAssetRegistry.AssetConfig({asset: token, depositCap: 0, priceFeed: address(0), strategy: address(3)})
        );
    }

    function test_addERC20WithInvalidPriceFeedDecimalsReverts() public {
        address token = address(new MockERC20('Test', 'TEST', 18));

        MockPriceFeed feed = new MockPriceFeed(1e18);
        feed.setDecimals(7);

        vm.expectRevert(abi.encodeWithSelector(IRioLRTAssetRegistry.INVALID_PRICE_FEED_DECIMALS.selector));
        reLST.assetRegistry.addAsset(
            IRioLRTAssetRegistry.AssetConfig({
                asset: token,
                depositCap: 0,
                priceFeed: address(feed),
                strategy: address(3)
            })
        );
    }

    function test_addERC20WithInvalidStrategyReverts() public {
        address token = address(new MockERC20('Test', 'TEST', 18));
        address feed = address(new MockPriceFeed(1e18));

        address strategy = address(new MockStrategy(address(99)));

        vm.expectRevert(abi.encodeWithSelector(IRioLRTAssetRegistry.INVALID_STRATEGY.selector));
        reLST.assetRegistry.addAsset(
            IRioLRTAssetRegistry.AssetConfig({asset: token, depositCap: 0, priceFeed: feed, strategy: strategy})
        );
    }

    function test_removeAssetNonOwnerReverts() public {
        vm.prank(address(42));
        vm.expectRevert(abi.encodeWithSelector(OwnableUpgradeable.OwnableUnauthorizedAccount.selector, address(42)));
        reETH.assetRegistry.removeAsset(address(1));
    }

    function test_removeUnsupportedAssetReverts() public {
        vm.expectRevert(abi.encodeWithSelector(IRioLRTAssetRegistry.ASSET_NOT_SUPPORTED.selector, address(1)));
        reETH.assetRegistry.removeAsset(address(1));
    }

    function test_removeAssetWithBalanceReverts() public {
        // ETH has a balance due to the sacrificial deposit.
        vm.expectRevert(abi.encodeWithSelector(IRioLRTAssetRegistry.ASSET_HAS_BALANCE.selector));
        reETH.assetRegistry.removeAsset(ETH_ADDRESS);
    }

    function test_removeAsset() public {
        rETH.burn(address(reLST.depositPool), rETH.balanceOf(address(reLST.depositPool)));

        reLST.assetRegistry.removeAsset(CBETH_ADDRESS);
        assertEq(reLST.assetRegistry.getSupportedAssets().length, 1);

        reLST.assetRegistry.removeAsset(RETH_ADDRESS);
        assertEq(reLST.assetRegistry.getSupportedAssets().length, 0);
    }
}
