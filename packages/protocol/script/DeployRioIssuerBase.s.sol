// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {Script} from 'forge-std/Script.sol';
import {IRioLRTIssuer} from 'contracts/interfaces/IRioLRTIssuer.sol';
import {ERC1967Proxy} from '@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol';
import {RioLRTOperatorRegistry} from 'contracts/restaking/RioLRTOperatorRegistry.sol';
import {RioLRTRewardDistributor} from 'contracts/restaking/RioLRTRewardDistributor.sol';
import {RioLRTOperatorDelegator} from 'contracts/restaking/RioLRTOperatorDelegator.sol';
import {RioLRTWithdrawalQueue} from 'contracts/restaking/RioLRTWithdrawalQueue.sol';
import {RioLRTAssetRegistry} from 'contracts/restaking/RioLRTAssetRegistry.sol';
import {RioLRTCoordinator} from 'contracts/restaking/RioLRTCoordinator.sol';
import {RioLRTAVSRegistry} from 'contracts/restaking/RioLRTAVSRegistry.sol';
import {RioLRTDepositPool} from 'contracts/restaking/RioLRTDepositPool.sol';
import {RioLRTIssuer} from 'contracts/restaking/RioLRTIssuer.sol';
import {RioLRT} from 'contracts/restaking/RioLRT.sol';

contract DeployRioIssuerBase is Script {
    // EigenLayer
    address public immutable strategyManager;
    address public immutable eigenPodManager;
    address public immutable delegationManager;
    address public immutable blsPublicKeyCompendium;
    address public immutable slasher;

    constructor(
        address strategyManager_,
        address eigenPodManager_,
        address delegationManager_,
        address blsPublicKeyCompendium_,
        address slasher_
    ) {
        strategyManager = strategyManager_;
        eigenPodManager = eigenPodManager_;
        delegationManager = delegationManager_;
        blsPublicKeyCompendium = blsPublicKeyCompendium_;
        slasher = slasher_;
    }

    function run() public returns (RioLRTIssuer issuer) {
        uint256 deployerKey = vm.envUint('DEPLOYER_PRIVATE_KEY');
        vm.startBroadcast(deployerKey);

        address issuerImpl = address(
            new RioLRTIssuer(
                address(new RioLRT()),
                address(new RioLRTCoordinator()),
                address(new RioLRTAssetRegistry()),
                address(
                    new RioLRTOperatorRegistry(
                        vm.addr(deployerKey),
                        address(
                            new RioLRTOperatorDelegator(strategyManager, eigenPodManager, delegationManager)
                        )
                    )
                ),
                address(new RioLRTAVSRegistry()),
                address(new RioLRTDepositPool()),
                address(new RioLRTWithdrawalQueue(delegationManager)),
                address(new RioLRTRewardDistributor())
            )
        );
        issuer = RioLRTIssuer(
            address(new ERC1967Proxy(issuerImpl, abi.encodeCall(IRioLRTIssuer.initialize, (vm.addr(deployerKey)))))
        );

        vm.stopBroadcast();
    }
}
