// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {ERC1967Proxy} from '@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol';
import {RioLRTOperatorRegistry} from 'contracts/restaking/RioLRTOperatorRegistry.sol';
import {RioLRTRewardDistributor} from 'contracts/restaking/RioLRTRewardDistributor.sol';
import {RioLRTWithdrawalQueue} from 'contracts/restaking/RioLRTWithdrawalQueue.sol';
import {RioLRTAssetManager} from 'contracts/restaking/RioLRTAssetManager.sol';
import {RioLRTController} from 'contracts/restaking/RioLRTController.sol';
import {RioLRTOperator} from 'contracts/restaking/RioLRTOperator.sol';
import {IRioLRTIssuer} from 'contracts/interfaces/IRioLRTIssuer.sol';
import {RioLRTIssuer} from 'contracts/restaking/RioLRTIssuer.sol';
import {BalancerDeployer} from 'test/utils/BalancerDeployer.sol';

abstract contract RioDeployer is BalancerDeployer {
    RioLRTIssuer issuer;

    function deployRio() public {
        deployBalancer();

        address issuerImpl = address(
            new RioLRTIssuer(
                MANAGED_POOL_FACTORY_ADDRESS,
                VAULT_ADDRESS,
                WETH_ADDRESS,
                address (new RioLRTController()),
                address (new RioLRTAssetManager(VAULT_ADDRESS)),
                address (new RioLRTRewardDistributor(address(0))),
                address (new RioLRTOperatorRegistry(
                    VAULT_ADDRESS,
                    address(new RioLRTOperator(address(0), address(0), address(0), address(0), address(0)))
                )),
                address (new RioLRTWithdrawalQueue(address(0), address(0)))
            )
        );
        issuer = RioLRTIssuer(
            address(new ERC1967Proxy(issuerImpl, abi.encodeCall(IRioLRTIssuer.initialize, (address(this)))))
        );
    }
}
