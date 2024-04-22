// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {ScriptBase} from 'script/base/ScriptBase.sol';
import {IRioLRTIssuer} from 'contracts/interfaces/IRioLRTIssuer.sol';
import {IRioLRTAssetRegistry} from 'contracts/interfaces/IRioLRTAssetRegistry.sol';
import {ETH_ADDRESS, BEACON_CHAIN_STRATEGY} from 'contracts/utils/Constants.sol';
import {RioLRTIssuer} from 'contracts/restaking/RioLRTIssuer.sol';

contract IssueRestakedEther is ScriptBase {
    function run() public broadcast returns (IRioLRTIssuer.LRTDeployment memory deployment) {
        RioLRTIssuer issuer = RioLRTIssuer(vm.envAddress('ISSUER'));

        IRioLRTAssetRegistry.AssetConfig[] memory assets = new IRioLRTAssetRegistry.AssetConfig[](1);
        assets[0] = IRioLRTAssetRegistry.AssetConfig({
            asset: ETH_ADDRESS,
            depositCap: 0,
            priceFeed: address(0),
            strategy: BEACON_CHAIN_STRATEGY
        });

        deployment = issuer.issueLRT{value: 0.01 ether}(
            'Restaked Ether',
            'reETH',
            IRioLRTIssuer.LRTConfig({
                assets: assets,
                priceFeedDecimals: 18,
                operatorRewardPool: vm.addr(deployerKey),
                treasury: vm.addr(deployerKey),
                deposit: IRioLRTIssuer.SacrificialDeposit({asset: ETH_ADDRESS, amount: 0.01 ether})
            })
        );
    }
}
