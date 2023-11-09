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
}
