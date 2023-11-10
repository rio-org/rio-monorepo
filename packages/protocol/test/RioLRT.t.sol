// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {IRioLRTWithdrawalQueue} from 'contracts/interfaces/IRioLRTWithdrawalQueue.sol';
import {IRioLRTIssuer} from 'contracts/interfaces/IRioLRTIssuer.sol';
import {IRioLRT} from 'contracts/interfaces/IRioLRT.sol';
import {RioDeployer} from 'test/utils/RioDeployer.sol';

contract RioLRTIssuerTest is RioDeployer {
    IRioLRTIssuer.LRTDeployment public deployment;
    IRioLRTWithdrawalQueue public withdrawalQueue;
    IRioLRT public reETH;

    address[] public tokens;
    uint256 public startingBalance;

    function setUp() public {
        deployRio();

        (deployment, tokens) = issueRestakedETH();

        withdrawalQueue = IRioLRTWithdrawalQueue(deployment.withdrawalQueue);
        reETH = IRioLRT(deployment.token);

        // Approve the LRT to pull all underlying tokens and transfer 1 wei of each token to the LRT
        // to reduce gas costs for 'exact out' join functions (we'll use this strategy on mainnet).
        for (uint256 i = 0; i < tokens.length; i++) {
            IERC20(tokens[i]).approve(deployment.token, type(uint256).max);
            IERC20(tokens[i]).transfer(deployment.token, 1);
        }
        startingBalance = IERC20(deployment.token).balanceOf(address(this));
    }

    function test_joinTokensExactInMinOutNotMetReverts() public {
        uint256[] memory amountsIn = new uint256[](2);
        amountsIn[0] = 5e18;
        amountsIn[1] = 0;

        vm.expectRevert('BAL#208'); // BPT_OUT_MIN_AMOUNT
        reETH.joinTokensExactIn(
            IRioLRT.JoinTokensExactInParams({tokensIn: tokens, amountsIn: amountsIn, minAmountOut: 50e18})
        );
    }

    function test_joinTokensExactInSingleToken() public {
        uint256[] memory amountsIn = new uint256[](2);
        amountsIn[0] = 5e18;
        amountsIn[1] = 0;

        uint256 amountOut = reETH.joinTokensExactIn(
            IRioLRT.JoinTokensExactInParams({tokensIn: tokens, amountsIn: amountsIn, minAmountOut: 5e18})
        );
        assertGt(amountOut, 0);
        assertEq(IERC20(address(reETH)).balanceOf(address(this)) - startingBalance, amountOut);
    }

    function test_joinTokensExactInManyTokens() public {
        uint256[] memory amountsIn = new uint256[](2);
        amountsIn[0] = 5e18;
        amountsIn[1] = 10e18;

        uint256 amountOut = reETH.joinTokensExactIn(
            IRioLRT.JoinTokensExactInParams({tokensIn: tokens, amountsIn: amountsIn, minAmountOut: 15e18})
        );
        assertGt(amountOut, 0);
        assertEq(IERC20(address(reETH)).balanceOf(address(this)) - startingBalance, amountOut);
    }

    function test_joinTokenExactOutAboveMaxAmountInReverts() public {
        vm.expectRevert('BAL#506'); // JOIN_ABOVE_MAX
        reETH.joinTokenExactOut(
            IRioLRT.JoinTokenExactOutParams({tokenIn: tokens[0], maxAmountIn: 1e18, amountOut: 5e18})
        );
    }

    function test_joinTokenExactOut() public {
        uint256 amountOut = reETH.joinTokenExactOut(
            IRioLRT.JoinTokenExactOutParams({tokenIn: tokens[0], maxAmountIn: 5e18, amountOut: 5e18})
        );
        assertEq(amountOut, 5e18);
        assertEq(IERC20(address(reETH)).balanceOf(address(this)) - startingBalance, amountOut);
    }

    function test_joinAllTokensExactOutAboveMaxAmountInReverts() public {
        uint256[] memory maxAmountsIn = new uint256[](2);
        maxAmountsIn[0] = 10e18;
        maxAmountsIn[1] = 20e18;

        vm.expectRevert('BAL#506'); // JOIN_ABOVE_MAX
        reETH.joinAllTokensExactOut(
            IRioLRT.JoinAllTokensExactOutParams({tokensIn: tokens, maxAmountsIn: maxAmountsIn, amountOut: 50e18})
        );
    }

    function test_joinAllTokensExactOut() public {
        uint256[] memory maxAmountsIn = new uint256[](2);
        maxAmountsIn[0] = 10e18;
        maxAmountsIn[1] = 20e18;

        uint256 amountOut = reETH.joinAllTokensExactOut(
            IRioLRT.JoinAllTokensExactOutParams({tokensIn: tokens, maxAmountsIn: maxAmountsIn, amountOut: 30e18})
        );
        assertGt(amountOut, 0);
        assertEq(IERC20(address(reETH)).balanceOf(address(this)) - startingBalance, amountOut);
    }

    function test_queueExitTokenExactIn() public {
        uint256 amountIn = reETH.queueExitTokenExactIn(
            IRioLRT.QueueExitTokenExactInParams({tokenOut: tokens[0], minAmountOut: 4e18, amountIn: 5e18})
        );
        assertEq(amountIn, 5e18);
        assertEq(startingBalance - IERC20(address(reETH)).balanceOf(address(this)), 5e18);

        uint256 owedInEpoch = withdrawalQueue.getAmountOwedInCurrentEpoch(tokens[0]);
        assertEq(owedInEpoch, 4321906722946905952);

        uint256 currentEpoch = withdrawalQueue.getCurrentEpoch(tokens[0]);
        IRioLRTWithdrawalQueue.UserWithdrawal memory withdrawal = withdrawalQueue.getUserWithdrawal(
            tokens[0], currentEpoch, address(this)
        );
        assertEq(withdrawal.owed, 4321906722946905952);
        assertEq(withdrawal.claimed, false);
    }

    function test_queueExitAllTokensExactIn() public {
        uint256[] memory minAmountsOut = new uint256[](2);
        minAmountsOut[0] = 8e18;
        minAmountsOut[1] = 18e18;

        uint256 amountIn = reETH.queueExitAllTokensExactIn(
            IRioLRT.QueueExitAllTokensExactInParams({tokensOut: tokens, minAmountsOut: minAmountsOut, amountIn: 30e18})
        );
        assertEq(amountIn, 30e18);
        assertEq(startingBalance - IERC20(address(reETH)).balanceOf(address(this)), 30e18);

        uint256[] memory expectedAmountOwed = new uint256[](2);
        expectedAmountOwed[0] = 8207205224257497180;
        expectedAmountOwed[1] = 19423719030742743326;

        for (uint256 i = 0; i < tokens.length; ++i) {
            uint256 owedInEpoch = withdrawalQueue.getAmountOwedInCurrentEpoch(tokens[i]);
            assertEq(owedInEpoch, expectedAmountOwed[i]);

            uint256 currentEpoch = withdrawalQueue.getCurrentEpoch(tokens[i]);
            IRioLRTWithdrawalQueue.UserWithdrawal memory withdrawal = withdrawalQueue.getUserWithdrawal(
                tokens[i], currentEpoch, address(this)
            );
            assertEq(withdrawal.owed, expectedAmountOwed[i]);
            assertEq(withdrawal.claimed, false);
        }
    }
}
