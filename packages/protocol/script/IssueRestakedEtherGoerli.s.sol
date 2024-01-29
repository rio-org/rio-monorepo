// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {Script} from 'forge-std/Script.sol';
import {IRioLRTIssuer} from 'contracts/interfaces/IRioLRTIssuer.sol';
import {IRioLRTAssetRegistry} from 'contracts/interfaces/IRioLRTAssetRegistry.sol';
import {BEACON_CHAIN_STRATEGY} from 'contracts/utils/Constants.sol';
import {RioLRTIssuer} from 'contracts/restaking/RioLRTIssuer.sol';

contract IssueRestakedEtherGoerli is Script {
    // Misc
    address public constant ETH_ADDRESS = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

    // EigenLayer
    address public constant ETH_STRATEGY_ADDRESS = 0xbeaC0eeEeeeeEEeEeEEEEeeEEeEeeeEeeEEBEaC0;

    // Rio
    address public constant ISSUER_ADDRESS = 0x74ff9755c22E97E1acB35f273784e21375a9f0c8;

    function run() public returns (IRioLRTIssuer.LRTDeployment memory deployment) {
        uint256 deployerKey = vm.envUint('DEPLOYER_PRIVATE_KEY');
        vm.startBroadcast(deployerKey);

        IRioLRTAssetRegistry.AssetConfig[] memory assets = new IRioLRTAssetRegistry.AssetConfig[](1);
        assets[0] = IRioLRTAssetRegistry.AssetConfig({
            asset: ETH_ADDRESS,
            depositCap: 0,
            priceFeed: address(0),
            strategy: BEACON_CHAIN_STRATEGY
        });

        deployment = RioLRTIssuer(ISSUER_ADDRESS).issueLRT{value: 0.01 ether}(
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

        vm.stopBroadcast();
    }
}
