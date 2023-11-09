// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {IRioLRTIssuer} from 'contracts/interfaces/IRioLRTIssuer.sol';
import {IRioLRT} from 'contracts/interfaces/IRioLRT.sol';
import {RioDeployer} from 'test/utils/RioDeployer.sol';

contract RioLRTIssuerTest is RioDeployer {
    IRioLRTIssuer.LRTDeployment public deployment;
    address[] public tokens;

    uint256 public initialBalance;

    function setUp() public {
        deployRio();

        (deployment, tokens) = issueRestakedETH();

        // Approve the LRT to pull all underlying tokens.
        for (uint256 i = 0; i < tokens.length; i++) {
            IERC20(tokens[i]).approve(deployment.token, type(uint256).max);
        }
        initialBalance = IERC20(deployment.token).balanceOf(address(this));
    }

    function test_joinTokensExactInMinOutNotMetReverts() public {
        uint256[] memory amountsIn = new uint256[](2);
        amountsIn[0] = 5e18;
        amountsIn[1] = 0;

        vm.expectRevert('BAL#208'); // BPT_OUT_MIN_AMOUNT
        IRioLRT(deployment.token).joinTokensExactIn(
            IRioLRT.JoinTokensExactInParams({tokensIn: tokens, amountsIn: amountsIn, minAmountOut: 50e18})
        );
    }

    function test_joinTokensExactInSingleToken() public {
        uint256[] memory amountsIn = new uint256[](2);
        amountsIn[0] = 5e18;
        amountsIn[1] = 0;

        uint256 amountOut = IRioLRT(deployment.token).joinTokensExactIn(
            IRioLRT.JoinTokensExactInParams({tokensIn: tokens, amountsIn: amountsIn, minAmountOut: 5e18})
        );
        assertGt(amountOut, 0);
        assertEq(IERC20(deployment.token).balanceOf(address(this)) - initialBalance, amountOut);
    }

    function test_joinTokensExactInManyTokens() public {
        uint256[] memory amountsIn = new uint256[](2);
        amountsIn[0] = 5e18;
        amountsIn[1] = 10e18;

        uint256 amountOut = IRioLRT(deployment.token).joinTokensExactIn(
            IRioLRT.JoinTokensExactInParams({tokensIn: tokens, amountsIn: amountsIn, minAmountOut: 15e18})
        );
        assertGt(amountOut, 0);
        assertEq(IERC20(deployment.token).balanceOf(address(this)) - initialBalance, amountOut);
    }

    function test_joinTokenExactOutAboveMaxAmountInReverts() public {
        vm.expectRevert('BAL#506'); // JOIN_ABOVE_MAX
        IRioLRT(deployment.token).joinTokenExactOut(
            IRioLRT.JoinTokenExactOutParams({tokenIn: tokens[0], maxAmountIn: 1e18, amountOut: 5e18})
        );
    }

    function test_joinTokenExactOut() public {
        uint256 amountOut = IRioLRT(deployment.token).joinTokenExactOut(
            IRioLRT.JoinTokenExactOutParams({tokenIn: tokens[0], maxAmountIn: 5e18, amountOut: 5e18})
        );
        assertEq(amountOut, 5e18);
        assertEq(IERC20(deployment.token).balanceOf(address(this)) - initialBalance, amountOut);
    }

    function test_joinAllTokensExactOutAboveMaxAmountInReverts() public {
        uint256[] memory maxAmountsIn = new uint256[](2);
        maxAmountsIn[0] = 10e18;
        maxAmountsIn[1] = 20e18;

        vm.expectRevert('BAL#506'); // JOIN_ABOVE_MAX
        IRioLRT(deployment.token).joinAllTokensExactOut(
            IRioLRT.JoinAllTokensExactOutParams({tokensIn: tokens, maxAmountsIn: maxAmountsIn, amountOut: 50e18})
        );
    }

    function test_joinAllTokensExactOut() public {
        uint256[] memory maxAmountsIn = new uint256[](2);
        maxAmountsIn[0] = 10e18;
        maxAmountsIn[1] = 20e18;

        uint256 amountOut = IRioLRT(deployment.token).joinAllTokensExactOut(
            IRioLRT.JoinAllTokensExactOutParams({tokensIn: tokens, maxAmountsIn: maxAmountsIn, amountOut: 30e18})
        );
        assertGt(amountOut, 0);
        assertEq(IERC20(deployment.token).balanceOf(address(this)) - initialBalance, amountOut);
    }
}
