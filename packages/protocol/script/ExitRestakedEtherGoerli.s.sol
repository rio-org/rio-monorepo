// // SPDX-License-Identifier: GPL-3.0
// pragma solidity 0.8.21;

// import {Script} from 'forge-std/Script.sol';
// import {IRioLRTGateway} from 'contracts/interfaces/IRioLRTGateway.sol';

// contract ExitRestakedEtherGoerli is Script {
//     // Misc
//     address public constant ETH_ADDRESS = address(0);
//     address public constant WETH_ADDRESS = 0xdFCeA9088c8A88A76FF74892C1457C17dfeef9C1;
//     address public constant WSTETH_ADDRESS = 0x6320cD32aA674d2898A68ec82e869385Fc5f7E2f;
//     address public constant STETH_ADDRESS = 0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F;

//     // Rio
//     address public constant LRT_GATEWAY_ADDRESS = 0x8f1D28EE830e3e016761c796e5AD2cb8781c14ff;

//     function run() public {
//         IRioLRTGateway gateway = IRioLRTGateway(LRT_GATEWAY_ADDRESS);

//         uint256 minterKey = vm.envUint('DEPLOYER_PRIVATE_KEY');
//         vm.startBroadcast(minterKey);

//         _exitToWSTETH(gateway);
//         _exitToSTETH(gateway);
//         _exitToWETH(gateway);
//         _exitToETH(gateway);

//         vm.stopBroadcast();
//     }

//     function _exitToETH(IRioLRTGateway gateway) internal returns (uint256 amountIn) {
//         uint256 AMOUNT_IN_REETH = 0.01 ether;
//         uint256 MIN_AMOUNT_OUT_ETH = 0.009 ether;

//         amountIn = gateway.requestExitTokenExactIn(
//             IRioLRTGateway.ExitTokenExactInParams({
//                 tokenOut: address(0),
//                 minAmountOut: MIN_AMOUNT_OUT_ETH,
//                 requiresUnwrap: false,
//                 amountIn: AMOUNT_IN_REETH
//             })
//         );
//     }

//     function _exitToWETH(IRioLRTGateway gateway) internal returns (uint256 amountIn) {
//         uint256 AMOUNT_IN_REETH = 0.01 ether;
//         uint256 MIN_AMOUNT_OUT_WETH = 0.009 ether;

//         amountIn = gateway.requestExitTokenExactIn(
//             IRioLRTGateway.ExitTokenExactInParams({
//                 tokenOut: WETH_ADDRESS,
//                 minAmountOut: MIN_AMOUNT_OUT_WETH,
//                 requiresUnwrap: false,
//                 amountIn: AMOUNT_IN_REETH
//             })
//         );
//     }

//     function _exitToWSTETH(IRioLRTGateway gateway) internal returns (uint256 amountIn) {
//         uint256 AMOUNT_IN_REETH = 0.01 ether;
//         uint256 MIN_AMOUNT_OUT_WSTETH = 0.009 ether;

//         amountIn = gateway.requestExitTokenExactIn(
//             IRioLRTGateway.ExitTokenExactInParams({
//                 tokenOut: WSTETH_ADDRESS,
//                 minAmountOut: MIN_AMOUNT_OUT_WSTETH,
//                 requiresUnwrap: false,
//                 amountIn: AMOUNT_IN_REETH
//             })
//         );
//     }

//     function _exitToSTETH(IRioLRTGateway gateway) internal returns (uint256 amountIn) {
//         uint256 AMOUNT_IN_REETH = 0.01 ether;
//         uint256 MIN_AMOUNT_OUT_STETH = 0.009 ether;

//         amountIn = gateway.requestExitTokenExactIn(
//             IRioLRTGateway.ExitTokenExactInParams({
//                 tokenOut: STETH_ADDRESS,
//                 minAmountOut: MIN_AMOUNT_OUT_STETH,
//                 requiresUnwrap: true,
//                 amountIn: AMOUNT_IN_REETH
//             })
//         );
//     }
// }
