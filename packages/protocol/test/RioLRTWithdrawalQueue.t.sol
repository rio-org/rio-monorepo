// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IRioLRTWithdrawalQueue} from 'contracts/interfaces/IRioLRTWithdrawalQueue.sol';
import {ETH_ADDRESS} from 'contracts/utils/Constants.sol';
import {RioDeployer} from 'test/utils/RioDeployer.sol';

contract RioLRTWithdrawalQueueTest is RioDeployer {
    TestLRTDeployment public reETH;
    TestLRTDeployment public reLST;

    function setUp() public {
        deployRio();

        (reETH,) = issueRestakedETH();
        (reLST,) = issueRestakedLST();
    }

    function test_withdrawEtherPaidFromDepositPool() public {
        reETH.coordinator.depositETH{value: 1 ether}();
        reETH.coordinator.requestWithdrawal(ETH_ADDRESS, 1 ether);

        uint256 withdrawalEpoch = reETH.withdrawalQueue.getCurrentEpoch(ETH_ADDRESS);

        // Rebalance to settle the withdrawal.
        reETH.coordinator.rebalance(ETH_ADDRESS);

        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reETH.withdrawalQueue.getEpochWithdrawalSummary(ETH_ADDRESS, withdrawalEpoch);
        IRioLRTWithdrawalQueue.UserWithdrawalSummary memory userSummary =
            reETH.withdrawalQueue.getUserWithdrawalSummary(ETH_ADDRESS, withdrawalEpoch, address(this));

        // Ensure the reETH was burned.
        assertEq(reETH.token.totalSupply(), 0);

        assertTrue(epochSummary.settled);
        assertEq(epochSummary.assetsReceived, 1 ether);
        assertEq(epochSummary.shareValueOfAssetsReceived, 1 ether);

        assertFalse(userSummary.claimed);

        uint256 balanceBefore = address(this).balance;

        // Claim the withdrawal.
        uint256 amountOut = reETH.withdrawalQueue.claimWithdrawalsForEpoch(
            IRioLRTWithdrawalQueue.ClaimRequest({asset: ETH_ADDRESS, epoch: withdrawalEpoch})
        );

        assertEq(amountOut, 1 ether);
        assertEq(address(this).balance - balanceBefore, 1 ether);
    }

    receive() external payable {}
}
