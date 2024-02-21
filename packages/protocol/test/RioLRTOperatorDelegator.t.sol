// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {RioDeployer} from 'test/utils/RioDeployer.sol';
import {IDelegationManager} from 'contracts/interfaces/eigenlayer/IDelegationManager.sol';
import {RioLRTOperatorDelegator} from 'contracts/restaking/RioLRTOperatorDelegator.sol';
import {BEACON_CHAIN_STRATEGY, ETH_ADDRESS} from 'contracts/utils/Constants.sol';
import {Array} from 'contracts/utils/Array.sol';

contract RioLRTOperatorDelegatorTest is RioDeployer {
    using Array for *;

    TestLRTDeployment public reETH;
    TestLRTDeployment public reLST;

    function setUp() public {
        deployRio();

        (reETH,) = issueRestakedETH();
        (reLST,) = issueRestakedLST();
    }

    function test_scrapeNonBeaconChainETHFromEigenPod() public {
        uint8 operatorId = addOperatorDelegator(reETH.operatorRegistry, address(reETH.rewardDistributor));
        RioLRTOperatorDelegator delegatorContract =
            RioLRTOperatorDelegator(payable(reETH.operatorRegistry.getOperatorDetails(operatorId).delegator));

        (bool success,) = address(delegatorContract.eigenPod()).call{value: 1.123 ether}('');
        assertTrue(success);

        uint256 depositPoolBalanceBefore = address(reETH.depositPool).balance;

        delegatorContract.scrapeNonBeaconChainETHFromEigenPod();
        delayedWithdrawalRouter.claimDelayedWithdrawals(address(reETH.rewardDistributor), 1);

        // Account for reward split.
        assertGt(address(reETH.depositPool).balance - depositPoolBalanceBefore, 1 ether);
        assertEq(address(delegatorContract.eigenPod()).balance, 0);
    }

    function test_scrapeExcessFullWithdrawalETHFromEigenPod() public {
        uint8 operatorId = addOperatorDelegator(reETH.operatorRegistry, address(reETH.rewardDistributor));
        address operatorDelegator = reETH.operatorRegistry.getOperatorDetails(operatorId).delegator;

        uint256 TVL = 64 ether;
        uint256 WITHDRAWAL_AMOUNT = 44 ether;

        // Allocate ETH.
        reETH.coordinator.depositETH{value: TVL - address(reETH.depositPool).balance}();

        // Push funds into EigenLayer.
        vm.prank(EOA, EOA);
        reETH.coordinator.rebalance(ETH_ADDRESS);

        // Verify validator withdrawal credentials.
        uint40[] memory validatorIndices = verifyCredentialsForValidators(reETH.operatorRegistry, operatorId, 2);

        // Withdraw some funds.
        reETH.coordinator.requestWithdrawal(ETH_ADDRESS, WITHDRAWAL_AMOUNT);

        uint256 withdrawalEpoch = reETH.withdrawalQueue.getCurrentEpoch(ETH_ADDRESS);

        // Skip ahead and rebalance to queue the withdrawal within EigenLayer.
        skip(reETH.coordinator.rebalanceDelay());

        vm.prank(EOA, EOA);
        reETH.coordinator.rebalance(ETH_ADDRESS);

        // Verify and process two full validator exits.
        verifyAndProcessWithdrawalsForValidatorIndexes(operatorDelegator, validatorIndices);

        // Settle with withdrawal epoch.
        IDelegationManager.Withdrawal[] memory withdrawals = new IDelegationManager.Withdrawal[](1);
        withdrawals[0] = IDelegationManager.Withdrawal({
            staker: operatorDelegator,
            delegatedTo: address(1),
            withdrawer: address(reETH.withdrawalQueue),
            nonce: 0,
            startBlock: 1,
            strategies: BEACON_CHAIN_STRATEGY.toArray(),
            shares: WITHDRAWAL_AMOUNT.toArray()
        });
        reETH.withdrawalQueue.settleEpochFromEigenLayer(ETH_ADDRESS, withdrawalEpoch, withdrawals, new uint256[](1));

        // At this time, there should be excess ETH in the EigenPod.
        RioLRTOperatorDelegator delegatorContract = RioLRTOperatorDelegator(payable(operatorDelegator));
        uint256 SCRAPE_AMOUNT = TVL - WITHDRAWAL_AMOUNT;

        assertEq(address(delegatorContract.eigenPod()).balance, SCRAPE_AMOUNT);
        assertEq(reETH.assetRegistry.getTVLForAsset(ETH_ADDRESS), SCRAPE_AMOUNT);
        assertEq(delegatorContract.getETHUnderManagement(), SCRAPE_AMOUNT);

        // Scrape the excess ETH to the deposit pool.
        delegatorContract.scrapeExcessFullWithdrawalETHFromEigenPod();

        // Ensure TVL stays the same.
        assertEq(reETH.assetRegistry.getTVLForAsset(ETH_ADDRESS), SCRAPE_AMOUNT);
        assertEq(delegatorContract.getETHUnderManagement(), SCRAPE_AMOUNT);

        // Claim the scraped funds.
        uint256 ethQueuedBefore = delegatorContract.getETHQueuedForWithdrawal();
        uint256 depositPoolBalanceBefore = address(reETH.depositPool).balance;
        reETH.depositPool.completeOperatorWithdrawalForAsset(
            ETH_ADDRESS,
            operatorId,
            IDelegationManager.Withdrawal({
                staker: operatorDelegator,
                delegatedTo: address(1),
                withdrawer: address(reETH.depositPool),
                nonce: 1,
                startBlock: 1,
                strategies: BEACON_CHAIN_STRATEGY.toArray(),
                shares: SCRAPE_AMOUNT.toArray()
            }),
            0
        );

        assertEq(reETH.assetRegistry.getTVLForAsset(ETH_ADDRESS), SCRAPE_AMOUNT);
        assertEq(delegatorContract.getETHUnderManagement(), 0);
        assertEq(delegatorContract.getETHQueuedForWithdrawal(), ethQueuedBefore - SCRAPE_AMOUNT);
        assertEq(address(reETH.depositPool).balance, depositPoolBalanceBefore + SCRAPE_AMOUNT);
    }
}
