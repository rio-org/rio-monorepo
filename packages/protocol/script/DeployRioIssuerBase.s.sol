// // SPDX-License-Identifier: GPL-3.0
// pragma solidity 0.8.21;

// import {Script} from 'forge-std/Script.sol';
// import {IRioLRTIssuer} from 'contracts/interfaces/IRioLRTIssuer.sol';
// import {ERC1967Proxy} from '@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol';
// import {RioLRTOperatorRegistry} from 'contracts/restaking/RioLRTOperatorRegistry.sol';
// import {RioLRTRewardDistributor} from 'contracts/restaking/RioLRTRewardDistributor.sol';
// import {RioLRTWithdrawalQueue} from 'contracts/restaking/RioLRTWithdrawalQueue.sol';
// import {TokenWrapperFactory} from 'contracts/wrapping/TokenWrapperFactory.sol';
// // import {RioLRTAssetManager} from 'contracts/restaking/RioLRTAssetManager.sol';
// import {RioLRTAVSRegistry} from 'contracts/restaking/RioLRTAVSRegistry.sol';
// import {RioLRTOperator} from 'contracts/restaking/RioLRTOperator.sol';
// import {RioLRTGateway} from 'contracts/restaking/RioLRTGateway.sol';
// import {RioLRTIssuer} from 'contracts/restaking/RioLRTIssuer.sol';
// import {RioLRT} from 'contracts/restaking/RioLRT.sol';

// contract DeployRioIssuerBase is Script {
//     // Misc
//     address public immutable weth;

//     // Balancer
//     address public immutable vault;
//     address public immutable managedPoolFactory;
//     address public immutable balancerQueries;

//     // EigenLayer
//     address public immutable strategyManager;
//     address public immutable eigenPodManager;
//     address public immutable delegationManager;
//     address public immutable blsPublicKeyCompendium;
//     address public immutable slasher;

//     constructor(
//         address weth_,
//         address vault_,
//         address managedPoolFactory_,
//         address balancerQueries_,
//         address strategyManager_,
//         address eigenPodManager_,
//         address delegationManager_,
//         address blsPublicKeyCompendium_,
//         address slasher_
//     ) {
//         weth = weth_;
//         vault = vault_;
//         managedPoolFactory = managedPoolFactory_;
//         balancerQueries = balancerQueries_;
//         strategyManager = strategyManager_;
//         eigenPodManager = eigenPodManager_;
//         delegationManager = delegationManager_;
//         blsPublicKeyCompendium = blsPublicKeyCompendium_;
//         slasher = slasher_;
//     }

//     function run() public returns (RioLRTIssuer issuer) {
//         uint256 deployerKey = vm.envUint('DEPLOYER_PRIVATE_KEY');
//         vm.startBroadcast(deployerKey);

//         address tokenWrapperFactory = address(new TokenWrapperFactory());
//         address issuerImpl = address(
//             new RioLRTIssuer(
//                 managedPoolFactory,
//                 weth,
//                 address(new RioLRT()),
//                 address(new RioLRTGateway(tokenWrapperFactory, weth, vault, balancerQueries)),
//                 address(0), // address(new RioLRTAssetManager(tokenWrapperFactory, vault, weth)),
//                 address(new RioLRTRewardDistributor(address(0), address(0))),
//                 address(
//                     new RioLRTOperatorRegistry(
//                         vault,
//                         address(
//                             new RioLRTOperator(
//                                 strategyManager,
//                                 eigenPodManager,
//                                 delegationManager,
//                                 blsPublicKeyCompendium,
//                                 slasher,
//                                 address(0)
//                             )
//                         )
//                     )
//                 ),
//                 address(new RioLRTWithdrawalQueue(tokenWrapperFactory, delegationManager)),
//                 address(new RioLRTAVSRegistry())
//             )
//         );
//         issuer = RioLRTIssuer(
//             address(new ERC1967Proxy(issuerImpl, abi.encodeCall(IRioLRTIssuer.initialize, (vm.addr(deployerKey)))))
//         );

//         vm.stopBroadcast();
//     }
// }
