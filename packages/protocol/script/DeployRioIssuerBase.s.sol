// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

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

    constructor(address strategyManager_, address eigenPodManager_, address delegationManager_) {
        strategyManager = strategyManager_;
        eigenPodManager = eigenPodManager_;
        delegationManager = delegationManager_;
    }

    function run() public returns (RioLRTIssuer issuer) {
        uint256 deployerKey = vm.envUint('DEPLOYER_PRIVATE_KEY');
        vm.startBroadcast(deployerKey);

        address issuerAddress = computeCreateAddress(address(this), vm.getNonce(address(this)) + 10);
        address issuerImpl = address(
            new RioLRTIssuer(
                address(new RioLRT(issuerAddress)),
                address(new RioLRTCoordinator(issuerAddress)),
                address(new RioLRTAssetRegistry(issuerAddress)),
                address(
                    new RioLRTOperatorRegistry(
                        issuerAddress,
                        vm.addr(deployerKey),
                        address(
                            new RioLRTOperatorDelegator(
                                issuerAddress, strategyManager, eigenPodManager, delegationManager
                            )
                        ),
                        delegationManager
                    )
                ),
                address(new RioLRTAVSRegistry(issuerAddress)),
                address(new RioLRTDepositPool(issuerAddress)),
                address(new RioLRTWithdrawalQueue(issuerAddress, delegationManager)),
                address(new RioLRTRewardDistributor(issuerAddress))
            )
        );
        issuer = RioLRTIssuer(
            address(new ERC1967Proxy(issuerImpl, abi.encodeCall(IRioLRTIssuer.initialize, (vm.addr(deployerKey)))))
        );

        vm.stopBroadcast();
    }
}
