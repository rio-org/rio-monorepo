// // SPDX-License-Identifier: GPL-3.0
// pragma solidity 0.8.21;

// import {Script} from 'forge-std/Script.sol';
// import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
// import {LidoStakedEtherWrapper} from 'contracts/wrapping/wrappers/LidoStakedEtherWrapper.sol';
// import {ITokenWrapperFactory} from 'contracts/interfaces/wrapping/ITokenWrapperFactory.sol';
// import {IRioLRTIssuer} from 'contracts/interfaces/IRioLRTIssuer.sol';
// import {RioLRTIssuer} from 'contracts/restaking/RioLRTIssuer.sol';

// contract IssueRestakedEtherGoerli is Script {
//     // Misc
//     address public constant WETH_ADDRESS = 0xdFCeA9088c8A88A76FF74892C1457C17dfeef9C1;
//     address public constant WSTETH_ADDRESS = 0x6320cD32aA674d2898A68ec82e869385Fc5f7E2f;
//     address public constant STETH_ADDRESS = 0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F;
//     uint256 public constant MIN_SWAP_FEE = 1e12; // 0.0001%

//     // EigenLayer
//     address public constant STETH_STRATEGY_ADDRESS = 0xB613E78E2068d7489bb66419fB1cfa11275d14da;
//     address public constant ETH_STRATEGY_ADDRESS = 0xbeaC0eeEeeeeEEeEeEEEEeeEEeEeeeEeeEEBEaC0;

//     // Rio
//     address public constant ISSUER_ADDRESS = 0x2A2fb9f94b92C957Df58dAD26f20fA51Cf45002C;
//     address public constant TOKEN_WRAPPER_FACTORY = 0x9751Ee0CE7D683BbAce6fCbf16c645Fa5874E29e;

//     function run() public returns (IRioLRTIssuer.LRTDeployment memory deployment) {
//         uint256 deployerKey = vm.envUint('DEPLOYER_PRIVATE_KEY');
//         vm.startBroadcast(deployerKey);

//         ITokenWrapperFactory tokenWrapperFactory = ITokenWrapperFactory(TOKEN_WRAPPER_FACTORY);
//         if (!tokenWrapperFactory.hasDeployedWrapper(STETH_ADDRESS)) {
//             tokenWrapperFactory.deployWrappers(
//                 STETH_ADDRESS,
//                 WSTETH_ADDRESS,
//                 abi.encodePacked(type(LidoStakedEtherWrapper).creationCode, abi.encode(STETH_ADDRESS, WSTETH_ADDRESS))
//             );
//         }

//         address[] memory tokens = new address[](2);
//         tokens[0] = WSTETH_ADDRESS;
//         tokens[1] = WETH_ADDRESS;

//         address[] memory strategies = new address[](2);
//         strategies[0] = STETH_STRATEGY_ADDRESS;
//         strategies[1] = ETH_STRATEGY_ADDRESS;

//         uint256[] memory amountsIn = new uint256[](2);
//         amountsIn[0] = 0.85 ether;
//         amountsIn[1] = 1 ether;

//         uint256[] memory normalizedWeights = new uint256[](2);
//         normalizedWeights[0] = 0.5e18;
//         normalizedWeights[1] = 0.5e18;

//         uint64[] memory targetAUMPercentages = new uint64[](2);
//         targetAUMPercentages[0] = 0.95e18;
//         targetAUMPercentages[1] = 0.95e18;

//         // Allow the issuer to pull the tokens.
//         IERC20(tokens[0]).approve(ISSUER_ADDRESS, amountsIn[0]);
//         IERC20(tokens[1]).approve(ISSUER_ADDRESS, amountsIn[1]);

//         deployment = RioLRTIssuer(ISSUER_ADDRESS).issueLRT(
//             'Restaked Ether',
//             'reETH',
//             IRioLRTIssuer.LRTConfig({
//                 tokens: tokens,
//                 strategies: strategies,
//                 amountsIn: amountsIn,
//                 normalizedWeights: normalizedWeights,
//                 targetAUMPercentages: targetAUMPercentages,
//                 swapFeePercentage: MIN_SWAP_FEE,
//                 managementAumFeePercentage: 0,
//                 swapEnabledOnStart: true,
//                 securityCouncil: vm.addr(deployerKey) // The Goerli security council is the deployer.
//             })
//         );

//         vm.stopBroadcast();
//     }
// }
