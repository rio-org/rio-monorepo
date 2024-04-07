// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {IRioLRT} from 'contracts/interfaces/IRioLRT.sol';
import {RioDeployer} from 'test/utils/RioDeployer.sol';
import {RioLRT} from 'contracts/restaking/RioLRT.sol';

contract RioLRTTest is RioDeployer {
    TestLRTDeployment public reETH;
    RioLRT public token;

    function setUp() public {
        deployRio();

        (reETH,) = issueRestakedETH();
        token = RioLRT(address(reETH.token));
    }

    function test_mintNonCoordinatorReverts() public {
        vm.prank(address(42));
        vm.expectRevert(abi.encodeWithSelector(IRioLRT.ONLY_COORDINATOR.selector));
        token.mint(address(42), 1e18);
    }

    function test_mint() public {
        uint256 initialSupply = token.totalSupply();

        vm.prank(address(reETH.coordinator));
        token.mint(address(42), 1e18);
        assertEq(token.totalSupply(), initialSupply + 1e18);
        assertEq(token.balanceOf(address(42)), 1e18);
    }

    function test_burnNonWithdrawalQueueReverts() public {
        vm.prank(address(42));
        vm.expectRevert(abi.encodeWithSelector(IRioLRT.ONLY_WITHDRAWAL_QUEUE.selector));
        token.burn(1e18);
    }

    function test_burn() public {
        uint256 initialSupply = token.totalSupply();

        vm.prank(address(reETH.coordinator));
        token.mint(address(reETH.withdrawalQueue), 1e18);

        vm.prank(address(reETH.withdrawalQueue));
        token.burn(1e18);

        assertEq(token.totalSupply(), initialSupply);
        assertEq(token.balanceOf(address(42)), 0);
    }

    function test_coordinatorAllowanceIsMaxUint() public {
        assertEq(token.allowance(address(42), address(reETH.coordinator)), type(uint256).max);
    }

    function test_nonCoordinatorHasZeroAllowance() public {
        assertEq(token.allowance(address(42), address(1)), 0);
    }
}
