// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {ScriptBase} from 'script/base/ScriptBase.sol';
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

contract DeployRioIssuer is ScriptBase {
    function run() public broadcast returns (RioLRTIssuer issuer) {
        address issuerAddress = computeCreateAddress(deployer, vm.getNonce(deployer) + 10);
        address issuerImpl = address(
            new RioLRTIssuer(
                address(new RioLRT(issuerAddress)),
                address(new RioLRTCoordinator(issuerAddress)),
                address(new RioLRTAssetRegistry(issuerAddress)),
                address(
                    new RioLRTOperatorRegistry(
                        issuerAddress,
                        deployer,
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
        // forgefmt: disable-next-item
        issuer = RioLRTIssuer(
            address(new ERC1967Proxy(issuerImpl, abi.encodeCall(IRioLRTIssuer.initialize, (deployer))))
        );
    }
}
