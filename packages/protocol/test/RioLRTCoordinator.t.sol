// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IRioLRTWithdrawalQueue} from 'contracts/interfaces/IRioLRTWithdrawalQueue.sol';
import {ETH_ADDRESS} from 'contracts/utils/Constants.sol';
import {RioDeployer} from 'test/utils/RioDeployer.sol';

contract RioLRTCoordinatorTest is RioDeployer {
    TestLRTDeployment public reETH;
    TestLRTDeployment public reLST;

    function setUp() public {
        deployRio();

        (reETH,) = issueRestakedETH();
        (reLST,) = issueRestakedLST();
    }

    function test_depositEtherViaNamedFunction() public {
        reETH.coordinator.depositETH{value: 1 ether}();

        // The initial exchange rate is 1:1.
        assertEq(reETH.token.balanceOf(address(this)), 1 ether);
    }

    function test_depositEtherViaReceiveFunction() public {
        (bool success,) = address(reETH.coordinator).call{value: 1 ether}('');
        assertTrue(success);

        // The initial exchange rate is 1:1.
        assertEq(reETH.token.balanceOf(address(this)), 1 ether);
    }

    function test_requestEtherWithdrawal() public {
        reETH.coordinator.depositETH{value: 1 ether}();

        reETH.coordinator.requestWithdrawal(ETH_ADDRESS, 1 ether);

        uint256 currentEpoch = reETH.withdrawalQueue.getCurrentEpoch(ETH_ADDRESS);
        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reETH.withdrawalQueue.getEpochWithdrawalSummary(ETH_ADDRESS, currentEpoch);
        IRioLRTWithdrawalQueue.UserWithdrawalSummary memory userSummary =
            reETH.withdrawalQueue.getUserWithdrawalSummary(ETH_ADDRESS, currentEpoch, address(this));

        assertEq(reETH.token.balanceOf(address(this)), 0);
        assertEq(reETH.withdrawalQueue.getSharesOwedInCurrentEpoch(ETH_ADDRESS), 1 ether);

        assertFalse(epochSummary.settled);
        assertEq(epochSummary.sharesOwed, 1 ether);
        assertEq(epochSummary.amountToBurnAtSettlement, 1 ether);

        assertFalse(userSummary.claimed);
        assertEq(userSummary.sharesOwed, 1 ether);
    }

    receive() external payable {}
}
