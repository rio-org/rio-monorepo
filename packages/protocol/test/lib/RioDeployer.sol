// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {ERC1967Proxy} from '@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol';
import {RioLRTOperatorRegistry} from '../../contracts/RioLRTOperatorRegistry.sol';
import {RioLRTAssetManager} from '../../contracts/RioLRTAssetManager.sol';
import {IRioLRTIssuer} from '../../contracts/interfaces/IRioLRTIssuer.sol';
import {RioLRTController} from '../../contracts/RioLRTController.sol';
import {RioLRTIssuer} from '../../contracts/RioLRTIssuer.sol';
import {BalancerDeployer} from './BalancerDeployer.sol';
import {Operator} from '../../contracts/Operator.sol';

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
                address (new RioLRTOperatorRegistry(
                    VAULT_ADDRESS,
                    address(new Operator(address(0), address(0), address(0), address(0)))
                ))
            )
        );
        issuer = RioLRTIssuer(
            address(new ERC1967Proxy(issuerImpl, abi.encodeCall(IRioLRTIssuer.initialize, (address(this)))))
        );
    }
}
