// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {PausableUpgradeable} from '@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol';
import {IRioLRTWithdrawalQueue} from 'contracts/interfaces/IRioLRTWithdrawalQueue.sol';
import {IRioLRTCoordinator} from 'contracts/interfaces/IRioLRTCoordinator.sol';
import {IRioLRTDepositPool} from 'contracts/interfaces/IRioLRTDepositPool.sol';
import {EmptyContract} from 'test/utils/EmptyContract.sol';
import {RioDeployer} from 'test/utils/RioDeployer.sol';
import {
    ETH_ADDRESS,
    ETH_DEPOSIT_SIZE,
    ETH_DEPOSIT_SOFT_CAP,
    ETH_DEPOSIT_BUFFER_LIMIT,
    MAX_REBALANCE_DELAY
} from 'contracts/utils/Constants.sol';

contract RioLRTCoordinatorTest is RioDeployer {
    TestLRTDeployment public reETH;
    TestLRTDeployment public reLST;

    function setUp() public {
        deployRio();

        (reETH,) = issueRestakedETH();
        (reLST,) = issueRestakedLST();
    }

    function test_pauseNonOwnerReverts() public {
        vm.prank(address(42));
        vm.expectRevert(abi.encodeWithSelector(OwnableUpgradeable.OwnableUnauthorizedAccount.selector, address(42)));

        reETH.coordinator.pause();
    }

    function test_unpauseNonOwnerReverts() public {
        reETH.coordinator.pause();

        vm.prank(address(42));
        vm.expectRevert(abi.encodeWithSelector(OwnableUpgradeable.OwnableUnauthorizedAccount.selector, address(42)));

        reETH.coordinator.unpause();
    }

    function test_emergencyPauseOperatorUndelegatedNoOperatorsReverts() public {
        vm.expectRevert(abi.encodeWithSelector(IRioLRTCoordinator.NO_OPERATOR_UNDELEGATED.selector));
        reETH.coordinator.emergencyPauseOperatorUndelegated();
    }

    function test_emergencyPauseOperatorUndelegatedStillDelegatedReverts() public {
        addOperatorDelegators(reETH.operatorRegistry, address(reETH.rewardDistributor), 10);

        vm.expectRevert(abi.encodeWithSelector(IRioLRTCoordinator.NO_OPERATOR_UNDELEGATED.selector));
        reETH.coordinator.emergencyPauseOperatorUndelegated();
    }

    function test_emergencyPauseOperatorUndelegated() public {
        addOperatorDelegators(reETH.operatorRegistry, address(reETH.rewardDistributor), 10);

        address delegator = reETH.operatorRegistry.getOperatorDetails(4).delegator;
        address operator = delegationManager.delegatedTo(delegator);

        vm.prank(operator);
        delegationManager.undelegate(delegator);

        reETH.coordinator.emergencyPauseOperatorUndelegated();

        assertTrue(reETH.coordinator.paused());
    }

    function test_depositETHWhenPausedReverts() public {
        reETH.coordinator.pause();

        vm.expectRevert(abi.encodeWithSelector(PausableUpgradeable.EnforcedPause.selector));
        reETH.coordinator.depositETH{value: 1 ether}();
    }

    function test_depositETHNotSupportedReverts() public {
        vm.expectRevert(abi.encodeWithSelector(IRioLRTCoordinator.ASSET_NOT_SUPPORTED.selector, ETH_ADDRESS));
        reLST.coordinator.depositETH{value: 1 ether}();
    }

    function test_depositETHZeroValueReverts() public {
        vm.expectRevert(abi.encodeWithSelector(IRioLRTCoordinator.AMOUNT_MUST_BE_GREATER_THAN_ZERO.selector));
        reETH.coordinator.depositETH{value: 0}();
    }

    function test_depositETHViaNamedFunction() public {
        reETH.coordinator.depositETH{value: 1 ether}();

        // The initial exchange rate is 1:1.
        assertEq(reETH.token.balanceOf(address(this)), 1 ether);
    }

    function test_depositETHViaReceiveFunction() public {
        (bool success,) = address(reETH.coordinator).call{value: 1 ether}('');
        assertTrue(success);

        // The initial exchange rate is 1:1.
        assertEq(reETH.token.balanceOf(address(this)), 1 ether);
    }

    function test_depositERC20WhenPausedReverts() public {
        reLST.coordinator.pause();

        vm.expectRevert(abi.encodeWithSelector(PausableUpgradeable.EnforcedPause.selector));
        reLST.coordinator.deposit(address(42), 20e18);
    }

    function test_depositERC20NotSupportedReverts() public {
        vm.expectRevert(abi.encodeWithSelector(IRioLRTCoordinator.ASSET_NOT_SUPPORTED.selector, address(42)));
        reLST.coordinator.deposit(address(42), 20e18);
    }

    function test_depositERC20ZeroValueReverts() public {
        vm.expectRevert(abi.encodeWithSelector(IRioLRTCoordinator.AMOUNT_MUST_BE_GREATER_THAN_ZERO.selector));
        reLST.coordinator.deposit(CBETH_ADDRESS, 0);
    }

    function test_depositERC20() public {
        cbETH.approve(address(reLST.coordinator), 20e18);
        reLST.coordinator.deposit(CBETH_ADDRESS, 20e18);

        uint256 price = reLST.assetRegistry.getAssetPrice(CBETH_ADDRESS);
        assertEq(reLST.token.balanceOf(address(this)), price * 20);
    }

    function test_requestEtherWithdrawalWhenPausedReverts() public {
        reETH.coordinator.pause();

        vm.expectRevert(abi.encodeWithSelector(PausableUpgradeable.EnforcedPause.selector));
        reETH.coordinator.requestWithdrawal(ETH_ADDRESS, 1 ether);
    }

    function test_requestWithdrawalEtherNotSupportedReverts() public {
        vm.expectRevert(abi.encodeWithSelector(IRioLRTCoordinator.ASSET_NOT_SUPPORTED.selector, ETH_ADDRESS));
        reLST.coordinator.requestWithdrawal(ETH_ADDRESS, 1 ether);
    }

    function test_requestEtherWithdrawalZeroValueReverts() public {
        vm.expectRevert(abi.encodeWithSelector(IRioLRTCoordinator.AMOUNT_MUST_BE_GREATER_THAN_ZERO.selector));
        reETH.coordinator.requestWithdrawal(ETH_ADDRESS, 0);
    }

    function test_requestEtherWithdrawal() public {
        uint256 amountOut = reETH.coordinator.depositETH{value: 1 ether}();

        reETH.coordinator.requestWithdrawal(ETH_ADDRESS, amountOut);

        uint256 currentEpoch = reETH.withdrawalQueue.getCurrentEpoch(ETH_ADDRESS);
        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reETH.withdrawalQueue.getEpochWithdrawalSummary(ETH_ADDRESS, currentEpoch);
        IRioLRTWithdrawalQueue.UserWithdrawalSummary memory userSummary =
            reETH.withdrawalQueue.getUserWithdrawalSummary(ETH_ADDRESS, currentEpoch, address(this));

        assertEq(reETH.token.balanceOf(address(this)), 0);
        assertEq(reETH.withdrawalQueue.getRestakingTokensInCurrentEpoch(ETH_ADDRESS), amountOut);

        assertFalse(epochSummary.settled);
        assertEq(epochSummary.amountIn, amountOut);

        assertFalse(userSummary.claimed);
        assertEq(epochSummary.amountIn, amountOut);
    }

    function test_requestERC20WithdrawalWhenPausedReverts() public {
        reLST.coordinator.pause();

        vm.expectRevert(abi.encodeWithSelector(PausableUpgradeable.EnforcedPause.selector));
        reLST.coordinator.requestWithdrawal(CBETH_ADDRESS, 20e18);
    }

    function test_requestWithdrawalERC20NotSupportedReverts() public {
        vm.expectRevert(abi.encodeWithSelector(IRioLRTCoordinator.ASSET_NOT_SUPPORTED.selector, address(42)));
        reLST.coordinator.requestWithdrawal(address(42), 20e18);
    }

    function test_requestERC20WithdrawalZeroValueReverts() public {
        vm.expectRevert(abi.encodeWithSelector(IRioLRTCoordinator.AMOUNT_MUST_BE_GREATER_THAN_ZERO.selector));
        reLST.coordinator.requestWithdrawal(CBETH_ADDRESS, 0);
    }

    function test_requestWithdrawalBeyondAmountAvailableReverts() public {
        rETH.approve(address(reLST.coordinator), 100e18);
        reLST.coordinator.deposit(RETH_ADDRESS, 100e18);

        vm.expectRevert(abi.encodeWithSelector(IRioLRTCoordinator.INSUFFICIENT_SHARES_FOR_WITHDRAWAL.selector));
        reLST.coordinator.requestWithdrawal(CBETH_ADDRESS, 100e18);
    }

    function test_requestERC20Withdrawal() public {
        uint256 amount = 50e18;

        cbETH.approve(address(reLST.coordinator), amount);
        uint256 amountOut = reLST.coordinator.deposit(CBETH_ADDRESS, amount);

        reLST.coordinator.requestWithdrawal(CBETH_ADDRESS, amountOut);

        uint256 currentEpoch = reLST.withdrawalQueue.getCurrentEpoch(CBETH_ADDRESS);
        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reLST.withdrawalQueue.getEpochWithdrawalSummary(CBETH_ADDRESS, currentEpoch);
        IRioLRTWithdrawalQueue.UserWithdrawalSummary memory userSummary =
            reLST.withdrawalQueue.getUserWithdrawalSummary(CBETH_ADDRESS, currentEpoch, address(this));

        assertEq(reLST.token.balanceOf(address(this)), 0);
        assertEq(reLST.withdrawalQueue.getRestakingTokensInCurrentEpoch(CBETH_ADDRESS), amountOut);

        assertFalse(epochSummary.settled);
        assertEq(epochSummary.amountIn, amountOut);

        assertFalse(userSummary.claimed);
        assertEq(userSummary.amountIn, amountOut);
    }

    function test_setRebalanceDelayNonOwnerReverts() public {
        vm.prank(address(42));
        vm.expectRevert(abi.encodeWithSelector(OwnableUpgradeable.OwnableUnauthorizedAccount.selector, address(42)));
        reETH.coordinator.setRebalanceDelay(1);
    }

    function test_setRebalanceDelayAboveMaximumReverts() public {
        vm.expectRevert(abi.encodeWithSelector(IRioLRTCoordinator.REBALANCE_DELAY_TOO_LONG.selector));
        reETH.coordinator.setRebalanceDelay(uint24(MAX_REBALANCE_DELAY) + 1);
    }

    function test_setRebalanceDelay() public {
        reETH.coordinator.setRebalanceDelay(99);
        assertEq(reETH.coordinator.rebalanceDelay(), 99);
    }

    function test_setRebalanceDelayTakesEffectImmediatelyIfSetBeforeFirstRebalance() public {
        // Ensure there is an operator to allocate to.
        addOperatorDelegators(reETH.operatorRegistry, address(reETH.rewardDistributor), 1);

        reETH.coordinator.depositETH{value: ETH_DEPOSIT_SIZE}();

        uint24 initialRebalanceDelay = reETH.coordinator.rebalanceDelay();
        reETH.coordinator.setRebalanceDelay(initialRebalanceDelay - 1);

        // Skip forward using the new, slightly shorter delay.
        skip(reETH.coordinator.rebalanceDelay());

        // Get the latest POS deposit root and guardian signature.
        (bytes32 root, bytes memory signature) = signCurrentDepositRoot(reETH.coordinator);

        // The rebalance delay should take effect immediately (no revert).
        vm.prank(EOA, EOA);
        reETH.coordinator.rebalanceETH(root, signature);
    }

    function test_setRebalanceDelayDoesNotTakeEffectUntilSubsequentRebalanceIfAfterFirstRebalance() public {
        // Ensure there is an operator to allocate to.
        addOperatorDelegators(reETH.operatorRegistry, address(reETH.rewardDistributor), 1);

        reETH.coordinator.depositETH{value: ETH_DEPOSIT_SIZE}();

        // Get the latest POS deposit root and guardian signature.
        (bytes32 root, bytes memory signature) = signCurrentDepositRoot(reETH.coordinator);

        // First rebalance.
        vm.prank(EOA, EOA);
        reETH.coordinator.rebalanceETH(root, signature);

        reETH.coordinator.depositETH{value: ETH_DEPOSIT_SIZE}();

        uint24 initialRebalanceDelay = reETH.coordinator.rebalanceDelay();
        reETH.coordinator.setRebalanceDelay(initialRebalanceDelay - 1);

        // Skip forward using the new, slightly shorter delay.
        skip(reETH.coordinator.rebalanceDelay());

        (root, signature) = signCurrentDepositRoot(reETH.coordinator);

        vm.expectRevert(abi.encodeWithSelector(IRioLRTCoordinator.REBALANCE_DELAY_NOT_MET.selector));

        // The rebalance delay should not have taken effect yet.
        vm.prank(EOA, EOA);
        reETH.coordinator.rebalanceETH(root, signature);

        skip(1);

        (root, signature) = signCurrentDepositRoot(reETH.coordinator);

        // The rebalance delay should have taken effect now.
        vm.prank(EOA, EOA);
        reETH.coordinator.rebalanceETH(root, signature);
    }

    function test_rebalanceETHWhenPausedReverts() public {
        reETH.coordinator.pause();

        (bytes32 root, bytes memory signature) = signCurrentDepositRoot(reETH.coordinator);

        vm.expectRevert(abi.encodeWithSelector(PausableUpgradeable.EnforcedPause.selector));
        reETH.coordinator.rebalanceETH(root, signature);
    }

    function test_rebalanceETHNotNeededReverts() public {
        (bytes32 root, bytes memory signature) = signCurrentDepositRoot(reETH.coordinator);

        // No withdrawals or deposits have been made, so no rebalance is needed.
        vm.expectRevert(abi.encodeWithSelector(IRioLRTCoordinator.NO_REBALANCE_NEEDED.selector));
        vm.prank(EOA, EOA);

        reETH.coordinator.rebalanceETH(root, signature);
    }

    function test_rebalanceETHNotEOAReverts() public {
        // Get the latest POS deposit root and guardian signature.
        (bytes32 root, bytes memory signature) = signCurrentDepositRoot(reETH.coordinator);

        vm.prank(address(new EmptyContract()));
        vm.expectRevert(abi.encodeWithSelector(IRioLRTCoordinator.CALLER_MUST_BE_EOA.selector));

        reETH.coordinator.rebalanceETH(root, signature);
    }

    function test_rebalanceETHDelayNotMetReverts() public {
        // Ensure there is an operator to allocate to.
        addOperatorDelegators(reETH.operatorRegistry, address(reETH.rewardDistributor), 1);

        reETH.coordinator.depositETH{value: ETH_DEPOSIT_SIZE}();

        // Get the latest POS deposit root and guardian signature.
        (bytes32 root, bytes memory signature) = signCurrentDepositRoot(reETH.coordinator);

        vm.prank(EOA, EOA);
        reETH.coordinator.rebalanceETH(root, signature);

        (root, signature) = signCurrentDepositRoot(reETH.coordinator);

        vm.expectRevert(abi.encodeWithSelector(IRioLRTCoordinator.REBALANCE_DELAY_NOT_MET.selector));

        vm.prank(EOA, EOA);
        reETH.coordinator.rebalanceETH(root, signature);
    }

    function test_rebalanceETHInvalidGuardianSignatureBeforeWithdrawalOnlyPeriodReverts() public {
        // Ensure there is an operator to allocate to.
        addOperatorDelegators(reETH.operatorRegistry, address(reETH.rewardDistributor), 1);

        reETH.coordinator.depositETH{value: ETH_DEPOSIT_SIZE}();

        vm.warp(reETH.coordinator.assetNextRebalanceAfter(ETH_ADDRESS) + 1);

        // Get the latest POS deposit root and guardian signature.
        (bytes32 root,) = signCurrentDepositRoot(reETH.coordinator);

        vm.expectRevert(abi.encodeWithSelector(IRioLRTCoordinator.INVALID_GUARDIAN_SIGNATURE.selector));

        vm.prank(EOA, EOA);
        reETH.coordinator.rebalanceETH(root, new bytes(65));
    }

    function test_rebalanceETHStaleDepositRootReverts() public {
        // Ensure there is an operator to allocate to.
        addOperatorDelegators(reETH.operatorRegistry, address(reETH.rewardDistributor), 1);

        reETH.coordinator.depositETH{value: ETH_DEPOSIT_SIZE}();

        // Get the latest POS deposit root and guardian signature.
        (bytes32 root, bytes memory signature) = signCurrentDepositRoot(reETH.coordinator);

        vm.prank(EOA, EOA);
        reETH.coordinator.rebalanceETH(root, signature);

        reETH.coordinator.depositETH{value: ETH_DEPOSIT_SIZE}();

        skip(reETH.coordinator.rebalanceDelay() + 1);

        vm.expectRevert(abi.encodeWithSelector(IRioLRTCoordinator.STALE_DEPOSIT_ROOT.selector));

        // Rebalance using old root.
        vm.prank(EOA, EOA);
        reETH.coordinator.rebalanceETH(root, signature);
    }

    function test_rebalanceETHInvalidGuardianSignatureDuringWithdrawalOnlyPeriodAllowsPartialRebalance() public {
        // Ensure there is an operator to allocate to.
        addOperatorDelegators(reETH.operatorRegistry, address(reETH.rewardDistributor), 1);

        reETH.coordinator.depositETH{value: ETH_DEPOSIT_SIZE * 2}();

        reETH.coordinator.requestWithdrawal(ETH_ADDRESS, ETH_DEPOSIT_SIZE);

        uint256 depositPoolBalanceBefore = address(reETH.depositPool).balance;

        vm.warp(reETH.coordinator.assetNextRebalanceAfter(ETH_ADDRESS) + 25 hours);

        // Get the latest POS deposit root.
        (bytes32 root,) = signCurrentDepositRoot(reETH.coordinator);

        vm.prank(EOA, EOA);
        reETH.coordinator.rebalanceETH(root, new bytes(65));

        // Only the withdrawal should be processed.
        assertEq(address(reETH.depositPool).balance, depositPoolBalanceBefore - ETH_DEPOSIT_SIZE);
    }

    function test_rebalanceETHSetsNextRebalanceTimestamp() public {
        // Ensure there is an operator to allocate to.
        addOperatorDelegators(reETH.operatorRegistry, address(reETH.rewardDistributor), 1);

        reETH.coordinator.depositETH{value: ETH_DEPOSIT_SIZE}();

        // Get the latest POS deposit root and guardian signature.
        (bytes32 root, bytes memory signature) = signCurrentDepositRoot(reETH.coordinator);

        vm.prank(EOA, EOA);
        reETH.coordinator.rebalanceETH(root, signature);

        assertTrue(reETH.coordinator.assetNextRebalanceAfter(ETH_ADDRESS) > block.timestamp);
    }

    function test_rebalanceETHAboveSoftCapAndBufferDoesNotIncreaseNextRebalanceTimestamp() public {
        // Ensure there are operators to allocate to.
        addOperatorDelegators(reETH.operatorRegistry, address(reETH.rewardDistributor), 10);

        uint256 initialRebalanceAfterTimestamp = reETH.coordinator.assetNextRebalanceAfter(ETH_ADDRESS);

        uint256 amount = ETH_DEPOSIT_SOFT_CAP * 2;
        reETH.coordinator.depositETH{value: amount}();

        // Get the latest POS deposit root and guardian signature.
        (bytes32 root, bytes memory signature) = signCurrentDepositRoot(reETH.coordinator);

        // Capped rebalance, which should not set the next rebalance timestamp.
        vm.prank(EOA, EOA);
        reETH.coordinator.rebalanceETH(root, signature);

        assertEq(reETH.coordinator.assetNextRebalanceAfter(ETH_ADDRESS), initialRebalanceAfterTimestamp);

        (root, signature) = signCurrentDepositRoot(reETH.coordinator);

        // This rebalance shouldn't be capped, and should set the next rebalance timestamp.
        vm.prank(EOA, EOA);
        reETH.coordinator.rebalanceETH(root, signature);

        assertTrue(reETH.coordinator.assetNextRebalanceAfter(ETH_ADDRESS) > initialRebalanceAfterTimestamp);
    }

    function test_rebalanceETHSettlesWithdrawalEpochIfSufficientEtherInDepositPool() public {
        // Ensure there is an operator to allocate to.
        addOperatorDelegators(reETH.operatorRegistry, address(reETH.rewardDistributor), 1);

        uint256 amount = ETH_DEPOSIT_SIZE * 10;
        uint256 amountOut = reETH.coordinator.depositETH{value: amount}();
        reETH.coordinator.requestWithdrawal(ETH_ADDRESS, amountOut);

        uint256 epoch = reETH.withdrawalQueue.getCurrentEpoch(ETH_ADDRESS);

        // Get the latest POS deposit root and guardian signature.
        (bytes32 root, bytes memory signature) = signCurrentDepositRoot(reETH.coordinator);

        vm.prank(EOA, EOA);
        reETH.coordinator.rebalanceETH(root, signature);

        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reETH.withdrawalQueue.getEpochWithdrawalSummary(ETH_ADDRESS, epoch);
        assertTrue(epochSummary.settled);
        assertEq(epochSummary.assetsReceived, amount);
        assertEq(address(reETH.withdrawalQueue).balance, amount);
    }

    function test_rebalanceETHQueuesWithdrawalEpochLowEtherBalanceInDepositPool() public {
        // Ensure there is an operator to allocate to.
        addOperatorDelegators(reETH.operatorRegistry, address(reETH.rewardDistributor), 1);

        // Deposit and push the balance into EigenLayer.
        uint256 initialDepositAmount = ETH_DEPOSIT_SIZE - address(reETH.depositPool).balance;
        reETH.coordinator.depositETH{value: initialDepositAmount}();

        // Get the latest POS deposit root and guardian signature.
        (bytes32 root, bytes memory signature) = signCurrentDepositRoot(reETH.coordinator);

        vm.prank(EOA, EOA);
        reETH.coordinator.rebalanceETH(root, signature);

        // Verify validator withdrawal credentials.
        verifyCredentialsForValidators(reETH.operatorRegistry, 1, 1);

        // Deposit again and request a withdrawal. Following this deposit,
        // both EigenLayer and the deposit pool will have 32 ETH.
        reETH.coordinator.depositETH{value: ETH_DEPOSIT_SIZE}();
        reETH.coordinator.requestWithdrawal(ETH_ADDRESS, ETH_DEPOSIT_SIZE + 1 ether);

        skip(reETH.coordinator.rebalanceDelay());

        uint256 epoch = reETH.withdrawalQueue.getCurrentEpoch(ETH_ADDRESS);

        (root, signature) = signCurrentDepositRoot(reETH.coordinator);

        vm.prank(EOA, EOA);
        reETH.coordinator.rebalanceETH(root, signature);

        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reETH.withdrawalQueue.getEpochWithdrawalSummary(ETH_ADDRESS, epoch);
        assertFalse(epochSummary.settled);
        assertNotEq(epochSummary.aggregateRoot, bytes32(0));
        assertEq(epochSummary.assetsReceived, ETH_DEPOSIT_SIZE);
        assertEq(address(reETH.withdrawalQueue).balance, ETH_DEPOSIT_SIZE);
    }

    function test_rebalanceETHQueuesWithdrawalEpochNoEtherBalanceInDepositPool() public {
        // Ensure there is an operator to allocate to.
        addOperatorDelegators(reETH.operatorRegistry, address(reETH.rewardDistributor), 1);

        // Deposit and push the balance into EigenLayer.
        uint256 depositAmount = ETH_DEPOSIT_SIZE - address(reETH.depositPool).balance;
        reETH.coordinator.depositETH{value: depositAmount}();

        // Get the latest POS deposit root and guardian signature.
        (bytes32 root, bytes memory signature) = signCurrentDepositRoot(reETH.coordinator);

        vm.prank(EOA, EOA);
        reETH.coordinator.rebalanceETH(root, signature);

        // Verify validator withdrawal credentials.
        verifyCredentialsForValidators(reETH.operatorRegistry, 1, 1);

        // Request a withdrawal. There is no ETH in the deposit pool.
        reETH.coordinator.requestWithdrawal(ETH_ADDRESS, depositAmount);

        skip(reETH.coordinator.rebalanceDelay());

        uint256 epoch = reETH.withdrawalQueue.getCurrentEpoch(ETH_ADDRESS);

        (root, signature) = signCurrentDepositRoot(reETH.coordinator);

        vm.prank(EOA, EOA);
        reETH.coordinator.rebalanceETH(root, signature);

        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reETH.withdrawalQueue.getEpochWithdrawalSummary(ETH_ADDRESS, epoch);
        assertFalse(epochSummary.settled);
        assertNotEq(epochSummary.aggregateRoot, bytes32(0));
        assertEq(epochSummary.assetsReceived, 0);
        assertEq(address(reETH.withdrawalQueue).balance, 0);
    }

    function test_rebalanceETHCompletesWithdrawalsFromDepositPoolIfDepositToEigenLayerFails() public {
        // Ensure there is an operator to allocate to.
        addOperatorDelegators(reETH.operatorRegistry, address(reETH.rewardDistributor), 1);

        uint256 amount = ETH_DEPOSIT_SIZE * 10;
        uint256 amountOut = reETH.coordinator.depositETH{value: amount}();
        reETH.coordinator.requestWithdrawal(ETH_ADDRESS, amountOut);

        // Make the deposit revert.
        vm.mockCallRevert(
            address(reETH.depositPool),
            abi.encodeWithSelector(IRioLRTDepositPool.depositBalanceIntoEigenLayer.selector, ETH_ADDRESS),
            abi.encode('StrategyBaseTVLLimits: max per deposit exceeded')
        );

        uint256 epoch = reETH.withdrawalQueue.getCurrentEpoch(ETH_ADDRESS);

        vm.expectEmit(true, false, false, true, address(reETH.coordinator));
        emit IRioLRTCoordinator.PartiallyRebalanced(ETH_ADDRESS);

        // Get the latest POS deposit root and guardian signature.
        (bytes32 root, bytes memory signature) = signCurrentDepositRoot(reETH.coordinator);

        vm.prank(EOA, EOA);
        reETH.coordinator.rebalanceETH(root, signature);

        // Ensure the next rebalance timestamp has increased.
        assertEq(
            reETH.coordinator.assetNextRebalanceAfter(ETH_ADDRESS), block.timestamp + reETH.coordinator.rebalanceDelay()
        );

        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reETH.withdrawalQueue.getEpochWithdrawalSummary(ETH_ADDRESS, epoch);
        assertTrue(epochSummary.settled);
        assertEq(epochSummary.assetsReceived, amount);
        assertEq(address(reETH.withdrawalQueue).balance, amount);
    }

    function test_rebalanceERC20WhenPausedReverts() public {
        reETH.coordinator.pause();

        vm.expectRevert(abi.encodeWithSelector(PausableUpgradeable.EnforcedPause.selector));
        reETH.coordinator.rebalanceERC20(address(42));
    }

    function test_rebalanceERC20SettlesWithdrawalEpochIfSufficientERC20sInDepositPool() public {
        // Ensure there is an operator to allocate to.
        addOperatorDelegators(reLST.operatorRegistry, address(reLST.rewardDistributor), 1);

        uint256 amount = 500e18;

        cbETH.approve(address(reLST.coordinator), amount);

        uint256 amountOut = reLST.coordinator.deposit(CBETH_ADDRESS, amount);
        reLST.coordinator.requestWithdrawal(CBETH_ADDRESS, amountOut);

        uint256 epoch = reLST.withdrawalQueue.getCurrentEpoch(CBETH_ADDRESS);

        vm.prank(EOA, EOA);
        reLST.coordinator.rebalanceERC20(CBETH_ADDRESS);

        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reLST.withdrawalQueue.getEpochWithdrawalSummary(CBETH_ADDRESS, epoch);
        assertTrue(epochSummary.settled);
        assertEq(cbETH.balanceOf(address(reLST.withdrawalQueue)), amount);
    }

    function test_rebalanceERC20QueuesWithdrawalEpochLowERC20BalanceInDepositPool() public {
        // Ensure there is an operator to allocate to.
        addOperatorDelegators(reLST.operatorRegistry, address(reLST.rewardDistributor), 1);

        uint256 amount = 100e18;

        cbETH.approve(address(reLST.coordinator), type(uint256).max);

        // Deposit and push the balance into EigenLayer.
        uint256 amountOut = reLST.coordinator.deposit(CBETH_ADDRESS, amount);

        vm.prank(EOA, EOA);
        reLST.coordinator.rebalanceERC20(CBETH_ADDRESS);

        // Deposit again and request a withdrawal. Following this deposit,
        // both EigenLayer and the deposit pool will have `amount` cbETH.
        reLST.coordinator.deposit(CBETH_ADDRESS, amount);
        reLST.coordinator.requestWithdrawal(CBETH_ADDRESS, amountOut + 1e18);

        skip(reLST.coordinator.rebalanceDelay());

        uint256 epoch = reLST.withdrawalQueue.getCurrentEpoch(CBETH_ADDRESS);

        vm.prank(EOA, EOA);
        reLST.coordinator.rebalanceERC20(CBETH_ADDRESS);

        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reLST.withdrawalQueue.getEpochWithdrawalSummary(CBETH_ADDRESS, epoch);
        assertFalse(epochSummary.settled);
        assertNotEq(epochSummary.aggregateRoot, bytes32(0));
        assertEq(epochSummary.assetsReceived, amount);
        assertEq(cbETH.balanceOf(address(reLST.withdrawalQueue)), amount);
    }

    function test_rebalanceERC20QueuesWithdrawalEpochNoERC20BalanceInDepositPool() public {
        // Ensure there is an operator to allocate to.
        addOperatorDelegators(reLST.operatorRegistry, address(reLST.rewardDistributor), 1);

        uint256 amount = 100e18;

        cbETH.approve(address(reLST.coordinator), type(uint256).max);

        // Deposit and push the balance into EigenLayer.
        uint256 amountOut = reLST.coordinator.deposit(CBETH_ADDRESS, amount);

        vm.prank(EOA, EOA);
        reLST.coordinator.rebalanceERC20(CBETH_ADDRESS);

        // Request a withdrawal. There is no cbETH in the deposit pool.
        reLST.coordinator.requestWithdrawal(CBETH_ADDRESS, amountOut);

        skip(reLST.coordinator.rebalanceDelay());

        uint256 epoch = reLST.withdrawalQueue.getCurrentEpoch(CBETH_ADDRESS);

        vm.prank(EOA, EOA);
        reLST.coordinator.rebalanceERC20(CBETH_ADDRESS);

        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reLST.withdrawalQueue.getEpochWithdrawalSummary(CBETH_ADDRESS, epoch);
        assertFalse(epochSummary.settled);
        assertNotEq(epochSummary.aggregateRoot, bytes32(0));
        assertEq(epochSummary.assetsReceived, 0);
        assertEq(cbETH.balanceOf(address(reLST.withdrawalQueue)), 0);
    }

    function test_rebalanceERC20CompletesWithdrawalsFromDepositPoolIfDepositToEigenLayerFails() public {
        // Ensure there is an operator to allocate to.
        addOperatorDelegators(reLST.operatorRegistry, address(reLST.rewardDistributor), 1);

        uint256 amount = 20e18;
        cbETH.approve(address(reLST.coordinator), amount);

        uint256 amountOut = reLST.coordinator.deposit(CBETH_ADDRESS, amount);
        reLST.coordinator.requestWithdrawal(CBETH_ADDRESS, amountOut);

        // Make the deposit revert.
        vm.mockCallRevert(
            address(reLST.depositPool),
            abi.encodeWithSelector(IRioLRTDepositPool.depositBalanceIntoEigenLayer.selector, CBETH_ADDRESS),
            abi.encode('StrategyBaseTVLLimits: max per deposit exceeded')
        );

        uint256 epoch = reLST.withdrawalQueue.getCurrentEpoch(CBETH_ADDRESS);

        vm.expectEmit(true, false, false, true, address(reLST.coordinator));
        emit IRioLRTCoordinator.PartiallyRebalanced(CBETH_ADDRESS);

        vm.prank(EOA, EOA);
        reLST.coordinator.rebalanceERC20(CBETH_ADDRESS);

        // Ensure the next rebalance timestamp has increased.
        assertEq(
            reLST.coordinator.assetNextRebalanceAfter(CBETH_ADDRESS),
            block.timestamp + reLST.coordinator.rebalanceDelay()
        );

        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reLST.withdrawalQueue.getEpochWithdrawalSummary(CBETH_ADDRESS, epoch);
        assertTrue(epochSummary.settled);
        assertEq(epochSummary.assetsReceived, amount);
        assertEq(cbETH.balanceOf(address(reLST.withdrawalQueue)), amount);
    }

    function test_inflationAttackFails() public {
        address attacker = address(0xa);
        address victim = address(0xb);

        vm.deal(attacker, 100 ether);
        vm.deal(victim, 100 ether);

        // Attaker deposits 1 wei to mint 1 share.
        vm.prank(attacker);
        reETH.coordinator.depositETH{value: 1}();

        // Attaker frontruns victim's deposit, sending 10 ETH to the deposit pool.
        vm.prank(attacker);
        (bool success,) = address(reETH.depositPool).call{value: 10 ether}('');
        assertTrue(success);

        // The victim deposits 10 ETH.
        vm.prank(victim);
        uint256 reETHOut = reETH.coordinator.depositETH{value: 10 ether}();

        vm.prank(victim);
        reETH.coordinator.requestWithdrawal(ETH_ADDRESS, reETHOut);

        // Get the latest POS deposit root and guardian signature.
        (bytes32 root, bytes memory signature) = signCurrentDepositRoot(reETH.coordinator);

        vm.prank(EOA, EOA);
        reETH.coordinator.rebalanceETH(root, signature);

        vm.prank(victim);
        uint256 amountOut = reETH.withdrawalQueue.claimWithdrawalsForEpoch(
            IRioLRTWithdrawalQueue.ClaimRequest({asset: ETH_ADDRESS, epoch: 0})
        );
        assertApproxEqAbs(amountOut, 10 ether, 1e9); // 1 gwei tolerance
    }

    receive() external payable {}
}
