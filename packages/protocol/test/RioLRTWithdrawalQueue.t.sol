// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {IRioLRTWithdrawalQueue} from 'contracts/interfaces/IRioLRTWithdrawalQueue.sol';
import {IRioLRTCoordinator} from 'contracts/interfaces/IRioLRTCoordinator.sol';
import {IRioLRTIssuer} from 'contracts/interfaces/IRioLRTIssuer.sol';
import {ETH_ADDRESS} from 'contracts/utils/Constants.sol';
import {RioDeployer} from 'test/utils/RioDeployer.sol';

contract RioLRTWithdrawalQueueTest is RioDeployer {
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

    function test_withdrawEtherPaidFromDepositPool() public {
        coordinator.depositETH{value: 1 ether}();
        coordinator.requestWithdrawal(ETH_ADDRESS, 1 ether);

        uint256 withdrawalEpoch = withdrawalQueue.getCurrentEpoch(ETH_ADDRESS);

        // Rebalance to settle the withdrawal.
        coordinator.rebalance(ETH_ADDRESS);

        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary = withdrawalQueue.getEpochWithdrawalSummary(
            ETH_ADDRESS, withdrawalEpoch
        );
        IRioLRTWithdrawalQueue.UserWithdrawalSummary memory userSummary = withdrawalQueue.getUserWithdrawalSummary(
            ETH_ADDRESS, withdrawalEpoch, address(this)
        );

        // Ensure the reETH was burned.
        assertEq(reETH.totalSupply(), 0);

        assertTrue(epochSummary.settled);
        assertEq(epochSummary.assetsReceived, 1 ether);
        assertEq(epochSummary.shareValueOfAssetsReceived, 1 ether);

        assertFalse(userSummary.claimed);

        uint256 balanceBefore = address(this).balance;

        // Claim the withdrawal.
        uint256 amountOut = withdrawalQueue.claimWithdrawalsForEpoch(
            IRioLRTWithdrawalQueue.ClaimRequest({
                asset: ETH_ADDRESS,
                epoch: withdrawalEpoch
            })
        );

        assertEq(amountOut, 1 ether);
        assertEq(address(this).balance - balanceBefore, 1 ether);
    }

    receive() external payable {}
}
