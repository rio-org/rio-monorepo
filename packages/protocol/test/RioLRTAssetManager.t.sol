// // SPDX-License-Identifier: GPL-3.0
// pragma solidity 0.8.21;

// import {IBLSPublicKeyCompendium} from 'contracts/interfaces/eigenlayer/IBLSPublicKeyCompendium.sol';
// import {IRioLRTOperatorRegistry} from 'contracts/interfaces/IRioLRTOperatorRegistry.sol';
// import {IRioLRTAssetManager} from 'contracts/interfaces/IRioLRTAssetManager.sol';
// import {IRioLRTOperator} from 'contracts/interfaces/IRioLRTOperator.sol';
// import {IRioLRTIssuer} from 'contracts/interfaces/IRioLRTIssuer.sol';
// import {RioDeployer} from 'test/utils/RioDeployer.sol';

// contract RioLRTAssetManagerTest is RioDeployer {
//     IRioLRTIssuer.LRTDeployment public deployment;
//     IRioLRTAssetManager public assetManager;
//     IRioLRTOperatorRegistry.StrategyShareCap[] public defaultStrategyShareCaps;
//     IRioLRTOperator.BLSRegistrationDetails public defaultBlsDetails;

//     uint128 public constant DEFAULT_STRATEGY_CAP = 1_000_000 ether;

//     function setUp() public {
//         deployRio();

//         (deployment,) = issueRestakedETH();
//         assetManager = IRioLRTAssetManager(deployment.assetManager);

//         defaultStrategyShareCaps.push(
//             IRioLRTOperatorRegistry.StrategyShareCap({strategy: STETH_STRATEGY, cap: DEFAULT_STRATEGY_CAP})
//         );

//         uint256[2] memory elements = [uint256(0), uint256(0)];
//         defaultBlsDetails = IRioLRTOperator.BLSRegistrationDetails({
//             signedMessageHash: IBLSPublicKeyCompendium.G1Point(0, 0),
//             pubkeyG1: IBLSPublicKeyCompendium.G1Point(0, 0),
//             pubkeyG2: IBLSPublicKeyCompendium.G2Point(elements, elements)
//         });

//         // Ignore BLS key validation
//         vm.mockCall(
//             BLS_PUBLIC_KEY_COMPENDIUM_ADDRESS,
//             abi.encodeWithSelector(IBLSPublicKeyCompendium.registerBLSPublicKey.selector),
//             new bytes(0)
//         );

//         // Create 10 operators
//         for (uint256 i = 0; i < 10; i++) {
//             IRioLRTOperatorRegistry(deployment.operatorRegistry).createOperator(
//                 address(this),
//                 address(this),
//                 'https://example.com/metadata.json',
//                 defaultBlsDetails,
//                 defaultStrategyShareCaps,
//                 100,
//                 bytes32(i)
//             );
//         }
//     }

//     function test_rebalanceDepositsWrappedTokenIntoEigenLayerIfUnderInvested() public {
//         (uint256 initialCashBalance, uint256 initialManagedBalance) = assetManager.getPoolBalances(address(wstETH));

//         uint256 EXPECTED_MANAGED_BALANCE = (initialCashBalance * TARGET_AUM_PERCENTAGE) / 1e18;
//         uint256 EXPECTED_CASH_BALANCE = initialCashBalance - EXPECTED_MANAGED_BALANCE;

//         assertEq(initialCashBalance, INITIAL_WSTETH_CASH_BALANCE);
//         assertEq(initialManagedBalance, 0);
//         assertEq(assetManager.getStrategyShares(address(wstETH)), 0);

//         assetManager.rebalance(address(wstETH));

//         IRioLRTAssetManager.TokenRebalance memory rebalance = assetManager.getRebalance(address(wstETH));
//         assertEq(rebalance.lastRebalancedAt, block.timestamp);

//         uint256 strategyShares = assetManager.getStrategyShares(STETH_STRATEGY);
//         assertEq(strategyShares, EXPECTED_MANAGED_BALANCE); // Shares start out at 1-1 ratio with tokens

//         (uint256 cashBalance, uint256 managedBalance) = assetManager.getPoolBalances(address(wstETH));
//         assertEq(cashBalance, EXPECTED_CASH_BALANCE);
//         assertEq(managedBalance, EXPECTED_MANAGED_BALANCE);
//     }
// }
