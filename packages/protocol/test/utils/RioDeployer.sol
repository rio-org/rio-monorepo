// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {EigenLayerDeployer} from 'test/utils/EigenLayerDeployer.sol';
import {ERC1967Proxy} from '@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol';
import {RioLRTOperatorRegistry} from 'contracts/restaking/RioLRTOperatorRegistry.sol';
import {RioLRTRewardDistributor} from 'contracts/restaking/RioLRTRewardDistributor.sol';
import {RioLRTOperatorDelegator} from 'contracts/restaking/RioLRTOperatorDelegator.sol';
import {RioLRTWithdrawalQueue} from 'contracts/restaking/RioLRTWithdrawalQueue.sol';
import {IRioLRTAssetRegistry} from 'contracts/interfaces/IRioLRTAssetRegistry.sol';
import {BEACON_CHAIN_STRATEGY,ETH_ADDRESS} from 'contracts/utils/Constants.sol';
import {RioLRTAssetRegistry} from 'contracts/restaking/RioLRTAssetRegistry.sol';
import {RioLRTCoordinator} from 'contracts/restaking/RioLRTCoordinator.sol';
import {RioLRTDepositPool} from 'contracts/restaking/RioLRTDepositPool.sol';
import {RioLRTAVSRegistry} from 'contracts/restaking/RioLRTAVSRegistry.sol';
import {IRioLRTIssuer} from 'contracts/interfaces/IRioLRTIssuer.sol';
import {RioLRTIssuer} from 'contracts/restaking/RioLRTIssuer.sol';
import {RioLRT} from 'contracts/restaking/RioLRT.sol';

abstract contract RioDeployer is EigenLayerDeployer {
    RioLRTIssuer issuer;

    function deployRio() public {
        deployEigenLayer();

        address issuerImpl = address(
            new RioLRTIssuer(
                address(new RioLRT()),
                address(new RioLRTCoordinator()),
                address(new RioLRTAssetRegistry()),
                address(
                    new RioLRTOperatorRegistry(
                        address(this),
                        address(
                            new RioLRTOperatorDelegator(STRATEGY_MANAGER_ADDRESS, EIGEN_POD_MANAGER_ADDRESS, DELEGATION_MANAGER_ADDRESS)
                        )
                    )
                ),
                address(new RioLRTAVSRegistry()),
                address(new RioLRTDepositPool()),
                address(new RioLRTWithdrawalQueue(DELEGATION_MANAGER_ADDRESS)),
                address(new RioLRTRewardDistributor())
            )
        );
        issuer = RioLRTIssuer(
            address(new ERC1967Proxy(issuerImpl, abi.encodeCall(IRioLRTIssuer.initialize, (address(this)))))
        );
    }

    function issueRestakedETH() public returns (IRioLRTIssuer.LRTDeployment memory d, IRioLRTAssetRegistry.AssetConfig[] memory assets) {
        assets = new IRioLRTAssetRegistry.AssetConfig[](1);
        assets[0] = IRioLRTAssetRegistry.AssetConfig({
            asset: ETH_ADDRESS,
            depositCap: 1_000 ether,
            priceFeed: address(0),
            strategy: BEACON_CHAIN_STRATEGY
        });

        d = issuer.issueLRT(
            'Restaked Ether',
            'reETH',
            IRioLRTIssuer.LRTConfig({
                assets: assets,
                priceFeedDecimals: 18,
                operatorRewardPool: address(this),
                treasury: address(this)
            })
        );
    }
}
