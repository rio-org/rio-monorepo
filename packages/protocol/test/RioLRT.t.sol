// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {IRioLRTWithdrawalQueue} from 'contracts/interfaces/IRioLRTWithdrawalQueue.sol';
import {IRioLRTGateway} from 'contracts/interfaces/IRioLRTGateway.sol';
import {IRioLRTIssuer} from 'contracts/interfaces/IRioLRTIssuer.sol';
import {TokenWrapper} from 'contracts/wrapping/TokenWrapper.sol';
import {RioDeployer} from 'test/utils/RioDeployer.sol';

contract RioLRTIssuerTest is RioDeployer {
    IRioLRTIssuer.LRTDeployment public deployment;
    IRioLRTWithdrawalQueue public withdrawalQueue;
    IRioLRTGateway public gateway;
    IERC20 public reETH;

    address[] public tokens;
    uint256 public startingReETHBalance;

    function setUp() public {
        deployRio();

        (deployment, tokens) = issueRestakedETH();

        withdrawalQueue = IRioLRTWithdrawalQueue(deployment.withdrawalQueue);
        gateway = IRioLRTGateway(deployment.gateway);
        reETH = IERC20(deployment.token);

        // Approve the gateway to pull all underlying tokens.
        for (uint256 i = 0; i < tokens.length; i++) {
            IERC20(tokens[i]).approve(deployment.gateway, type(uint256).max);
        }
        stETH.approve(deployment.gateway, type(uint256).max);
        stETH.transfer(deployment.gateway, 1);

        startingReETHBalance = reETH.balanceOf(address(this));
    }

    function test_joinTokensExactInMinOutNotMetReverts() public {
        uint256[] memory amountsIn = new uint256[](3);
        amountsIn[0] = 5e18;
        amountsIn[1] = 0;
        amountsIn[2] = 0;

        vm.expectRevert('BAL#208'); // BPT_OUT_MIN_AMOUNT
        gateway.joinTokensExactIn(
            IRioLRTGateway.JoinTokensExactInParams({
                tokensIn: tokens,
                amountsIn: amountsIn,
                requiresWrap: new bool[](3),
                minAmountOut: 50e18
            })
        );
    }

    function test_joinTokensExactInSingleToken() public {
        uint256[] memory amountsIn = new uint256[](3);
        amountsIn[0] = 6e18;
        amountsIn[1] = 0;
        amountsIn[2] = 0;

        uint256 amountOut = gateway.joinTokensExactIn(
            IRioLRTGateway.JoinTokensExactInParams({
                tokensIn: tokens,
                amountsIn: amountsIn,
                requiresWrap: new bool[](3),
                minAmountOut: 5e18
            })
        );
        assertGt(amountOut, 0);
        assertEq(reETH.balanceOf(address(this)) - startingReETHBalance, amountOut);
    }

    function test_joinTokensExactInSingleTokenRequiresWrapZeroAmountReverts() public {
        // Use stETH as the join token, which requires wrapping.
        uint256[] memory amountsIn = new uint256[](3);
        bool[] memory requiresWrap = new bool[](3);
        for (uint256 i = 0; i < tokens.length; ++i) {
            if (tokens[i] == address(wstETH)) {
                (tokens[i], requiresWrap[i]) = (address(stETH), true);
                break;
            }
        }

        vm.expectRevert(abi.encodeWithSelector(TokenWrapper.CANNOT_WRAP_ZERO_AMOUNT.selector));
        gateway.joinTokensExactIn(
            IRioLRTGateway.JoinTokensExactInParams({
                tokensIn: tokens,
                amountsIn: amountsIn,
                requiresWrap: requiresWrap,
                minAmountOut: 5e18
            })
        );
    }

    function test_joinTokensExactInSingleTokenRequiresWrap() public {
        // Use stETH as a join token, which requires wrapping.
        uint256[] memory amountsIn = new uint256[](3);
        bool[] memory requiresWrap = new bool[](3);
        for (uint256 i = 0; i < tokens.length; ++i) {
            if (tokens[i] == address(wstETH)) {
                (tokens[i], amountsIn[i], requiresWrap[i]) = (address(stETH), 5e18, true);
                break;
            }
        }

        uint256 amountOut = gateway.joinTokensExactIn(
            IRioLRTGateway.JoinTokensExactInParams({
                tokensIn: tokens,
                amountsIn: amountsIn,
                requiresWrap: requiresWrap,
                minAmountOut: 5e18
            })
        );
        assertGt(amountOut, 0);
        assertEq(reETH.balanceOf(address(this)) - startingReETHBalance, amountOut);
    }

    function test_joinTokensExactInEther() public {
        uint256 AMOUNT_IN = 5 ether;

        // Use ETH as the join token, which is wrapped within Balancer.
        uint256[] memory amountsIn = new uint256[](3);
        for (uint256 i = 0; i < tokens.length; ++i) {
            if (tokens[i] == address(weth)) {
                (tokens[i], amountsIn[i]) = (address(0), AMOUNT_IN);
                break;
            }
        }

        uint256 amountOut = gateway.joinTokensExactIn{value: AMOUNT_IN}(
            IRioLRTGateway.JoinTokensExactInParams({
                tokensIn: tokens,
                amountsIn: amountsIn,
                requiresWrap: new bool[](3),
                minAmountOut: 4 ether
            })
        );
        assertGt(amountOut, 0);
        assertEq(reETH.balanceOf(address(this)) - startingReETHBalance, amountOut);
    }

    function test_joinTokensExactInManyTokens() public {
        uint256[] memory amountsIn = new uint256[](3);
        amountsIn[0] = 5e18;
        amountsIn[1] = 5e18;
        amountsIn[2] = 6e18;

        uint256 amountOut = gateway.joinTokensExactIn(
            IRioLRTGateway.JoinTokensExactInParams({
                tokensIn: tokens,
                amountsIn: amountsIn,
                requiresWrap: new bool[](3),
                minAmountOut: 15e18
            })
        );
        assertGt(amountOut, 0);
        assertEq(reETH.balanceOf(address(this)) - startingReETHBalance, amountOut);
    }

    function test_joinTokenExactOutAboveMaxAmountInReverts() public {
        vm.expectRevert('BAL#506'); // JOIN_ABOVE_MAX
        gateway.joinTokenExactOut(
            IRioLRTGateway.JoinTokenExactOutParams({
                tokenIn: tokens[0],
                maxAmountIn: 1e18,
                requiresWrap: false,
                amountOut: 5e18
            })
        );
    }

    function test_joinTokenExactOutRequiresWrapNotSetReverts() public {
        vm.expectRevert(abi.encodeWithSelector(IRioLRTGateway.INVALID_TOKEN.selector));
        gateway.joinTokenExactOut(
            IRioLRTGateway.JoinTokenExactOutParams({
                tokenIn: address(stETH),
                maxAmountIn: 6e18,
                requiresWrap: false, // stETH requires wrap, but we don't set it here.
                amountOut: 5e18
            })
        );
    }

    function test_joinTokenExactOut() public {
        uint256 amountOut = gateway.joinTokenExactOut(
            IRioLRTGateway.JoinTokenExactOutParams({
                tokenIn: tokens[0],
                maxAmountIn: 6e18,
                requiresWrap: false,
                amountOut: 5e18
            })
        );
        assertEq(amountOut, 5e18);
        assertEq(reETH.balanceOf(address(this)) - startingReETHBalance, amountOut);
    }

    function test_joinTokenExactOutEther() public {
        uint256 MAX_AMOUNT_IN = 5 ether;
        uint256 AMOUNT_OUT = 4 ether;

        uint256 amountOut = gateway.joinTokenExactOut{value: MAX_AMOUNT_IN}(
            IRioLRTGateway.JoinTokenExactOutParams({
                tokenIn: address(0),
                maxAmountIn: MAX_AMOUNT_IN,
                requiresWrap: false,
                amountOut: AMOUNT_OUT
            })
        );
        assertEq(amountOut, AMOUNT_OUT);
        assertEq(reETH.balanceOf(address(this)) - startingReETHBalance, amountOut);
    }

    function test_joinTokenExactOutRequiresWrap() public {
        uint256 MAX_AMOUNT_IN = 6e18;

        uint256 startingStETHBalance = stETH.balanceOf(address(this));
        uint256 amountOut = gateway.joinTokenExactOut(
            IRioLRTGateway.JoinTokenExactOutParams({
                tokenIn: address(stETH),
                maxAmountIn: MAX_AMOUNT_IN,
                requiresWrap: true,
                amountOut: 5e18
            })
        );
        assertEq(amountOut, 5e18);
        assertEq(reETH.balanceOf(address(this)) - startingReETHBalance, amountOut);
        assertLt(startingStETHBalance - stETH.balanceOf(address(this)), MAX_AMOUNT_IN);
    }

    function test_joinAllTokensExactOutAboveMaxAmountInReverts() public {
        uint256[] memory maxAmountsIn = new uint256[](3);
        maxAmountsIn[0] = 5e18;
        maxAmountsIn[1] = 5e18;
        maxAmountsIn[2] = 6e18;

        vm.expectRevert('BAL#506'); // JOIN_ABOVE_MAX
        gateway.joinAllTokensExactOut(
            IRioLRTGateway.JoinAllTokensExactOutParams({
                tokensIn: tokens,
                maxAmountsIn: maxAmountsIn,
                requiresWrap: new bool[](3),
                amountOut: 50e18
            })
        );
    }

    function test_joinAllTokensExactOut() public {
        uint256[] memory maxAmountsIn = new uint256[](3);
        maxAmountsIn[0] = 5e18;
        maxAmountsIn[1] = 5e18;
        maxAmountsIn[2] = 6e18;

        uint256 amountOut = gateway.joinAllTokensExactOut(
            IRioLRTGateway.JoinAllTokensExactOutParams({
                tokensIn: tokens,
                maxAmountsIn: maxAmountsIn,
                requiresWrap: new bool[](3),
                amountOut: 15e18
            })
        );
        assertGt(amountOut, 0);
        assertEq(reETH.balanceOf(address(this)) - startingReETHBalance, amountOut);
    }

    function test_joinAllTokensExactOutEther() public {
        uint256 MAX_AMOUNT_IN = 5 ether;

        uint256[] memory maxAmountsIn = new uint256[](3);
        maxAmountsIn[0] = MAX_AMOUNT_IN;
        maxAmountsIn[1] = MAX_AMOUNT_IN;
        maxAmountsIn[2] = MAX_AMOUNT_IN;

        // Use ETH as the join token, which is wrapped within Balancer.
        for (uint256 i = 0; i < tokens.length; ++i) {
            if (tokens[i] == address(weth)) {
                tokens[i] = address(0);
                break;
            }
        }

        uint256 amountOut = gateway.joinAllTokensExactOut{value: MAX_AMOUNT_IN}(
            IRioLRTGateway.JoinAllTokensExactOutParams({
                tokensIn: tokens,
                maxAmountsIn: maxAmountsIn,
                requiresWrap: new bool[](3),
                amountOut: 13e18
            })
        );
        assertGt(amountOut, 0);
        assertEq(reETH.balanceOf(address(this)) - startingReETHBalance, amountOut);
    }

    function test_joinAllTokensExactOutRequiresWrap() public {
        // Use stETH as a join token, which requires wrapping.
        bool[] memory requiresWrap = new bool[](3);
        for (uint256 i = 0; i < tokens.length; ++i) {
            if (tokens[i] == address(wstETH)) {
                (tokens[i], requiresWrap[i]) = (address(stETH), true);
                break;
            }
        }

        uint256[] memory maxAmountsIn = new uint256[](3);
        maxAmountsIn[0] = 6e18;
        maxAmountsIn[1] = 6e18;
        maxAmountsIn[2] = 6e18;

        uint256 amountOut = gateway.joinAllTokensExactOut(
            IRioLRTGateway.JoinAllTokensExactOutParams({
                tokensIn: tokens,
                maxAmountsIn: maxAmountsIn,
                requiresWrap: requiresWrap,
                amountOut: 15e18
            })
        );
        assertGt(amountOut, 0);
        assertEq(reETH.balanceOf(address(this)) - startingReETHBalance, amountOut);
    }

    function test_requestExitTokenExactInAllCash() public {
        uint256 MIN_AMOUNT_OUT = 4e18;
        uint256 AMOUNT_IN = 5e18;

        uint256 startingToken0Balance = IERC20(tokens[0]).balanceOf(address(this));
        uint256 amountIn = gateway.requestExitTokenExactIn(
            IRioLRTGateway.ExitTokenExactInParams({
                tokenOut: tokens[0],
                minAmountOut: MIN_AMOUNT_OUT,
                requiresUnwrap: false,
                amountIn: AMOUNT_IN
            })
        );
        assertEq(amountIn, AMOUNT_IN);
        assertEq(startingReETHBalance - reETH.balanceOf(address(this)), AMOUNT_IN);

        assertGt(IERC20(tokens[0]).balanceOf(address(this)) - startingToken0Balance, MIN_AMOUNT_OUT);

        uint256 sharesOwed = withdrawalQueue.getSharesOwedInCurrentEpoch(tokens[0]);
        assertEq(sharesOwed, 0);

        // forgefmt: disable-next-item
        IRioLRTWithdrawalQueue.UserWithdrawal memory withdrawal = withdrawalQueue.getUserWithdrawal(
            tokens[0], withdrawalQueue.getCurrentEpoch(tokens[0]), address(this)
        );
        assertEq(withdrawal.shares, 0);
    }

    function test_requestExitTokenExactInAllCashEther() public {
        uint256 MIN_AMOUNT_OUT = 4e18;
        uint256 AMOUNT_IN = 5e18;

        uint256 startingEtherBalance = address(this).balance;
        uint256 amountIn = gateway.requestExitTokenExactIn(
            IRioLRTGateway.ExitTokenExactInParams({
                tokenOut: address(0),
                minAmountOut: MIN_AMOUNT_OUT,
                requiresUnwrap: false,
                amountIn: AMOUNT_IN
            })
        );
        assertEq(amountIn, AMOUNT_IN);
        assertEq(startingReETHBalance - reETH.balanceOf(address(this)), AMOUNT_IN);

        assertGt(address(this).balance - startingEtherBalance, MIN_AMOUNT_OUT);

        uint256 sharesOwed = withdrawalQueue.getSharesOwedInCurrentEpoch(tokens[0]);
        assertEq(sharesOwed, 0);

        // forgefmt: disable-next-item
        IRioLRTWithdrawalQueue.UserWithdrawal memory withdrawal = withdrawalQueue.getUserWithdrawal(
            tokens[0], withdrawalQueue.getCurrentEpoch(tokens[0]), address(this)
        );
        assertEq(withdrawal.shares, 0);
    }

    function test_requestExitTokenExactInAllCashRequiresUnwrap() public {
        uint256 MIN_AMOUNT_OUT = 4e18;
        uint256 AMOUNT_IN = 5e18;

        uint256 startingStETHBalance = stETH.balanceOf(address(this));
        uint256 amountIn = gateway.requestExitTokenExactIn(
            IRioLRTGateway.ExitTokenExactInParams({
                tokenOut: address(stETH),
                minAmountOut: MIN_AMOUNT_OUT,
                requiresUnwrap: true,
                amountIn: AMOUNT_IN
            })
        );
        assertEq(amountIn, AMOUNT_IN);
        assertEq(startingReETHBalance - reETH.balanceOf(address(this)), AMOUNT_IN);

        assertGt(stETH.balanceOf(address(this)) - startingStETHBalance, MIN_AMOUNT_OUT);

        uint256 sharesOwed = withdrawalQueue.getSharesOwedInCurrentEpoch(tokens[0]);
        assertEq(sharesOwed, 0);

        // forgefmt: disable-next-item
        IRioLRTWithdrawalQueue.UserWithdrawal memory withdrawal = withdrawalQueue.getUserWithdrawal(
            tokens[0], withdrawalQueue.getCurrentEpoch(tokens[0]), address(this)
        );
        assertEq(withdrawal.shares, 0);
    }

    function test_requestExitAllTokensExactInAllCash() public {
        uint256 AMOUNT_IN = 18e18;
        uint256 MIN_AMOUNT_OUT_TOKEN_0 = 5e18;
        uint256 MIN_AMOUNT_OUT_TOKEN_1 = 4e18;
        uint256 MIN_AMOUNT_OUT_TOKEN_2 = 6e18;

        uint256 startingToken0Balance = IERC20(tokens[0]).balanceOf(address(this));
        uint256 startingToken1Balance = IERC20(tokens[1]).balanceOf(address(this));
        uint256 startingToken2Balance = IERC20(tokens[2]).balanceOf(address(this));

        uint256[] memory minAmountsOut = new uint256[](3);
        minAmountsOut[0] = MIN_AMOUNT_OUT_TOKEN_0;
        minAmountsOut[1] = MIN_AMOUNT_OUT_TOKEN_1;
        minAmountsOut[2] = MIN_AMOUNT_OUT_TOKEN_2;

        uint256 amountIn = gateway.requestExitAllTokensExactIn(
            IRioLRTGateway.ExitAllTokensExactInParams({
                tokensOut: tokens,
                minAmountsOut: minAmountsOut,
                requiresUnwrap: new bool[](3),
                amountIn: AMOUNT_IN
            })
        );
        assertEq(amountIn, AMOUNT_IN);
        assertEq(startingReETHBalance - reETH.balanceOf(address(this)), AMOUNT_IN);

        assertGt(IERC20(tokens[0]).balanceOf(address(this)) - startingToken0Balance, MIN_AMOUNT_OUT_TOKEN_0);
        assertGt(IERC20(tokens[1]).balanceOf(address(this)) - startingToken1Balance, MIN_AMOUNT_OUT_TOKEN_1);
        assertGt(IERC20(tokens[2]).balanceOf(address(this)) - startingToken2Balance, MIN_AMOUNT_OUT_TOKEN_2);

        // forgefmt: disable-next-item
        for (uint256 i = 0; i < tokens.length; ++i) {
            uint256 sharesOwed = withdrawalQueue.getSharesOwedInCurrentEpoch(tokens[i]);
            assertEq(sharesOwed, 0);

            IRioLRTWithdrawalQueue.UserWithdrawal memory withdrawal = withdrawalQueue.getUserWithdrawal(
                tokens[i], withdrawalQueue.getCurrentEpoch(tokens[i]), address(this)
            );
            assertEq(withdrawal.shares, 0);
        }
    }

    function test_requestExitAllTokensExactInAllCashEther() public {
        uint256 AMOUNT_IN = 18e18;
        uint256 MIN_AMOUNT_OUT_EACH = 5e18;

        uint256 startingEtherBalance = address(this).balance;

        // Include ETH as an exit token.
        uint256[] memory minAmountsOut = new uint256[](tokens.length);
        for (uint256 i = 0; i < tokens.length; ++i) {
            if (tokens[i] == address(weth)) tokens[i] = address(0);
            minAmountsOut[i] = MIN_AMOUNT_OUT_EACH;
        }

        uint256 amountIn = gateway.requestExitAllTokensExactIn(
            IRioLRTGateway.ExitAllTokensExactInParams({
                tokensOut: tokens,
                minAmountsOut: minAmountsOut,
                requiresUnwrap: new bool[](3),
                amountIn: AMOUNT_IN
            })
        );
        assertEq(amountIn, AMOUNT_IN);
        assertEq(startingReETHBalance - reETH.balanceOf(address(this)), AMOUNT_IN);

        assertGt(address(this).balance - startingEtherBalance, MIN_AMOUNT_OUT_EACH);

        // forgefmt: disable-next-item
        for (uint256 i = 0; i < tokens.length; ++i) {
            uint256 sharesOwed = withdrawalQueue.getSharesOwedInCurrentEpoch(tokens[i]);
            assertEq(sharesOwed, 0);

            IRioLRTWithdrawalQueue.UserWithdrawal memory withdrawal = withdrawalQueue.getUserWithdrawal(
                tokens[i], withdrawalQueue.getCurrentEpoch(tokens[i]), address(this)
            );
            assertEq(withdrawal.shares, 0);
        }
    }

    function test_requestExitAllTokensExactInAllCashRequiresUnwrap() public {
        uint256 AMOUNT_IN = 18e18;
        uint256 MIN_AMOUNT_OUT_EACH = 5e18;

        uint256 startingStETHBalance = stETH.balanceOf(address(this));

        // Include stETH as an exit token.
        uint256[] memory minAmountsOut = new uint256[](tokens.length);
        bool[] memory requiresUnwrap = new bool[](tokens.length);
        for (uint256 i = 0; i < tokens.length; ++i) {
            if (tokens[i] == address(wstETH)) (tokens[i], requiresUnwrap[i]) = (address(stETH), true);
            minAmountsOut[i] = MIN_AMOUNT_OUT_EACH;
        }

        uint256 amountIn = gateway.requestExitAllTokensExactIn(
            IRioLRTGateway.ExitAllTokensExactInParams({
                tokensOut: tokens,
                minAmountsOut: minAmountsOut,
                requiresUnwrap: requiresUnwrap,
                amountIn: AMOUNT_IN
            })
        );
        assertEq(amountIn, AMOUNT_IN);
        assertEq(startingReETHBalance - reETH.balanceOf(address(this)), AMOUNT_IN);

        assertGt(stETH.balanceOf(address(this)) - startingStETHBalance, MIN_AMOUNT_OUT_EACH);

        // forgefmt: disable-next-item
        for (uint256 i = 0; i < tokens.length; ++i) {
            uint256 sharesOwed = withdrawalQueue.getSharesOwedInCurrentEpoch(tokens[i]);
            assertEq(sharesOwed, 0);

            IRioLRTWithdrawalQueue.UserWithdrawal memory withdrawal = withdrawalQueue.getUserWithdrawal(
                tokens[i], withdrawalQueue.getCurrentEpoch(tokens[i]), address(this)
            );
            assertEq(withdrawal.shares, 0);
        }
    }

    function test_requestExitTokensExactOutAllCash() public {
        uint256 MAX_AMOUNT_IN = 18e18;
        uint256 AMOUNT_OUT_TOKEN_0 = 5e18;
        uint256 AMOUNT_OUT_TOKEN_1 = 4e18;
        uint256 AMOUNT_OUT_TOKEN_2 = 6e18;

        uint256 startingToken0Balance = IERC20(tokens[0]).balanceOf(address(this));
        uint256 startingToken1Balance = IERC20(tokens[1]).balanceOf(address(this));
        uint256 startingToken2Balance = IERC20(tokens[2]).balanceOf(address(this));

        uint256[] memory amountsOut = new uint256[](3);
        amountsOut[0] = AMOUNT_OUT_TOKEN_0;
        amountsOut[1] = AMOUNT_OUT_TOKEN_1;
        amountsOut[2] = AMOUNT_OUT_TOKEN_2;

        uint256 amountIn = gateway.requestExitTokensExactOut(
            IRioLRTGateway.ExitTokensExactOutParams({
                tokensOut: tokens,
                amountsOut: amountsOut,
                requiresUnwrap: new bool[](3),
                maxAmountIn: MAX_AMOUNT_IN
            })
        );

        assertLt(amountIn, MAX_AMOUNT_IN);
        assertEq(startingReETHBalance - reETH.balanceOf(address(this)), amountIn);

        assertEq(IERC20(tokens[0]).balanceOf(address(this)) - startingToken0Balance, AMOUNT_OUT_TOKEN_0);
        assertEq(IERC20(tokens[1]).balanceOf(address(this)) - startingToken1Balance, AMOUNT_OUT_TOKEN_1);
        assertEq(IERC20(tokens[2]).balanceOf(address(this)) - startingToken2Balance, AMOUNT_OUT_TOKEN_2);

        for (uint256 i = 0; i < tokens.length; ++i) {
            uint256 sharesOwed = withdrawalQueue.getSharesOwedInCurrentEpoch(tokens[i]);
            assertEq(sharesOwed, 0);

            IRioLRTWithdrawalQueue.UserWithdrawal memory withdrawal =
                withdrawalQueue.getUserWithdrawal(tokens[i], withdrawalQueue.getCurrentEpoch(tokens[i]), address(this));
            assertEq(withdrawal.shares, 0);
        }
    }

    function test_requestExitTokensExactOutAllCashEther() public {
        uint256 MAX_AMOUNT_IN = 18e18;
        uint256 AMOUNT_OUT_EACH = 5e18;

        uint256 startingEtherBalance = address(this).balance;

        // Include ETH as an exit token.
        uint256[] memory amountsOut = new uint256[](tokens.length);
        for (uint256 i = 0; i < tokens.length; ++i) {
            if (tokens[i] == address(weth)) tokens[i] = address(0);
            amountsOut[i] = AMOUNT_OUT_EACH;
        }

        uint256 amountIn = gateway.requestExitTokensExactOut(
            IRioLRTGateway.ExitTokensExactOutParams({
                tokensOut: tokens,
                amountsOut: amountsOut,
                requiresUnwrap: new bool[](3),
                maxAmountIn: MAX_AMOUNT_IN
            })
        );

        assertLt(amountIn, MAX_AMOUNT_IN);
        assertEq(startingReETHBalance - reETH.balanceOf(address(this)), amountIn);

        assertEq(address(this).balance - startingEtherBalance, AMOUNT_OUT_EACH);

        for (uint256 i = 0; i < tokens.length; ++i) {
            uint256 sharesOwed = withdrawalQueue.getSharesOwedInCurrentEpoch(tokens[i]);
            assertEq(sharesOwed, 0);

            IRioLRTWithdrawalQueue.UserWithdrawal memory withdrawal =
                withdrawalQueue.getUserWithdrawal(tokens[i], withdrawalQueue.getCurrentEpoch(tokens[i]), address(this));
            assertEq(withdrawal.shares, 0);
        }
    }

    function test_requestExitTokensExactOutAllCashRequiresUnwrap() public {
        uint256 MAX_AMOUNT_IN = 18e18;
        uint256 AMOUNT_OUT_EACH = 5e18;

        uint256 startingStETHBalance = stETH.balanceOf(address(this));

        // Include stETH as an exit token.
        uint256[] memory amountsOut = new uint256[](tokens.length);
        bool[] memory requiresUnwrap = new bool[](tokens.length);
        for (uint256 i = 0; i < tokens.length; ++i) {
            if (tokens[i] == address(wstETH)) (tokens[i], requiresUnwrap[i]) = (address(stETH), true);
            amountsOut[i] = AMOUNT_OUT_EACH;
        }

        uint256 amountIn = gateway.requestExitTokensExactOut(
            IRioLRTGateway.ExitTokensExactOutParams({
                tokensOut: tokens,
                amountsOut: amountsOut,
                requiresUnwrap: requiresUnwrap,
                maxAmountIn: MAX_AMOUNT_IN
            })
        );

        assertLt(amountIn, MAX_AMOUNT_IN);
        assertEq(startingReETHBalance - reETH.balanceOf(address(this)), amountIn);

        assertEq(stETH.balanceOf(address(this)) - startingStETHBalance, AMOUNT_OUT_EACH);

        for (uint256 i = 0; i < tokens.length; ++i) {
            uint256 sharesOwed = withdrawalQueue.getSharesOwedInCurrentEpoch(tokens[i]);
            assertEq(sharesOwed, 0);

            IRioLRTWithdrawalQueue.UserWithdrawal memory withdrawal =
                withdrawalQueue.getUserWithdrawal(tokens[i], withdrawalQueue.getCurrentEpoch(tokens[i]), address(this));
            assertEq(withdrawal.shares, 0);
        }
    }

    receive() external payable {}
}
