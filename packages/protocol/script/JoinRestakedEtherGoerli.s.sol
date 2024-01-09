// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {Script} from 'forge-std/Script.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {IRioLRTGateway} from 'contracts/interfaces/IRioLRTGateway.sol';

contract JoinRestakedEtherGoerli is Script {
    // Misc
    address public constant ETH_ADDRESS = address(0);
    address public constant WETH_ADDRESS = 0xdFCeA9088c8A88A76FF74892C1457C17dfeef9C1;
    address public constant WSTETH_ADDRESS = 0x6320cD32aA674d2898A68ec82e869385Fc5f7E2f;
    address public constant STETH_ADDRESS = 0x1643E812aE58766192Cf7D2Cf9567dF2C37e9B7F;

    // Rio
    address public constant LRT_GATEWAY_ADDRESS = 0x8f1D28EE830e3e016761c796e5AD2cb8781c14ff;

    function run() public {
        IRioLRTGateway gateway = IRioLRTGateway(LRT_GATEWAY_ADDRESS);

        uint256 minterKey = vm.envUint('DEPLOYER_PRIVATE_KEY');
        vm.startBroadcast(minterKey);

        _joinWithWSTETH(minterKey, gateway);
        _joinWithSTETH(minterKey, gateway);
        _joinWithWETH(minterKey, gateway);
        _joinWithETH(gateway);

        vm.stopBroadcast();
    }

    function _joinWithETH(IRioLRTGateway gateway) internal returns (uint256 amountOut) {
        address[] memory tokens = new address[](2);
        tokens[0] = WSTETH_ADDRESS;
        tokens[1] = ETH_ADDRESS;

        uint256 AMOUNT_IN_ETH = 0.01 ether;
        uint256[] memory amountsIn = new uint256[](2);
        amountsIn[1] = AMOUNT_IN_ETH;

        amountOut = gateway.joinTokensExactIn{value: AMOUNT_IN_ETH}(
            IRioLRTGateway.JoinTokensExactInParams({
                tokensIn: tokens,
                amountsIn: amountsIn,
                requiresWrap: new bool[](2),
                minAmountOut: 0.009e18
            })
        );
    }

    function _joinWithWETH(uint256 minterKey, IRioLRTGateway gateway) internal returns (uint256 amountOut) {
        address[] memory tokens = new address[](2);
        tokens[0] = WSTETH_ADDRESS;
        tokens[1] = WETH_ADDRESS;

        uint256 AMOUNT_IN_WETH = 0.01 ether;
        uint256[] memory amountsIn = new uint256[](2);
        amountsIn[1] = AMOUNT_IN_WETH;

        if (IERC20(WETH_ADDRESS).allowance(vm.addr(minterKey), LRT_GATEWAY_ADDRESS) < AMOUNT_IN_WETH) {
            IERC20(WETH_ADDRESS).approve(LRT_GATEWAY_ADDRESS, type(uint256).max);
        }

        amountOut = gateway.joinTokensExactIn(
            IRioLRTGateway.JoinTokensExactInParams({
                tokensIn: tokens,
                amountsIn: amountsIn,
                requiresWrap: new bool[](2),
                minAmountOut: 0.009e18
            })
        );
    }

    function _joinWithWSTETH(uint256 minterKey, IRioLRTGateway gateway) internal returns (uint256 amountOut) {
        address[] memory tokens = new address[](2);
        tokens[0] = WSTETH_ADDRESS;
        tokens[1] = WETH_ADDRESS;

        uint256 AMOUNT_IN_WSTETH = 0.01 ether;
        uint256[] memory amountsIn = new uint256[](2);
        amountsIn[0] = AMOUNT_IN_WSTETH;

        if (IERC20(WSTETH_ADDRESS).allowance(vm.addr(minterKey), LRT_GATEWAY_ADDRESS) < AMOUNT_IN_WSTETH) {
            IERC20(WSTETH_ADDRESS).approve(LRT_GATEWAY_ADDRESS, type(uint256).max);
        }

        amountOut = gateway.joinTokensExactIn(
            IRioLRTGateway.JoinTokensExactInParams({
                tokensIn: tokens,
                amountsIn: amountsIn,
                requiresWrap: new bool[](2),
                minAmountOut: 0.01e18
            })
        );
    }

    function _joinWithSTETH(uint256 minterKey, IRioLRTGateway gateway) internal returns (uint256 amountOut) {
        address[] memory tokens = new address[](2);
        tokens[0] = STETH_ADDRESS;
        tokens[1] = WETH_ADDRESS;

        uint256 AMOUNT_IN_STETH = 0.01 ether;
        uint256[] memory amountsIn = new uint256[](2);
        amountsIn[0] = AMOUNT_IN_STETH;

        if (IERC20(STETH_ADDRESS).allowance(vm.addr(minterKey), LRT_GATEWAY_ADDRESS) < AMOUNT_IN_STETH) {
            IERC20(STETH_ADDRESS).approve(LRT_GATEWAY_ADDRESS, type(uint256).max);
        }

        bool[] memory requiresWrap = new bool[](2);
        requiresWrap[0] = true; // stETH must be wrapped.

        amountOut = gateway.joinTokensExactIn(
            IRioLRTGateway.JoinTokensExactInParams({
                tokensIn: tokens,
                amountsIn: amountsIn,
                requiresWrap: requiresWrap,
                minAmountOut: 0.009e18
            })
        );
    }
}
