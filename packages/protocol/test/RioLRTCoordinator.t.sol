// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {IRioLRTWithdrawalQueue} from 'contracts/interfaces/IRioLRTWithdrawalQueue.sol';
import {IRioLRTCoordinator} from 'contracts/interfaces/IRioLRTCoordinator.sol';
import {ETH_ADDRESS, ETH_DEPOSIT_SIZE} from 'contracts/utils/Constants.sol';
import {RioDeployer} from 'test/utils/RioDeployer.sol';

contract RioLRTCoordinatorTest is RioDeployer {
    TestLRTDeployment public reETH;
    TestLRTDeployment public reLST;

    function setUp() public {
        deployRio();

        (reETH,) = issueRestakedETH();
        (reLST,) = issueRestakedLST();
    }

    function test_depositEtherNotSupportedReverts() public {
        vm.expectRevert(abi.encodeWithSelector(IRioLRTCoordinator.ASSET_NOT_SUPPORTED.selector, ETH_ADDRESS));
        reLST.coordinator.depositETH{value: 1 ether}();
    }

    function test_depositEtherZeroValueReverts() public {
        vm.expectRevert(abi.encodeWithSelector(IRioLRTCoordinator.AMOUNT_MUST_BE_GREATER_THAN_ZERO.selector));
        reETH.coordinator.depositETH{value: 0}();
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

    function test_requestWithdrawalEtherNotSupportedReverts() public {
        vm.expectRevert(abi.encodeWithSelector(IRioLRTCoordinator.ASSET_NOT_SUPPORTED.selector, ETH_ADDRESS));
        reLST.coordinator.requestWithdrawal(ETH_ADDRESS, 1 ether);
    }

    function test_requestEtherWithdrawalZeroValueReverts() public {
        vm.expectRevert(abi.encodeWithSelector(IRioLRTCoordinator.AMOUNT_MUST_BE_GREATER_THAN_ZERO.selector));
        reETH.coordinator.requestWithdrawal(ETH_ADDRESS, 0);
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

    function test_requestWithdrawalERC20NotSupportedReverts() public {
        vm.expectRevert(abi.encodeWithSelector(IRioLRTCoordinator.ASSET_NOT_SUPPORTED.selector, address(42)));
        reLST.coordinator.requestWithdrawal(address(42), 20e18);
    }

    function test_requestERC20WithdrawalZeroValueReverts() public {
        vm.expectRevert(abi.encodeWithSelector(IRioLRTCoordinator.AMOUNT_MUST_BE_GREATER_THAN_ZERO.selector));
        reLST.coordinator.requestWithdrawal(CBETH_ADDRESS, 0);
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
        assertEq(reLST.withdrawalQueue.getSharesOwedInCurrentEpoch(CBETH_ADDRESS), amount);

        assertFalse(epochSummary.settled);
        assertEq(epochSummary.sharesOwed, amount);
        assertEq(epochSummary.amountToBurnAtSettlement, amountOut);

        assertFalse(userSummary.claimed);
        assertEq(userSummary.sharesOwed, amount);
    }

    function test_setRebalanceDelayNonOwnerReverts() public {
        vm.prank(address(42));
        vm.expectRevert(abi.encodeWithSelector(OwnableUpgradeable.OwnableUnauthorizedAccount.selector, address(42)));
        reETH.coordinator.setRebalanceDelay(1);
    }

    function test_setRebalanceDelay() public {
        reETH.coordinator.setRebalanceDelay(99);
        assertEq(reETH.coordinator.rebalanceDelay(), 99);
    }

    function test_rebalanceNotNeededReverts() public {
        // No withdrawals or deposits have been made, so no rebalance is needed.
        vm.expectRevert(abi.encodeWithSelector(IRioLRTCoordinator.NO_REBALANCE_NEEDED.selector));
        reETH.coordinator.rebalance(ETH_ADDRESS);
    }

    function test_rebalanceDelayNotMetReverts() public {
        // Ensure there is an operator to allocate to.
        addOperatorDelegators(reETH.operatorRegistry, address(reETH.rewardDistributor), 1);

        reETH.coordinator.depositETH{value: ETH_DEPOSIT_SIZE}();
        reETH.coordinator.rebalance(ETH_ADDRESS);

        vm.expectRevert(abi.encodeWithSelector(IRioLRTCoordinator.REBALANCE_DELAY_NOT_MET.selector));
        reETH.coordinator.rebalance(ETH_ADDRESS);
    }

    function test_rebalanceSettlesWithdrawalEpochIfSufficientEtherInDepositPool() public {
        // Ensure there is an operator to allocate to.
        addOperatorDelegators(reETH.operatorRegistry, address(reETH.rewardDistributor), 1);

        uint256 amount = ETH_DEPOSIT_SIZE * 10;
        uint256 amountOut = reETH.coordinator.depositETH{value: amount}();
        reETH.coordinator.requestWithdrawal(ETH_ADDRESS, amountOut);

        uint256 epoch = reETH.withdrawalQueue.getCurrentEpoch(ETH_ADDRESS);
        reETH.coordinator.rebalance(ETH_ADDRESS);

        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reETH.withdrawalQueue.getEpochWithdrawalSummary(ETH_ADDRESS, epoch);
        assertTrue(epochSummary.settled);
        assertEq(epochSummary.assetsReceived, amount);
        assertEq(address(reETH.withdrawalQueue).balance, amount);
    }

    function test_rebalanceQueuesWithdrawalEpochLowEtherBalanceInDepositPool() public {
        // Ensure there is an operator to allocate to.
        addOperatorDelegators(reETH.operatorRegistry, address(reETH.rewardDistributor), 1);

        // Deposit and push the balance into EigenLayer.
        reETH.coordinator.depositETH{value: ETH_DEPOSIT_SIZE}();
        reETH.coordinator.rebalance(ETH_ADDRESS);

        // Verify validator withdrawal credentials.
        verifyCredentialsForValidators(reETH.operatorRegistry, 1, 1);

        // Deposit again and request a withdrawal. Following this deposit,
        // both EigenLayer and the deposit pool will have 32 ETH.
        reETH.coordinator.depositETH{value: ETH_DEPOSIT_SIZE}();
        reETH.coordinator.requestWithdrawal(ETH_ADDRESS, ETH_DEPOSIT_SIZE + 1 ether);

        skip(reETH.coordinator.rebalanceDelay());

        uint256 epoch = reETH.withdrawalQueue.getCurrentEpoch(ETH_ADDRESS);
        reETH.coordinator.rebalance(ETH_ADDRESS);

        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reETH.withdrawalQueue.getEpochWithdrawalSummary(ETH_ADDRESS, epoch);
        assertFalse(epochSummary.settled);
        assertNotEq(epochSummary.aggregateRoot, bytes32(0));
        assertEq(epochSummary.assetsReceived, ETH_DEPOSIT_SIZE);
        assertEq(address(reETH.withdrawalQueue).balance, ETH_DEPOSIT_SIZE);
    }

    function test_rebalanceQueuesWithdrawalEpochNoEtherBalanceInDepositPool() public {
        // Ensure there is an operator to allocate to.
        addOperatorDelegators(reETH.operatorRegistry, address(reETH.rewardDistributor), 1);

        // Deposit and push the balance into EigenLayer.
        reETH.coordinator.depositETH{value: ETH_DEPOSIT_SIZE}();
        reETH.coordinator.rebalance(ETH_ADDRESS);

        // Verify validator withdrawal credentials.
        verifyCredentialsForValidators(reETH.operatorRegistry, 1, 1);

        // Request a withdrawal. There is no ETH in the deposit pool.
        reETH.coordinator.requestWithdrawal(ETH_ADDRESS, ETH_DEPOSIT_SIZE);

        skip(reETH.coordinator.rebalanceDelay());

        uint256 epoch = reETH.withdrawalQueue.getCurrentEpoch(ETH_ADDRESS);
        reETH.coordinator.rebalance(ETH_ADDRESS);

        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reETH.withdrawalQueue.getEpochWithdrawalSummary(ETH_ADDRESS, epoch);
        assertFalse(epochSummary.settled);
        assertNotEq(epochSummary.aggregateRoot, bytes32(0));
        assertEq(epochSummary.assetsReceived, 0);
        assertEq(address(reETH.withdrawalQueue).balance, 0);
    }

    function test_rebalanceSettlesWithdrawalEpochIfSufficientERC20sInDepositPool() public {
        // Ensure there is an operator to allocate to.
        addOperatorDelegators(reLST.operatorRegistry, address(reLST.rewardDistributor), 1);

        uint256 amount = 1_000e18;

        cbETH.approve(address(reLST.coordinator), amount);

        uint256 amountOut = reLST.coordinator.deposit(CBETH_ADDRESS, amount);
        reLST.coordinator.requestWithdrawal(CBETH_ADDRESS, amountOut);

        uint256 epoch = reLST.withdrawalQueue.getCurrentEpoch(CBETH_ADDRESS);
        reLST.coordinator.rebalance(CBETH_ADDRESS);

        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reLST.withdrawalQueue.getEpochWithdrawalSummary(CBETH_ADDRESS, epoch);
        assertTrue(epochSummary.settled);
        assertEq(cbETH.balanceOf(address(reLST.withdrawalQueue)), amount);
    }

    function test_rebalanceQueuesWithdrawalEpochLowERC20BalanceInDepositPool() public {
        // Ensure there is an operator to allocate to.
        addOperatorDelegators(reLST.operatorRegistry, address(reLST.rewardDistributor), 1);

        uint256 amount = 100e18;

        cbETH.approve(address(reLST.coordinator), type(uint256).max);

        // Deposit and push the balance into EigenLayer.
        uint256 amountOut = reLST.coordinator.deposit(CBETH_ADDRESS, amount);
        reLST.coordinator.rebalance(CBETH_ADDRESS);

        // Deposit again and request a withdrawal. Following this deposit,
        // both EigenLayer and the deposit pool will have `amount` cbETH.
        reLST.coordinator.deposit(CBETH_ADDRESS, amount);
        reLST.coordinator.requestWithdrawal(CBETH_ADDRESS, amountOut + 1e18);

        skip(reLST.coordinator.rebalanceDelay());

        uint256 epoch = reLST.withdrawalQueue.getCurrentEpoch(CBETH_ADDRESS);
        reLST.coordinator.rebalance(CBETH_ADDRESS);

        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reLST.withdrawalQueue.getEpochWithdrawalSummary(CBETH_ADDRESS, epoch);
        assertFalse(epochSummary.settled);
        assertNotEq(epochSummary.aggregateRoot, bytes32(0));
        assertEq(epochSummary.assetsReceived, amount);
        assertEq(cbETH.balanceOf(address(reLST.withdrawalQueue)), amount);
    }

    function test_rebalanceQueuesWithdrawalEpochNoERC20BalanceInDepositPool() public {
        // Ensure there is an operator to allocate to.
        addOperatorDelegators(reLST.operatorRegistry, address(reLST.rewardDistributor), 1);

        uint256 amount = 100e18;

        cbETH.approve(address(reLST.coordinator), type(uint256).max);

        // Deposit and push the balance into EigenLayer.
        uint256 amountOut = reLST.coordinator.deposit(CBETH_ADDRESS, amount);
        reLST.coordinator.rebalance(CBETH_ADDRESS);

        // Request a withdrawal. There is no cbETH in the deposit pool.
        reLST.coordinator.requestWithdrawal(CBETH_ADDRESS, amountOut);

        skip(reLST.coordinator.rebalanceDelay());

        uint256 epoch = reLST.withdrawalQueue.getCurrentEpoch(CBETH_ADDRESS);
        reLST.coordinator.rebalance(CBETH_ADDRESS);

        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reLST.withdrawalQueue.getEpochWithdrawalSummary(CBETH_ADDRESS, epoch);
        assertFalse(epochSummary.settled);
        assertNotEq(epochSummary.aggregateRoot, bytes32(0));
        assertEq(epochSummary.assetsReceived, 0);
        assertEq(cbETH.balanceOf(address(reLST.withdrawalQueue)), 0);
    }

    receive() external payable {}
}
