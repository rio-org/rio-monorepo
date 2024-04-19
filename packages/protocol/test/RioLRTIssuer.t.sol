// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {BEACON_CHAIN_STRATEGY, ETH_ADDRESS, MIN_SACRIFICIAL_DEPOSIT} from 'contracts/utils/Constants.sol';
import {TransparentUpgradeableProxy} from '@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol';
import {IRioLRTAssetRegistry} from 'contracts/interfaces/IRioLRTAssetRegistry.sol';
import {IRioLRTIssuer} from 'contracts/interfaces/IRioLRTIssuer.sol';
import {MissingReturnERC20} from 'test/utils/MissingReturnERC20.sol';
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

    function test_issueLRTBelowSacrificialDepositMinimumReverts() public {
        IRioLRTAssetRegistry.AssetConfig[] memory assets = new IRioLRTAssetRegistry.AssetConfig[](1);
        assets[0] = IRioLRTAssetRegistry.AssetConfig({
            asset: ETH_ADDRESS,
            depositCap: 1_000 ether,
            strategy: BEACON_CHAIN_STRATEGY,
            priceFeed: address(0)
        });

        vm.expectRevert(abi.encodeWithSelector(IRioLRTIssuer.INSUFFICIENT_SACRIFICIAL_DEPOSIT.selector));
        issuer.issueLRT(
            'Restaked ETH',
            'reETH',
            IRioLRTIssuer.LRTConfig({
                assets: assets,
                priceFeedDecimals: 18,
                operatorRewardPool: address(this),
                treasury: address(this),
                deposit: IRioLRTIssuer.SacrificialDeposit({asset: CBETH_ADDRESS, amount: MIN_SACRIFICIAL_DEPOSIT - 1})
            })
        );
    }

    function test_issueLRTETHProvidedForNonETHDepositReverts() public {
        address cbETHPriceFeed = address(new MockPriceFeed(1.05 ether));

        IRioLRTAssetRegistry.AssetConfig[] memory assets = new IRioLRTAssetRegistry.AssetConfig[](1);
        assets[0] = IRioLRTAssetRegistry.AssetConfig({
            asset: CBETH_ADDRESS,
            depositCap: 2_000_000 ether,
            strategy: CBETH_STRATEGY,
            priceFeed: cbETHPriceFeed
        });

        vm.expectRevert(abi.encodeWithSelector(IRioLRTIssuer.INVALID_ETH_PROVIDED.selector));
        issuer.issueLRT{value: 1}(
            'Restaked ETH',
            'reETH',
            IRioLRTIssuer.LRTConfig({
                assets: assets,
                priceFeedDecimals: 18,
                operatorRewardPool: address(this),
                treasury: address(this),
                deposit: IRioLRTIssuer.SacrificialDeposit({asset: CBETH_ADDRESS, amount: MIN_SACRIFICIAL_DEPOSIT})
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

    function test_issuesLRTWhenDepositingERC20WithMissingReturn() public {
        MissingReturnERC20 mrToken = new MissingReturnERC20('Missing Return Token', 'mrToken');

        address mrTokenAddress = address(mrToken);
        address mrTokenPriceFeed = address(new MockPriceFeed(1.1 ether));

        address mrTokenStrategy = address(0x555);
        _deployTo(
            type(TransparentUpgradeableProxy).creationCode,
            abi.encode(
                STRATEGY_BASE_TVL_LIMITS_IMPL_ADDRESS,
                OWNER_ADDRESS,
                abi.encodeWithSignature(
                    'initialize(uint256,uint256,address,address)',
                    type(uint256).max, // Max Per Deposit
                    type(uint256).max, // Max Total Deposits
                    mrTokenAddress, // Underlying Token
                    address(1) // Pauser Registry
                )
            ),
            mrTokenStrategy
        );

        IRioLRTAssetRegistry.AssetConfig[] memory assets = new IRioLRTAssetRegistry.AssetConfig[](1);
        assets[0] = IRioLRTAssetRegistry.AssetConfig({
            asset: mrTokenAddress,
            depositCap: 1_000_000 ether,
            strategy: mrTokenStrategy,
            priceFeed: mrTokenPriceFeed
        });

        mrToken.approve(address(issuer), 0.01 ether);
        IRioLRTIssuer.LRTDeployment memory deployment = issuer.issueLRT(
            'Restaked MRT',
            'reMRT',
            IRioLRTIssuer.LRTConfig({
                assets: assets,
                priceFeedDecimals: 18,
                operatorRewardPool: address(this),
                treasury: address(this),
                deposit: IRioLRTIssuer.SacrificialDeposit({asset: mrTokenAddress, amount: 0.01 ether})
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
        assertEq(supportedAssets.length, 1);

        assertEq(supportedAssets[0], mrTokenAddress);

        uint256 EXPECTED_MRT = (MockPriceFeed(mrTokenPriceFeed).getPrice() * 0.01 ether) / 1e18;

        assertEq(IRioLRT(deployment.token).totalSupply(), EXPECTED_MRT);
    }
}
