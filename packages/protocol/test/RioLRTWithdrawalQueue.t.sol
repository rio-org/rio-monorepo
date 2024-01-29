// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {BEACON_CHAIN_STRATEGY, ETH_ADDRESS, ETH_DEPOSIT_SIZE, GWEI_TO_WEI} from 'contracts/utils/Constants.sol';
import {IDelegationManager} from 'contracts/interfaces/eigenlayer/IDelegationManager.sol';
import {IRioLRTWithdrawalQueue} from 'contracts/interfaces/IRioLRTWithdrawalQueue.sol';
import {RioDeployer} from 'test/utils/RioDeployer.sol';
import {Array} from 'contracts/utils/Array.sol';

contract RioLRTWithdrawalQueueTest is RioDeployer {
    using Array for *;

    TestLRTDeployment public reETH;
    TestLRTDeployment public reLST;

    function setUp() public {
        deployRio();

        (reETH,) = issueRestakedETH();
        (reLST,) = issueRestakedLST();
    }

    function test_claimWithdrawalsForEpochAllEtherPaidFromDepositPool() public {
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

    function test_claimWithdrawalsForEpochSomeEtherPaidFromEigenLayer() public {
        uint8 operatorId = addOperatorDelegator(reETH.operatorRegistry, address(reETH.rewardDistributor));
        address operatorDelegator = reETH.operatorRegistry.getOperatorDetails(operatorId).delegator;

        // Deposit ETH, rebalance, verify the validator withdrawal credentials, and deposit again.
        reETH.coordinator.depositETH{value: ETH_DEPOSIT_SIZE}();
        reETH.coordinator.rebalance(ETH_ADDRESS);
        uint40[] memory validatorIndices = verifyCredentialsForValidators(reETH.operatorRegistry, 1, 1);
        reETH.coordinator.depositETH{value: ETH_DEPOSIT_SIZE}();

        // Request a withdrawal and rebalance.
        uint256 withdrawalAmount = ETH_DEPOSIT_SIZE + 1 ether;
        reETH.coordinator.requestWithdrawal(ETH_ADDRESS, withdrawalAmount);
        skip(reETH.coordinator.rebalanceDelay());
        reETH.coordinator.rebalance(ETH_ADDRESS);

        // Validate reETH total supply and process withdrawals.
        assertApproxEqAbs(reETH.token.totalSupply(), ETH_DEPOSIT_SIZE, 100);
        verifyAndProcessWithdrawalsForValidatorIndexes(operatorDelegator, validatorIndices);

        // Settle the withdrawal epoch.
        uint256 withdrawalEpoch = reETH.withdrawalQueue.getCurrentEpoch(ETH_ADDRESS);
        IDelegationManager.Withdrawal[] memory withdrawals = new IDelegationManager.Withdrawal[](1);
        withdrawals[0] = IDelegationManager.Withdrawal({
            staker: operatorDelegator,
            delegatedTo: address(1),
            withdrawer: address(reETH.withdrawalQueue),
            nonce: 0,
            startBlock: 1,
            strategies: BEACON_CHAIN_STRATEGY.toArray(),
            shares: uint256(1 ether).toArray()
        });
        reETH.withdrawalQueue.settleEpochFromEigenLayer(ETH_ADDRESS, withdrawalEpoch, withdrawals, new uint256[](1));

        // Assert epoch summary details.
        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reETH.withdrawalQueue.getEpochWithdrawalSummary(ETH_ADDRESS, withdrawalEpoch);
        assertTrue(epochSummary.settled);
        assertEq(epochSummary.assetsReceived, withdrawalAmount);
        assertEq(epochSummary.shareValueOfAssetsReceived, withdrawalAmount);

        // Claim and assert withdrawal.
        uint256 balanceBefore = address(this).balance;
        uint256 amountOut = reETH.withdrawalQueue.claimWithdrawalsForEpoch(
            IRioLRTWithdrawalQueue.ClaimRequest({asset: ETH_ADDRESS, epoch: withdrawalEpoch})
        );
        IRioLRTWithdrawalQueue.UserWithdrawalSummary memory userSummary =
            reETH.withdrawalQueue.getUserWithdrawalSummary(ETH_ADDRESS, withdrawalEpoch, address(this));

        assertTrue(userSummary.claimed);
        assertEq(amountOut, withdrawalAmount);
        assertEq(address(this).balance - balanceBefore, withdrawalAmount);
    }

    function test_claimWithdrawalsForEpochSomeEtherPaidFromEigenLayerPreciseDecimals() public {
        // This test is important as shares requested for withdrawal from EigenLayer MUST
        // be whole gwei amounts. This test ensures that precise payments from the deposit pool
        // in combination with EigenLayer are handled correctly.
        uint8 operatorId = addOperatorDelegator(reETH.operatorRegistry, address(reETH.rewardDistributor));
        address operatorDelegator = reETH.operatorRegistry.getOperatorDetails(operatorId).delegator;

        uint256 amountInDP = ETH_DEPOSIT_SIZE + (10 ** 17 - 1);

        // Deposit ETH, rebalance, verify the validator withdrawal credentials, and deposit again.
        reETH.coordinator.depositETH{value: ETH_DEPOSIT_SIZE}();
        reETH.coordinator.rebalance(ETH_ADDRESS);
        uint40[] memory validatorIndices = verifyCredentialsForValidators(reETH.operatorRegistry, 1, 1);
        reETH.coordinator.depositETH{value: amountInDP}();

        // Request a withdrawal and rebalance.
        uint256 withdrawalAmount = ETH_DEPOSIT_SIZE + 10 ** 18 * 2 - 1;
        uint256 expectedAmountOut = reETH.coordinator.requestWithdrawal(ETH_ADDRESS, withdrawalAmount);
        skip(reETH.coordinator.rebalanceDelay());
        reETH.coordinator.rebalance(ETH_ADDRESS);

        uint256 expectedShareWithdrawal = expectedAmountOut - (amountInDP - (amountInDP % GWEI_TO_WEI));

        // Validate reETH total supply and process withdrawals.
        assertApproxEqAbs(reETH.token.totalSupply(), ETH_DEPOSIT_SIZE, GWEI_TO_WEI);
        verifyAndProcessWithdrawalsForValidatorIndexes(operatorDelegator, validatorIndices);

        // Settle the withdrawal epoch.
        uint256 withdrawalEpoch = reETH.withdrawalQueue.getCurrentEpoch(ETH_ADDRESS);
        IDelegationManager.Withdrawal[] memory withdrawals = new IDelegationManager.Withdrawal[](1);
        withdrawals[0] = IDelegationManager.Withdrawal({
            staker: operatorDelegator,
            delegatedTo: address(1),
            withdrawer: address(reETH.withdrawalQueue),
            nonce: 0,
            startBlock: 1,
            strategies: BEACON_CHAIN_STRATEGY.toArray(),
            shares: expectedShareWithdrawal.toArray()
        });
        reETH.withdrawalQueue.settleEpochFromEigenLayer(ETH_ADDRESS, withdrawalEpoch, withdrawals, new uint256[](1));

        // Assert epoch summary details.
        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reETH.withdrawalQueue.getEpochWithdrawalSummary(ETH_ADDRESS, withdrawalEpoch);
        assertTrue(epochSummary.settled);
        assertEq(epochSummary.assetsReceived, expectedAmountOut);
        assertEq(epochSummary.shareValueOfAssetsReceived, expectedAmountOut);

        // Claim and assert withdrawal.
        uint256 balanceBefore = address(this).balance;
        uint256 amountOut = reETH.withdrawalQueue.claimWithdrawalsForEpoch(
            IRioLRTWithdrawalQueue.ClaimRequest({asset: ETH_ADDRESS, epoch: withdrawalEpoch})
        );
        IRioLRTWithdrawalQueue.UserWithdrawalSummary memory userSummary =
            reETH.withdrawalQueue.getUserWithdrawalSummary(ETH_ADDRESS, withdrawalEpoch, address(this));

        assertTrue(userSummary.claimed);
        assertEq(amountOut, expectedAmountOut);
        assertEq(address(this).balance - balanceBefore, expectedAmountOut);
    }

    function test_claimWithdrawalsForEpochAllEtherPaidFromEigenLayer() public {
        uint8 operatorId = addOperatorDelegator(reETH.operatorRegistry, address(reETH.rewardDistributor));
        address operatorDelegator = reETH.operatorRegistry.getOperatorDetails(operatorId).delegator;

        // Deposit ETH, rebalance, and verify the validator withdrawal credentials.
        reETH.coordinator.depositETH{value: ETH_DEPOSIT_SIZE}();
        reETH.coordinator.rebalance(ETH_ADDRESS);
        uint40[] memory validatorIndices = verifyCredentialsForValidators(reETH.operatorRegistry, 1, 1);

        // Request a withdrawal and rebalance.
        uint256 withdrawalAmount = 16 ether;
        reETH.coordinator.requestWithdrawal(ETH_ADDRESS, withdrawalAmount);
        skip(reETH.coordinator.rebalanceDelay());
        reETH.coordinator.rebalance(ETH_ADDRESS);

        // Ensure no reETH has been burned yet and process withdrawals.
        assertEq(reETH.token.totalSupply(), ETH_DEPOSIT_SIZE);
        verifyAndProcessWithdrawalsForValidatorIndexes(operatorDelegator, validatorIndices);

        // Settle the withdrawal epoch.
        uint256 withdrawalEpoch = reETH.withdrawalQueue.getCurrentEpoch(ETH_ADDRESS);
        IDelegationManager.Withdrawal[] memory withdrawals = new IDelegationManager.Withdrawal[](1);
        withdrawals[0] = IDelegationManager.Withdrawal({
            staker: operatorDelegator,
            delegatedTo: address(1),
            withdrawer: address(reETH.withdrawalQueue),
            nonce: 0,
            startBlock: 1,
            strategies: BEACON_CHAIN_STRATEGY.toArray(),
            shares: withdrawalAmount.toArray()
        });
        reETH.withdrawalQueue.settleEpochFromEigenLayer(ETH_ADDRESS, withdrawalEpoch, withdrawals, new uint256[](1));

        // Assert epoch summary details.
        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reETH.withdrawalQueue.getEpochWithdrawalSummary(ETH_ADDRESS, withdrawalEpoch);
        assertTrue(epochSummary.settled);
        assertEq(epochSummary.assetsReceived, withdrawalAmount);
        assertEq(epochSummary.shareValueOfAssetsReceived, withdrawalAmount);

        // Claim and assert withdrawal.
        uint256 balanceBefore = address(this).balance;
        uint256 amountOut = reETH.withdrawalQueue.claimWithdrawalsForEpoch(
            IRioLRTWithdrawalQueue.ClaimRequest({asset: ETH_ADDRESS, epoch: withdrawalEpoch})
        );
        IRioLRTWithdrawalQueue.UserWithdrawalSummary memory userSummary =
            reETH.withdrawalQueue.getUserWithdrawalSummary(ETH_ADDRESS, withdrawalEpoch, address(this));

        assertTrue(userSummary.claimed);
        assertEq(amountOut, withdrawalAmount);
        assertEq(address(this).balance - balanceBefore, withdrawalAmount);
    }

    function test_claimWithdrawalsForEpochAllEtherPaidFromEigenLayerPreciseDecimals() public {
        // This test is important as shares requested for withdrawal from EigenLayer MUST
        // be whole gwei amounts.
        uint8 operatorId = addOperatorDelegator(reETH.operatorRegistry, address(reETH.rewardDistributor));
        address operatorDelegator = reETH.operatorRegistry.getOperatorDetails(operatorId).delegator;

        // Deposit ETH, rebalance, and verify the validator withdrawal credentials.
        reETH.coordinator.depositETH{value: ETH_DEPOSIT_SIZE}();
        reETH.coordinator.rebalance(ETH_ADDRESS);
        uint40[] memory validatorIndices = verifyCredentialsForValidators(reETH.operatorRegistry, 1, 1);

        // Request a withdrawal for an amount with very precise decimals and rebalance.
        uint256 withdrawalAmount = 10 ** 18 - 1;
        uint256 expectedAmountOut = reETH.coordinator.requestWithdrawal(ETH_ADDRESS, withdrawalAmount);
        skip(reETH.coordinator.rebalanceDelay());
        reETH.coordinator.rebalance(ETH_ADDRESS);

        // Ensure no reETH has been burned yet and process withdrawals.
        assertEq(reETH.token.totalSupply(), ETH_DEPOSIT_SIZE);
        verifyAndProcessWithdrawalsForValidatorIndexes(operatorDelegator, validatorIndices);

        // Settle the withdrawal epoch.
        uint256 withdrawalEpoch = reETH.withdrawalQueue.getCurrentEpoch(ETH_ADDRESS);
        IDelegationManager.Withdrawal[] memory withdrawals = new IDelegationManager.Withdrawal[](1);
        withdrawals[0] = IDelegationManager.Withdrawal({
            staker: operatorDelegator,
            delegatedTo: address(1),
            withdrawer: address(reETH.withdrawalQueue),
            nonce: 0,
            startBlock: 1,
            strategies: BEACON_CHAIN_STRATEGY.toArray(),
            shares: expectedAmountOut.toArray()
        });
        reETH.withdrawalQueue.settleEpochFromEigenLayer(ETH_ADDRESS, withdrawalEpoch, withdrawals, new uint256[](1));

        // Assert epoch summary details.
        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reETH.withdrawalQueue.getEpochWithdrawalSummary(ETH_ADDRESS, withdrawalEpoch);
        assertTrue(epochSummary.settled);
        assertEq(epochSummary.assetsReceived, expectedAmountOut);
        assertEq(epochSummary.shareValueOfAssetsReceived, expectedAmountOut);

        // Claim and assert withdrawal.
        uint256 balanceBefore = address(this).balance;
        uint256 amountOut = reETH.withdrawalQueue.claimWithdrawalsForEpoch(
            IRioLRTWithdrawalQueue.ClaimRequest({asset: ETH_ADDRESS, epoch: withdrawalEpoch})
        );
        IRioLRTWithdrawalQueue.UserWithdrawalSummary memory userSummary =
            reETH.withdrawalQueue.getUserWithdrawalSummary(ETH_ADDRESS, withdrawalEpoch, address(this));

        assertTrue(userSummary.claimed);
        assertEq(amountOut, expectedAmountOut);
        assertEq(address(this).balance - balanceBefore, expectedAmountOut);
    }

    function test_claimWithdrawalsForEpochAllERC20sPaidFromDepositPool() public {
        uint256 amount = 55e18;

        cbETH.approve(address(reLST.coordinator), type(uint256).max);
        uint256 amountOut = reLST.coordinator.deposit(CBETH_ADDRESS, amount);

        reLST.coordinator.requestWithdrawal(CBETH_ADDRESS, amountOut);

        uint256 withdrawalEpoch = reLST.withdrawalQueue.getCurrentEpoch(CBETH_ADDRESS);

        // Rebalance to settle the withdrawal.
        reLST.coordinator.rebalance(CBETH_ADDRESS);

        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reLST.withdrawalQueue.getEpochWithdrawalSummary(CBETH_ADDRESS, withdrawalEpoch);
        IRioLRTWithdrawalQueue.UserWithdrawalSummary memory userSummary =
            reLST.withdrawalQueue.getUserWithdrawalSummary(CBETH_ADDRESS, withdrawalEpoch, address(this));

        // Ensure the reLST was burned.
        assertEq(reLST.token.totalSupply(), 0);

        assertTrue(epochSummary.settled);
        assertEq(epochSummary.assetsReceived, amount);
        assertEq(epochSummary.shareValueOfAssetsReceived, amount);

        assertFalse(userSummary.claimed);

        uint256 balanceBefore = cbETH.balanceOf(address(this));

        // Claim the withdrawal.
        uint256 amountClaimed = reLST.withdrawalQueue.claimWithdrawalsForEpoch(
            IRioLRTWithdrawalQueue.ClaimRequest({asset: CBETH_ADDRESS, epoch: withdrawalEpoch})
        );

        assertEq(amountClaimed, amount);
        assertEq(cbETH.balanceOf(address(this)) - balanceBefore, amount);
    }

    function test_claimWithdrawalsForEpochSomeERC20sPaidFromEigenLayer() public {
        uint8 operatorId = addOperatorDelegator(reLST.operatorRegistry, address(reLST.rewardDistributor));
        address operatorDelegator = reLST.operatorRegistry.getOperatorDetails(operatorId).delegator;

        uint256 amount = 18e18;
        uint256 expectedTokensOut = amount * 2; // Two deposits of `amount`.

        // Deposit cbETH, rebalance, and deposit again to create a balance in EigenLayer
        // and the deposit pool.
        cbETH.approve(address(reLST.coordinator), type(uint256).max);
        uint256 restakingTokensInEL = reLST.coordinator.deposit(CBETH_ADDRESS, amount);
        reLST.coordinator.rebalance(CBETH_ADDRESS);
        uint256 restakingTokensInDP = reLST.coordinator.deposit(CBETH_ADDRESS, amount);

        // Request a withdrawal for an amount greater than the deposit pool balance and rebalance.
        uint256 withdrawalLRTAmount = restakingTokensInDP + restakingTokensInEL;
        reLST.coordinator.requestWithdrawal(CBETH_ADDRESS, withdrawalLRTAmount);
        skip(reLST.coordinator.rebalanceDelay());
        reLST.coordinator.rebalance(CBETH_ADDRESS);

        // Validate that the deposit pool balance has been removed from the reLST total supply.
        assertApproxEqAbs(reLST.token.totalSupply(), restakingTokensInEL, 100);

        // Settle the withdrawal epoch.
        uint256 withdrawalEpoch = reLST.withdrawalQueue.getCurrentEpoch(CBETH_ADDRESS);
        IDelegationManager.Withdrawal[] memory withdrawals = new IDelegationManager.Withdrawal[](1);
        withdrawals[0] = IDelegationManager.Withdrawal({
            staker: operatorDelegator,
            delegatedTo: address(1),
            withdrawer: address(reLST.withdrawalQueue),
            nonce: 0,
            startBlock: 1,
            strategies: CBETH_STRATEGY.toArray(),
            shares: amount.toArray()
        });
        reLST.withdrawalQueue.settleEpochFromEigenLayer(CBETH_ADDRESS, withdrawalEpoch, withdrawals, new uint256[](1));

        // Assert epoch summary details.
        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reLST.withdrawalQueue.getEpochWithdrawalSummary(CBETH_ADDRESS, withdrawalEpoch);
        assertTrue(epochSummary.settled);
        assertEq(epochSummary.assetsReceived, expectedTokensOut);
        assertEq(epochSummary.shareValueOfAssetsReceived, expectedTokensOut); // Share value is 1:1 initially.

        // Claim and assert withdrawal.
        uint256 balanceBefore = cbETH.balanceOf(address(this));
        uint256 cbETHWithdrawn = reLST.withdrawalQueue.claimWithdrawalsForEpoch(
            IRioLRTWithdrawalQueue.ClaimRequest({asset: CBETH_ADDRESS, epoch: withdrawalEpoch})
        );
        IRioLRTWithdrawalQueue.UserWithdrawalSummary memory userSummary =
            reLST.withdrawalQueue.getUserWithdrawalSummary(CBETH_ADDRESS, withdrawalEpoch, address(this));

        assertTrue(userSummary.claimed);
        assertEq(cbETHWithdrawn, expectedTokensOut);
        assertEq(cbETH.balanceOf(address(this)) - balanceBefore, expectedTokensOut);
    }

    function test_claimWithdrawalsForEpochAllERC20sPaidFromEigenLayer() public {
        uint8 operatorId = addOperatorDelegator(reLST.operatorRegistry, address(reLST.rewardDistributor));
        address operatorDelegator = reLST.operatorRegistry.getOperatorDetails(operatorId).delegator;

        uint256 amount = 8e18;

        // Deposit cbETH and rebalance to move all tokens to EigenLayer.
        cbETH.approve(address(reLST.coordinator), type(uint256).max);
        uint256 restakingTokensOut = reLST.coordinator.deposit(CBETH_ADDRESS, amount);
        reLST.coordinator.rebalance(CBETH_ADDRESS);

        // Request a withdrawal for the tokens from EigenLayer and rebalance.
        reLST.coordinator.requestWithdrawal(CBETH_ADDRESS, restakingTokensOut);
        skip(reLST.coordinator.rebalanceDelay());
        reLST.coordinator.rebalance(CBETH_ADDRESS);

        // Ensure no reLST has been burned yet.
        assertEq(reLST.token.totalSupply(), restakingTokensOut);

        // Settle the withdrawal epoch.
        uint256 withdrawalEpoch = reLST.withdrawalQueue.getCurrentEpoch(CBETH_ADDRESS);
        IDelegationManager.Withdrawal[] memory withdrawals = new IDelegationManager.Withdrawal[](1);
        withdrawals[0] = IDelegationManager.Withdrawal({
            staker: operatorDelegator,
            delegatedTo: address(1),
            withdrawer: address(reLST.withdrawalQueue),
            nonce: 0,
            startBlock: 1,
            strategies: CBETH_STRATEGY.toArray(),
            shares: amount.toArray()
        });
        reLST.withdrawalQueue.settleEpochFromEigenLayer(CBETH_ADDRESS, withdrawalEpoch, withdrawals, new uint256[](1));

        // Assert epoch summary details.
        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reLST.withdrawalQueue.getEpochWithdrawalSummary(CBETH_ADDRESS, withdrawalEpoch);
        assertTrue(epochSummary.settled);
        assertEq(epochSummary.assetsReceived, amount);
        assertEq(epochSummary.shareValueOfAssetsReceived, amount); // Share value is 1:1 initially.

        // Claim and assert withdrawal.
        uint256 balanceBefore = cbETH.balanceOf(address(this));
        uint256 cbETHWithdrawn = reLST.withdrawalQueue.claimWithdrawalsForEpoch(
            IRioLRTWithdrawalQueue.ClaimRequest({asset: CBETH_ADDRESS, epoch: withdrawalEpoch})
        );
        IRioLRTWithdrawalQueue.UserWithdrawalSummary memory userSummary =
            reLST.withdrawalQueue.getUserWithdrawalSummary(CBETH_ADDRESS, withdrawalEpoch, address(this));

        assertTrue(userSummary.claimed);
        assertEq(cbETHWithdrawn, amount);
        assertEq(cbETH.balanceOf(address(this)) - balanceBefore, amount);
    }

    receive() external payable {}
}
