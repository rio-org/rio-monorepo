// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {IRioLRTWithdrawalQueue} from 'contracts/interfaces/IRioLRTWithdrawalQueue.sol';
import {IRioLRTCoordinator} from 'contracts/interfaces/IRioLRTCoordinator.sol';
import {IRioLRTIssuer} from 'contracts/interfaces/IRioLRTIssuer.sol';
import {RioDeployer} from 'test/utils/RioDeployer.sol';

contract RioLRTCoordinatorTest is RioDeployer {
    IRioLRTIssuer.LRTDeployment public deployment;
    IRioLRTWithdrawalQueue public withdrawalQueue;
    IRioLRTCoordinator public coordinator;
    IERC20 public reETH;

    function setUp() public {
        deployRio();

        (deployment, ) = issueRestakedETH();

        withdrawalQueue = IRioLRTWithdrawalQueue(deployment.withdrawalQueue);
        coordinator = IRioLRTCoordinator(deployment.coordinator);
        reETH = IERC20(deployment.token);
    }

    function test_depositViaNamedFunction() public {
        coordinator.depositETH{value: 1 ether}();

        // The initial exchange rate is 1:1.
        assertEq(reETH.balanceOf(address(this)), 1 ether);
    }

      function test_depositViaReceiveFunction() public {
        (bool success,) = address(coordinator).call{value: 1 ether}('');
        assertTrue(success);

        // The initial exchange rate is 1:1.
        assertEq(reETH.balanceOf(address(this)), 1 ether);
    }

    receive() external payable {}
}
