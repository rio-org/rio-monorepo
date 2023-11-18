// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {IRioLRTIssuer} from 'contracts/interfaces/IRioLRTIssuer.sol';
import {RioDeployer} from 'test/utils/RioDeployer.sol';
import {MockERC20} from 'test/utils/MockERC20.sol';

contract RioLRTIssuerTest is RioDeployer {
    function setUp() public {
        deployRio();
    }

    function test_issuesLRTWithValidParams() public {
        address tokenA = address(new MockERC20('Token A', 'A'));
        address tokenB = address(new MockERC20('Token B', 'B'));

        address[] memory tokens = new address[](2);
        tokens[0] = tokenA < tokenB ? tokenA : tokenB;
        tokens[1] = tokenA < tokenB ? tokenB : tokenA;

        uint256[] memory amountsIn = new uint256[](2);
        amountsIn[0] = 100e18;
        amountsIn[1] = 101e18;

        uint256[] memory normalizedWeights = new uint256[](2);
        normalizedWeights[0] = 0.3e18;
        normalizedWeights[1] = 0.7e18;

        // Allow the issuer to pull the tokens.
        IERC20(tokens[0]).approve(address(issuer), amountsIn[0]);
        IERC20(tokens[1]).approve(address(issuer), amountsIn[1]);

        IRioLRTIssuer.LRTDeployment memory deployment = issuer.issueLRT(
            'Restaked Ether',
            'reETH',
            IRioLRTIssuer.LRTConfig({
                tokens: tokens,
                amountsIn: amountsIn,
                normalizedWeights: normalizedWeights,
                swapFeePercentage: MIN_SWAP_FEE,
                managementAumFeePercentage: 0,
                swapEnabledOnStart: true,
                securityCouncil: SECURITY_COUNCIL
            })
        );
        assertNotEq(deployment.token, address(0));
        assertNotEq(deployment.assetManager, address(0));
        assertNotEq(deployment.controller, address(0));
        assertNotEq(deployment.rewardDistributor, address(0));
        assertNotEq(deployment.operatorRegistry, address(0));
        assertNotEq(deployment.withdrawalQueue, address(0));

        assertGt(IERC20(deployment.token).balanceOf(address(this)), 0);
    }
}
