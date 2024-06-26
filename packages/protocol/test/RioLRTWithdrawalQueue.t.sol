// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {BEACON_CHAIN_STRATEGY, ETH_ADDRESS, ETH_DEPOSIT_SIZE, GWEI_TO_WEI} from 'contracts/utils/Constants.sol';
import {IDelegationManager} from 'contracts/interfaces/eigenlayer/IDelegationManager.sol';
import {IRioLRTWithdrawalQueue} from 'contracts/interfaces/IRioLRTWithdrawalQueue.sol';
import {RioDeployer} from 'test/utils/RioDeployer.sol';
import {Asset} from 'contracts/utils/Asset.sol';
import {Array} from 'contracts/utils/Array.sol';

contract RioLRTWithdrawalQueueTest is RioDeployer {
    using Asset for *;
    using Array for *;

    TestLRTDeployment public reETH;
    TestLRTDeployment public reLST;

    function setUp() public {
        deployRio();

        (reETH,) = issueRestakedETH();
        (reLST,) = issueRestakedLST();
    }

    function test_claimWithdrawalsForEpochAllEtherPaidFromDepositPool() public {
        uint256 initialTotalSupply = reETH.token.totalSupply();

        uint256 amountOut = reETH.coordinator.depositETH{value: 1 ether}();
        reETH.coordinator.requestWithdrawal(ETH_ADDRESS, amountOut);

        uint256 withdrawalEpoch = reETH.withdrawalQueue.getCurrentEpoch(ETH_ADDRESS);

        // Get the latest POS deposit root and guardian signature.
        (bytes32 root, bytes memory signature) = signCurrentDepositRoot(reETH.coordinator);

        // Rebalance to settle the withdrawal.
        vm.prank(EOA, EOA);
        reETH.coordinator.rebalanceETH(root, signature);

        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reETH.withdrawalQueue.getEpochWithdrawalSummary(ETH_ADDRESS, withdrawalEpoch);
        IRioLRTWithdrawalQueue.UserWithdrawalSummary memory userSummary =
            reETH.withdrawalQueue.getUserWithdrawalSummary(ETH_ADDRESS, withdrawalEpoch, address(this));

        // Ensure the reETH was burned.
        assertEq(reETH.token.totalSupply(), initialTotalSupply);

        assertTrue(epochSummary.settled);
        assertEq(epochSummary.amountIn, amountOut);
        assertEq(epochSummary.assetsReceived, 1 ether);
        assertEq(epochSummary.sharesOutstanding, 0);
        assertEq(epochSummary.amountToBurnAtSettlement, 0);

        assertFalse(userSummary.claimed);

        uint256 balanceBefore = address(this).balance;

        // Claim the withdrawal.
        uint256 amountClaimed = reETH.withdrawalQueue.claimWithdrawalsForEpoch(
            IRioLRTWithdrawalQueue.ClaimRequest({asset: ETH_ADDRESS, epoch: withdrawalEpoch})
        );

        assertEq(amountClaimed, 1 ether);
        assertEq(address(this).balance - balanceBefore, 1 ether);
    }

    function test_claimWithdrawalsForEpochSomeEtherPaidFromEigenLayer() public {
        uint8 operatorId = addOperatorDelegator(reETH.operatorRegistry, address(reETH.rewardDistributor));
        address operatorDelegator = reETH.operatorRegistry.getOperatorDetails(operatorId).delegator;

        // Deposit ETH, rebalance, verify the validator withdrawal credentials, and deposit again.
        uint256 depositAmount = ETH_DEPOSIT_SIZE - address(reETH.depositPool).balance;
        reETH.coordinator.depositETH{value: depositAmount}();

        // Get the latest POS deposit root and guardian signature.
        (bytes32 root, bytes memory signature) = signCurrentDepositRoot(reETH.coordinator);

        vm.prank(EOA, EOA);
        reETH.coordinator.rebalanceETH(root, signature);
        uint40[] memory validatorIndices = verifyCredentialsForValidators(reETH.operatorRegistry, 1, 1);
        reETH.coordinator.depositETH{value: ETH_DEPOSIT_SIZE}();

        // Request a withdrawal and rebalance.
        uint256 withdrawalAmount = ETH_DEPOSIT_SIZE + 1 ether;
        reETH.coordinator.requestWithdrawal(ETH_ADDRESS, withdrawalAmount);

        uint256 withdrawalEpoch = reETH.withdrawalQueue.getCurrentEpoch(ETH_ADDRESS);
        skip(reETH.coordinator.rebalanceDelay());

        (root, signature) = signCurrentDepositRoot(reETH.coordinator);

        vm.prank(EOA, EOA);
        reETH.coordinator.rebalanceETH(root, signature);

        // Validate reETH total supply and process withdrawals.
        assertApproxEqAbs(reETH.token.totalSupply(), ETH_DEPOSIT_SIZE, 100);
        verifyAndProcessWithdrawalsForValidatorIndexes(operatorDelegator, validatorIndices);

        // Settle the withdrawal epoch.
        IDelegationManager.Withdrawal[] memory withdrawals = new IDelegationManager.Withdrawal[](1);
        withdrawals[0] = IDelegationManager.Withdrawal({
            staker: operatorDelegator,
            delegatedTo: address(1),
            withdrawer: operatorDelegator,
            nonce: 0,
            startBlock: 1,
            strategies: BEACON_CHAIN_STRATEGY.toArray(),
            shares: uint256(1 ether).toArray()
        });
        reETH.withdrawalQueue.completeEpochSettlementFromEigenLayer(
            ETH_ADDRESS, withdrawalEpoch, withdrawals, new uint256[](1)
        );

        // Assert epoch summary details.
        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reETH.withdrawalQueue.getEpochWithdrawalSummary(ETH_ADDRESS, withdrawalEpoch);
        assertTrue(epochSummary.settled);
        assertEq(epochSummary.amountIn, withdrawalAmount);
        assertEq(epochSummary.assetsReceived, withdrawalAmount);
        assertEq(epochSummary.sharesOutstanding, 0);

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
        assertEq(reETH.withdrawalQueue.getCurrentEpoch(ETH_ADDRESS), withdrawalEpoch + 1);
    }

    function test_claimWithdrawalsForEpochSomeEtherPaidFromEigenLayerPreciseDecimals() public {
        // This test is important as shares requested for withdrawal from EigenLayer MUST
        // be whole gwei amounts. This test ensures that precise payments from the deposit pool
        // in combination with EigenLayer are handled correctly.
        uint8 operatorId = addOperatorDelegator(reETH.operatorRegistry, address(reETH.rewardDistributor));
        address operatorDelegator = reETH.operatorRegistry.getOperatorDetails(operatorId).delegator;

        uint256 depositAmount = ETH_DEPOSIT_SIZE - address(reETH.depositPool).balance;
        uint256 amountInDP = ETH_DEPOSIT_SIZE + (10 ** 17 - 1);

        // Deposit ETH, rebalance, verify the validator withdrawal credentials, and deposit again.
        reETH.coordinator.depositETH{value: depositAmount}();

        // Get the latest POS deposit root and guardian signature.
        (bytes32 root, bytes memory signature) = signCurrentDepositRoot(reETH.coordinator);

        vm.prank(EOA, EOA);
        reETH.coordinator.rebalanceETH(root, signature);
        uint40[] memory validatorIndices = verifyCredentialsForValidators(reETH.operatorRegistry, 1, 1);
        reETH.coordinator.depositETH{value: amountInDP}();

        // Request a withdrawal and rebalance.
        uint256 withdrawalAmount = ETH_DEPOSIT_SIZE + 10 ** 18 * 2 - 1;

        reETH.coordinator.requestWithdrawal(ETH_ADDRESS, withdrawalAmount);
        skip(reETH.coordinator.rebalanceDelay());

        uint256 expectedAmountOut = withdrawalAmount.reducePrecisionToGwei(); // Assumes 1:1 share value.
        uint256 withdrawalEpoch = reETH.withdrawalQueue.getCurrentEpoch(ETH_ADDRESS);

        (root, signature) = signCurrentDepositRoot(reETH.coordinator);

        vm.prank(EOA, EOA);
        reETH.coordinator.rebalanceETH(root, signature);

        uint256 expectedShareWithdrawal = expectedAmountOut - amountInDP.reducePrecisionToGwei();

        // Validate reETH total supply and process withdrawals.
        assertApproxEqAbs(reETH.token.totalSupply(), ETH_DEPOSIT_SIZE, GWEI_TO_WEI);
        verifyAndProcessWithdrawalsForValidatorIndexes(operatorDelegator, validatorIndices);

        // Settle the withdrawal epoch.
        IDelegationManager.Withdrawal[] memory withdrawals = new IDelegationManager.Withdrawal[](1);
        withdrawals[0] = IDelegationManager.Withdrawal({
            staker: operatorDelegator,
            delegatedTo: address(1),
            withdrawer: operatorDelegator,
            nonce: 0,
            startBlock: 1,
            strategies: BEACON_CHAIN_STRATEGY.toArray(),
            shares: expectedShareWithdrawal.toArray()
        });
        reETH.withdrawalQueue.completeEpochSettlementFromEigenLayer(
            ETH_ADDRESS, withdrawalEpoch, withdrawals, new uint256[](1)
        );

        // Assert epoch summary details.
        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reETH.withdrawalQueue.getEpochWithdrawalSummary(ETH_ADDRESS, withdrawalEpoch);
        assertTrue(epochSummary.settled);
        assertEq(epochSummary.amountIn, withdrawalAmount);
        assertEq(epochSummary.assetsReceived, expectedAmountOut);
        assertEq(epochSummary.sharesOutstanding, 0);

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
        assertEq(reETH.withdrawalQueue.getCurrentEpoch(ETH_ADDRESS), withdrawalEpoch + 1);
    }

    function test_claimWithdrawalsForEpochAllEtherPaidFromEigenLayer() public {
        uint8 operatorId = addOperatorDelegator(reETH.operatorRegistry, address(reETH.rewardDistributor));
        address operatorDelegator = reETH.operatorRegistry.getOperatorDetails(operatorId).delegator;

        // Deposit ETH, rebalance, and verify the validator withdrawal credentials.
        uint256 depositAmount = ETH_DEPOSIT_SIZE - address(reETH.depositPool).balance;
        reETH.coordinator.depositETH{value: depositAmount}();

        // Get the latest POS deposit root and guardian signature.
        (bytes32 root, bytes memory signature) = signCurrentDepositRoot(reETH.coordinator);

        vm.prank(EOA, EOA);
        reETH.coordinator.rebalanceETH(root, signature);
        uint40[] memory validatorIndices = verifyCredentialsForValidators(reETH.operatorRegistry, 1, 1);

        // Request a withdrawal and rebalance.
        uint256 withdrawalAmount = 16 ether;
        reETH.coordinator.requestWithdrawal(ETH_ADDRESS, withdrawalAmount);

        uint256 withdrawalEpoch = reETH.withdrawalQueue.getCurrentEpoch(ETH_ADDRESS);
        skip(reETH.coordinator.rebalanceDelay());

        (root, signature) = signCurrentDepositRoot(reETH.coordinator);

        vm.prank(EOA, EOA);
        reETH.coordinator.rebalanceETH(root, signature);

        // Ensure no reETH has been burned yet and process withdrawals.
        assertEq(reETH.token.totalSupply(), ETH_DEPOSIT_SIZE);
        verifyAndProcessWithdrawalsForValidatorIndexes(operatorDelegator, validatorIndices);

        // Settle the withdrawal epoch.
        IDelegationManager.Withdrawal[] memory withdrawals = new IDelegationManager.Withdrawal[](1);
        withdrawals[0] = IDelegationManager.Withdrawal({
            staker: operatorDelegator,
            delegatedTo: address(1),
            withdrawer: operatorDelegator,
            nonce: 0,
            startBlock: 1,
            strategies: BEACON_CHAIN_STRATEGY.toArray(),
            shares: withdrawalAmount.toArray()
        });
        reETH.withdrawalQueue.completeEpochSettlementFromEigenLayer(
            ETH_ADDRESS, withdrawalEpoch, withdrawals, new uint256[](1)
        );

        // Assert epoch summary details.
        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reETH.withdrawalQueue.getEpochWithdrawalSummary(ETH_ADDRESS, withdrawalEpoch);
        assertTrue(epochSummary.settled);
        assertEq(epochSummary.amountIn, withdrawalAmount);
        assertEq(epochSummary.assetsReceived, withdrawalAmount);
        assertEq(epochSummary.sharesOutstanding, 0);

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
        assertEq(reETH.withdrawalQueue.getCurrentEpoch(ETH_ADDRESS), withdrawalEpoch + 1);
    }

    function test_claimWithdrawalsForEpochAllEtherPaidFromEigenLayerPreciseDecimals() public {
        // This test is important as shares requested for withdrawal from EigenLayer MUST
        // be whole gwei amounts.
        uint8 operatorId = addOperatorDelegator(reETH.operatorRegistry, address(reETH.rewardDistributor));
        address operatorDelegator = reETH.operatorRegistry.getOperatorDetails(operatorId).delegator;

        // Deposit ETH, rebalance, and verify the validator withdrawal credentials.
        uint256 depositAmount = ETH_DEPOSIT_SIZE - address(reETH.depositPool).balance;
        reETH.coordinator.depositETH{value: depositAmount}();

        // Get the latest POS deposit root and guardian signature.
        (bytes32 root, bytes memory signature) = signCurrentDepositRoot(reETH.coordinator);

        vm.prank(EOA, EOA);
        reETH.coordinator.rebalanceETH(root, signature);
        uint40[] memory validatorIndices = verifyCredentialsForValidators(reETH.operatorRegistry, 1, 1);

        // Request a withdrawal for an amount with very precise decimals and rebalance.
        uint256 withdrawalAmount = 10 ** 18 - 1;

        reETH.coordinator.requestWithdrawal(ETH_ADDRESS, withdrawalAmount);
        skip(reETH.coordinator.rebalanceDelay());

        uint256 expectedAmountOut = withdrawalAmount.reducePrecisionToGwei(); // Assumes 1:1 share value.
        uint256 withdrawalEpoch = reETH.withdrawalQueue.getCurrentEpoch(ETH_ADDRESS);

        (root, signature) = signCurrentDepositRoot(reETH.coordinator);

        vm.prank(EOA, EOA);
        reETH.coordinator.rebalanceETH(root, signature);

        // Ensure no reETH has been burned yet and process withdrawals.
        assertEq(reETH.token.totalSupply(), ETH_DEPOSIT_SIZE);
        verifyAndProcessWithdrawalsForValidatorIndexes(operatorDelegator, validatorIndices);

        // Settle the withdrawal epoch.
        IDelegationManager.Withdrawal[] memory withdrawals = new IDelegationManager.Withdrawal[](1);
        withdrawals[0] = IDelegationManager.Withdrawal({
            staker: operatorDelegator,
            delegatedTo: address(1),
            withdrawer: operatorDelegator,
            nonce: 0,
            startBlock: 1,
            strategies: BEACON_CHAIN_STRATEGY.toArray(),
            shares: expectedAmountOut.toArray()
        });
        reETH.withdrawalQueue.completeEpochSettlementFromEigenLayer(
            ETH_ADDRESS, withdrawalEpoch, withdrawals, new uint256[](1)
        );

        // Assert epoch summary details.
        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reETH.withdrawalQueue.getEpochWithdrawalSummary(ETH_ADDRESS, withdrawalEpoch);
        assertTrue(epochSummary.settled);
        assertEq(epochSummary.amountIn, withdrawalAmount);
        assertEq(epochSummary.assetsReceived, expectedAmountOut);
        assertEq(epochSummary.sharesOutstanding, 0);

        // Claim and assert withdrawal.
        uint256 balanceBefore = address(this).balance;
        uint256 amountClaimed = reETH.withdrawalQueue.claimWithdrawalsForEpoch(
            IRioLRTWithdrawalQueue.ClaimRequest({asset: ETH_ADDRESS, epoch: withdrawalEpoch})
        );
        IRioLRTWithdrawalQueue.UserWithdrawalSummary memory userSummary =
            reETH.withdrawalQueue.getUserWithdrawalSummary(ETH_ADDRESS, withdrawalEpoch, address(this));

        assertTrue(userSummary.claimed);
        assertEq(userSummary.amountIn, withdrawalAmount);
        assertEq(amountClaimed, expectedAmountOut);
        assertEq(address(this).balance - balanceBefore, expectedAmountOut);
    }

    function test_claimWithdrawalsForEpochAllERC20sPaidFromDepositPool() public {
        uint256 initialTotalSupply = reLST.token.totalSupply();
        uint256 amount = 55e18;

        cbETH.approve(address(reLST.coordinator), type(uint256).max);
        uint256 amountOut = reLST.coordinator.depositERC20(CBETH_ADDRESS, amount);

        reLST.coordinator.requestWithdrawal(CBETH_ADDRESS, amountOut);

        uint256 withdrawalEpoch = reLST.withdrawalQueue.getCurrentEpoch(CBETH_ADDRESS);

        // Rebalance to settle the withdrawal.
        vm.prank(EOA, EOA);
        reLST.coordinator.rebalanceERC20(CBETH_ADDRESS);

        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reLST.withdrawalQueue.getEpochWithdrawalSummary(CBETH_ADDRESS, withdrawalEpoch);
        IRioLRTWithdrawalQueue.UserWithdrawalSummary memory userSummary =
            reLST.withdrawalQueue.getUserWithdrawalSummary(CBETH_ADDRESS, withdrawalEpoch, address(this));

        // Ensure the reLST was burned.
        assertEq(reLST.token.totalSupply(), initialTotalSupply);

        assertTrue(epochSummary.settled);
        assertEq(epochSummary.amountIn, amountOut);
        assertEq(epochSummary.assetsReceived, amount);
        assertEq(epochSummary.sharesOutstanding, 0);

        assertFalse(userSummary.claimed);
        assertEq(userSummary.amountIn, amountOut);

        uint256 balanceBefore = cbETH.balanceOf(address(this));

        // Claim the withdrawal.
        uint256 amountClaimed = reLST.withdrawalQueue.claimWithdrawalsForEpoch(
            IRioLRTWithdrawalQueue.ClaimRequest({asset: CBETH_ADDRESS, epoch: withdrawalEpoch})
        );

        assertEq(amountClaimed, amount);
        assertEq(cbETH.balanceOf(address(this)) - balanceBefore, amount);
    }

    function test_claimWithdrawalsForEpochSomeERC20sPaidFromEigenLayer() public {
        uint256 initialTotalSupply = reLST.token.totalSupply();

        uint8 operatorId = addOperatorDelegator(reLST.operatorRegistry, address(reLST.rewardDistributor));
        address operatorDelegator = reLST.operatorRegistry.getOperatorDetails(operatorId).delegator;

        uint256 amount = 18e18;
        uint256 expectedTokensOut = amount * 2; // Two deposits of `amount`.

        // Deposit cbETH, rebalance, and deposit again to create a balance in EigenLayer
        // and the deposit pool.
        cbETH.approve(address(reLST.coordinator), type(uint256).max);
        uint256 restakingTokensInEL = reLST.coordinator.depositERC20(CBETH_ADDRESS, amount);

        vm.prank(EOA, EOA);
        reLST.coordinator.rebalanceERC20(CBETH_ADDRESS);
        uint256 restakingTokensInDP = reLST.coordinator.depositERC20(CBETH_ADDRESS, amount);

        // Request a withdrawal for an amount greater than the deposit pool balance and rebalance.
        uint256 withdrawalLRTAmount = restakingTokensInDP + restakingTokensInEL;
        reLST.coordinator.requestWithdrawal(CBETH_ADDRESS, withdrawalLRTAmount);

        uint256 withdrawalEpoch = reLST.withdrawalQueue.getCurrentEpoch(CBETH_ADDRESS);
        skip(reLST.coordinator.rebalanceDelay());

        vm.prank(EOA, EOA);
        reLST.coordinator.rebalanceERC20(CBETH_ADDRESS);

        // Validate that the deposit pool balance has been removed from the reLST total supply.
        assertApproxEqAbs(reLST.token.totalSupply(), restakingTokensInEL + initialTotalSupply, 100);

        // Settle the withdrawal epoch.
        IDelegationManager.Withdrawal[] memory withdrawals = new IDelegationManager.Withdrawal[](1);
        withdrawals[0] = IDelegationManager.Withdrawal({
            staker: operatorDelegator,
            delegatedTo: address(1),
            withdrawer: operatorDelegator,
            nonce: 0,
            startBlock: 1,
            strategies: CBETH_STRATEGY.toArray(),
            shares: amount.toArray()
        });
        reLST.withdrawalQueue.completeEpochSettlementFromEigenLayer(
            CBETH_ADDRESS, withdrawalEpoch, withdrawals, new uint256[](1)
        );

        // Assert epoch summary details.
        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reLST.withdrawalQueue.getEpochWithdrawalSummary(CBETH_ADDRESS, withdrawalEpoch);
        assertTrue(epochSummary.settled);
        assertEq(epochSummary.amountIn, withdrawalLRTAmount);
        assertEq(epochSummary.assetsReceived, expectedTokensOut);
        assertEq(epochSummary.sharesOutstanding, 0);

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
        assertEq(reLST.withdrawalQueue.getCurrentEpoch(CBETH_ADDRESS), withdrawalEpoch + 1);
    }

    function test_claimWithdrawalsForEpochAllERC20sPaidFromEigenLayer() public {
        uint256 initialTotalSupply = reLST.token.totalSupply();

        uint8 operatorId = addOperatorDelegator(reLST.operatorRegistry, address(reLST.rewardDistributor));
        address operatorDelegator = reLST.operatorRegistry.getOperatorDetails(operatorId).delegator;

        uint256 amount = 8e18;

        // Deposit cbETH and rebalance to move all tokens to EigenLayer.
        cbETH.approve(address(reLST.coordinator), type(uint256).max);
        uint256 restakingTokensOut = reLST.coordinator.depositERC20(CBETH_ADDRESS, amount);

        vm.prank(EOA, EOA);
        reLST.coordinator.rebalanceERC20(CBETH_ADDRESS);

        // Request a withdrawal for the tokens from EigenLayer and rebalance.
        reLST.coordinator.requestWithdrawal(CBETH_ADDRESS, restakingTokensOut);

        uint256 withdrawalEpoch = reLST.withdrawalQueue.getCurrentEpoch(CBETH_ADDRESS);
        skip(reLST.coordinator.rebalanceDelay());

        vm.prank(EOA, EOA);
        reLST.coordinator.rebalanceERC20(CBETH_ADDRESS);

        // Ensure no reLST has been burned yet.
        assertEq(reLST.token.totalSupply(), restakingTokensOut + initialTotalSupply);

        // Settle the withdrawal epoch.
        IDelegationManager.Withdrawal[] memory withdrawals = new IDelegationManager.Withdrawal[](1);
        withdrawals[0] = IDelegationManager.Withdrawal({
            staker: operatorDelegator,
            delegatedTo: address(1),
            withdrawer: operatorDelegator,
            nonce: 0,
            startBlock: 1,
            strategies: CBETH_STRATEGY.toArray(),
            shares: amount.toArray()
        });
        reLST.withdrawalQueue.completeEpochSettlementFromEigenLayer(
            CBETH_ADDRESS, withdrawalEpoch, withdrawals, new uint256[](1)
        );

        // Assert epoch summary details.
        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reLST.withdrawalQueue.getEpochWithdrawalSummary(CBETH_ADDRESS, withdrawalEpoch);
        assertTrue(epochSummary.settled);
        assertEq(epochSummary.amountIn, restakingTokensOut);
        assertEq(epochSummary.assetsReceived, amount);
        assertEq(epochSummary.sharesOutstanding, 0);

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
        assertEq(reLST.withdrawalQueue.getCurrentEpoch(CBETH_ADDRESS), withdrawalEpoch + 1);
    }

    function test_claimWithdrawalsForManyEpochs() public {
        IRioLRTWithdrawalQueue.ClaimRequest[] memory claimRequests = new IRioLRTWithdrawalQueue.ClaimRequest[](3);
        for (uint256 i = 0; i < 3; i++) {
            reETH.coordinator.depositETH{value: 1 ether}();
            reETH.coordinator.requestWithdrawal(ETH_ADDRESS, 1 ether);

            claimRequests[i] = IRioLRTWithdrawalQueue.ClaimRequest({
                asset: ETH_ADDRESS,
                epoch: reETH.withdrawalQueue.getCurrentEpoch(ETH_ADDRESS)
            });

            // Skip ahead and rebalance to settle the withdrawal
            skip(reETH.coordinator.rebalanceDelay());

            // Get the latest POS deposit root and guardian signature.
            (bytes32 root, bytes memory signature) = signCurrentDepositRoot(reETH.coordinator);

            vm.prank(EOA, EOA);
            reETH.coordinator.rebalanceETH(root, signature);
        }

        // Claim the withdrawals.
        uint256 balanceBefore = address(this).balance;
        uint256[] memory amountOuts = reETH.withdrawalQueue.claimWithdrawalsForManyEpochs(claimRequests);

        assertEq(amountOuts.length, 3);
        for (uint256 i = 0; i < 3; i++) {
            assertEq(amountOuts[i], 1 ether);
        }
        assertEq(address(this).balance - balanceBefore, 3 ether);
    }

    receive() external payable {}
}
