// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {ScriptBase} from 'script/base/ScriptBase.sol';
import {UpgradeableBeacon} from '@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol';
import {UUPSUpgradeable} from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import {RioLRTOperatorDelegator} from 'contracts/restaking/RioLRTOperatorDelegator.sol';
import {RioLRTRewardDistributor} from 'contracts/restaking/RioLRTRewardDistributor.sol';
import {RioLRTOperatorRegistry} from 'contracts/restaking/RioLRTOperatorRegistry.sol';
import {RioLRTWithdrawalQueue} from 'contracts/restaking/RioLRTWithdrawalQueue.sol';
import {RioLRTAssetRegistry} from 'contracts/restaking/RioLRTAssetRegistry.sol';
import {RioLRTCoordinator} from 'contracts/restaking/RioLRTCoordinator.sol';
import {RioLRTDepositPool} from 'contracts/restaking/RioLRTDepositPool.sol';
import {RioLRTAVSRegistry} from 'contracts/restaking/RioLRTAVSRegistry.sol';
import {IRioLRTIssuer} from 'contracts/interfaces/IRioLRTIssuer.sol';
import {RioLRTIssuer} from 'contracts/restaking/RioLRTIssuer.sol';
import {RioLRT} from 'contracts/restaking/RioLRT.sol';

// forgefmt: disable-next-item
contract UpgradeInstance is ScriptBase {
    struct ImplementationContracts {
        address issuerImpl;
        address tokenImpl;
        address coordinatorImpl;
        address assetRegistryImpl;
        address operatorDelegatorImpl;
        address operatorRegistryImpl;
        address avsRegistryImpl;
        address depositPoolImpl;
        address withdrawalQueueImpl;
        address rewardDistributorImpl;
    }

    function run() public broadcast returns (ImplementationContracts memory c) {
        address issuer = vm.envAddress('ISSUER');

        IRioLRTIssuer.LRTDeployment memory deployment = IRioLRTIssuer.LRTDeployment({
            token: vm.envAddress('TOKEN'),
            coordinator: vm.envAddress('COORDINATOR'),
            assetRegistry: vm.envAddress('ASSET_REGISTRY'),
            operatorRegistry: vm.envAddress('OPERATOR_REGISTRY'),
            avsRegistry: vm.envAddress('AVS_REGISTRY'),
            depositPool: vm.envAddress('DEPOSIT_POOL'),
            withdrawalQueue: vm.envAddress('WITHDRAWAL_QUEUE'),
            rewardDistributor: vm.envAddress('REWARD_DISTRIBUTOR')
        });
        address operatorDelegatorBeacon = vm.envAddress('OPERATOR_DELEGATOR_BEACON');

        // Deploy new implementation contracts
        c.tokenImpl = address(new RioLRT(issuer));
        c.coordinatorImpl = address(new RioLRTCoordinator(issuer, ethPOS));
        c.assetRegistryImpl = address(new RioLRTAssetRegistry(issuer));
        c.operatorDelegatorImpl = address(new RioLRTOperatorDelegator(issuer, strategyManager, eigenPodManager, delegationManager));
        c.operatorRegistryImpl = address(new RioLRTOperatorRegistry(issuer, strategyManager, operatorDelegatorBeacon));
        c.avsRegistryImpl = address(new RioLRTAVSRegistry(issuer));
        c.depositPoolImpl = address(new RioLRTDepositPool(issuer));
        c.withdrawalQueueImpl = address(new RioLRTWithdrawalQueue(issuer));
        c.rewardDistributorImpl = address(new RioLRTRewardDistributor(issuer));
        c.issuerImpl = address(
            new RioLRTIssuer(
                c.tokenImpl,
                c.coordinatorImpl,
                c.assetRegistryImpl,
                c.operatorRegistryImpl,
                c.avsRegistryImpl,
                c.depositPoolImpl,
                c.withdrawalQueueImpl,
                c.rewardDistributorImpl
            )
        );

        // Upgrade the proxies to the new implementation contracts
        UUPSUpgradeable(issuer).upgradeToAndCall(c.issuerImpl, new bytes(0));
        UUPSUpgradeable(deployment.coordinator).upgradeToAndCall(c.coordinatorImpl, new bytes(0));
        UUPSUpgradeable(deployment.assetRegistry).upgradeToAndCall(c.assetRegistryImpl, new bytes(0));
        UUPSUpgradeable(deployment.operatorRegistry).upgradeToAndCall(c.operatorRegistryImpl, new bytes(0));
        UUPSUpgradeable(deployment.avsRegistry).upgradeToAndCall(c.avsRegistryImpl, new bytes(0));
        UUPSUpgradeable(deployment.depositPool).upgradeToAndCall(c.depositPoolImpl, new bytes(0));
        UUPSUpgradeable(deployment.withdrawalQueue).upgradeToAndCall(c.withdrawalQueueImpl, new bytes(0));
        UUPSUpgradeable(deployment.rewardDistributor).upgradeToAndCall(c.rewardDistributorImpl, new bytes(0));

        UpgradeableBeacon(operatorDelegatorBeacon).upgradeTo(c.operatorDelegatorImpl);
    }
}
