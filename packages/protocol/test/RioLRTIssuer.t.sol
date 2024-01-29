// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {IRioLRTAssetRegistry} from 'contracts/interfaces/IRioLRTAssetRegistry.sol';
import {IRioLRTIssuer} from 'contracts/interfaces/IRioLRTIssuer.sol';
import {MockPriceFeed} from 'test/utils/MockPriceFeed.sol';
import {IRioLRT} from 'contracts/interfaces/IRioLRT.sol';
import {RioDeployer} from 'test/utils/RioDeployer.sol';

contract RioLRTIssuerTest is RioDeployer {
    function setUp() public {
        deployRio();
    }

    function test_issueLRTNonOwnerReverts() public {
        vm.prank(address(42));
        vm.expectRevert(abi.encodeWithSelector(OwnableUpgradeable.OwnableUnauthorizedAccount.selector, address(42)));
        issuer.issueLRT(
            'Restaked Tokens',
            'reTKN',
            IRioLRTIssuer.LRTConfig({
                assets: new IRioLRTAssetRegistry.AssetConfig[](1),
                priceFeedDecimals: 18,
                operatorRewardPool: address(this),
                treasury: address(this),
                deposit: IRioLRTIssuer.SacrificialDeposit({asset: address(0), amount: 0})
            })
        );
    }

    function test_issuesLRTWithValidParams() public {
        address rETHPriceFeed = address(new MockPriceFeed(1.09 ether));
        address cbETHPriceFeed = address(new MockPriceFeed(1.05 ether));

        IRioLRTAssetRegistry.AssetConfig[] memory assets = new IRioLRTAssetRegistry.AssetConfig[](2);
        assets[0] = IRioLRTAssetRegistry.AssetConfig({
            asset: RETH_ADDRESS,
            depositCap: 1_000_000 ether,
            strategy: RETH_STRATEGY,
            priceFeed: rETHPriceFeed
        });
        assets[1] = IRioLRTAssetRegistry.AssetConfig({
            asset: CBETH_ADDRESS,
            depositCap: 2_000_000 ether,
            strategy: CBETH_STRATEGY,
            priceFeed: cbETHPriceFeed
        });

        cbETH.approve(address(issuer), 0.01 ether);
        IRioLRTIssuer.LRTDeployment memory deployment = issuer.issueLRT(
            'Restaked LSTs',
            'reLST',
            IRioLRTIssuer.LRTConfig({
                assets: assets,
                priceFeedDecimals: 18,
                operatorRewardPool: address(this),
                treasury: address(this),
                deposit: IRioLRTIssuer.SacrificialDeposit({asset: CBETH_ADDRESS, amount: 0.01 ether})
            })
        );
        assertTrue(issuer.isTokenFromFactory(deployment.token));

        assertNotEq(deployment.token, address(0));
        assertNotEq(deployment.coordinator, address(0));
        assertNotEq(deployment.assetRegistry, address(0));
        assertNotEq(deployment.operatorRegistry, address(0));
        assertNotEq(deployment.avsRegistry, address(0));
        assertNotEq(deployment.depositPool, address(0));
        assertNotEq(deployment.withdrawalQueue, address(0));
        assertNotEq(deployment.rewardDistributor, address(0));

        IRioLRTAssetRegistry assetRegistry = IRioLRTAssetRegistry(deployment.assetRegistry);
        address[] memory supportedAssets = assetRegistry.getSupportedAssets();
        assertEq(supportedAssets.length, 2);

        assertEq(supportedAssets[0], RETH_ADDRESS);
        assertEq(supportedAssets[1], CBETH_ADDRESS);

        uint256 EXPECTED_RETH = (MockPriceFeed(cbETHPriceFeed).getPrice() * 0.01 ether) / 1e18;

        assertEq(IRioLRT(deployment.token).totalSupply(), EXPECTED_RETH);
        assertEq(IRioLRT(deployment.token).balanceOf(address(issuer)), EXPECTED_RETH);
    }
}
