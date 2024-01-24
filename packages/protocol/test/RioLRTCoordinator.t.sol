// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

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
        reLST.coordinator.deposit(address(rETH), 0);
    }

    function test_depositERC20() public {
        rETH.approve(address(reLST.coordinator), 20e18);
        reLST.coordinator.deposit(address(rETH), 20e18);

        uint256 price = reLST.assetRegistry.getAssetPrice(address(rETH));
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
        reLST.coordinator.requestWithdrawal(address(rETH), 0);
    }

    function test_requestERC20Withdrawal() public {
        address _rETH = address(rETH);
        uint256 amount = 50e18;

        rETH.approve(address(reLST.coordinator), amount);
        uint256 amountOut = reLST.coordinator.deposit(_rETH, amount);

        reLST.coordinator.requestWithdrawal(_rETH, amountOut);

        uint256 currentEpoch = reLST.withdrawalQueue.getCurrentEpoch(_rETH);
        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reLST.withdrawalQueue.getEpochWithdrawalSummary(_rETH, currentEpoch);
        IRioLRTWithdrawalQueue.UserWithdrawalSummary memory userSummary =
            reLST.withdrawalQueue.getUserWithdrawalSummary(_rETH, currentEpoch, address(this));

        assertEq(reLST.token.balanceOf(address(this)), 0);
        assertEq(reLST.withdrawalQueue.getSharesOwedInCurrentEpoch(_rETH), amount);

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

        address _rETH = address(rETH);
        rETH.approve(address(reLST.coordinator), amount);

        uint256 amountOut = reLST.coordinator.deposit(_rETH, amount);
        reLST.coordinator.requestWithdrawal(_rETH, amountOut);

        uint256 epoch = reLST.withdrawalQueue.getCurrentEpoch(_rETH);
        reLST.coordinator.rebalance(_rETH);

        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reLST.withdrawalQueue.getEpochWithdrawalSummary(_rETH, epoch);
        assertTrue(epochSummary.settled);
        assertEq(rETH.balanceOf(address(reLST.withdrawalQueue)), amount);
    }

    function test_rebalanceQueuesWithdrawalEpochLowERC20BalanceInDepositPool() public {
        // Ensure there is an operator to allocate to.
        addOperatorDelegators(reLST.operatorRegistry, address(reLST.rewardDistributor), 1);

        uint256 amount = 100e18;

        address _rETH = address(rETH);
        rETH.approve(address(reLST.coordinator), type(uint256).max);

        // Deposit and push the balance into EigenLayer.
        uint256 amountOut = reLST.coordinator.deposit(_rETH, amount);
        reLST.coordinator.rebalance(_rETH);

        // Deposit again and request a withdrawal. Following this deposit,
        // both EigenLayer and the deposit pool will have `amount` rETH.
        reLST.coordinator.deposit(_rETH, amount);
        reLST.coordinator.requestWithdrawal(_rETH, amountOut + 1e18);

        skip(reLST.coordinator.rebalanceDelay());

        uint256 epoch = reLST.withdrawalQueue.getCurrentEpoch(_rETH);
        reLST.coordinator.rebalance(_rETH);

        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reLST.withdrawalQueue.getEpochWithdrawalSummary(_rETH, epoch);
        assertFalse(epochSummary.settled);
        assertNotEq(epochSummary.aggregateRoot, bytes32(0));
        assertEq(epochSummary.assetsReceived, amount);
        assertEq(rETH.balanceOf(address(reLST.withdrawalQueue)), amount);
    }

    function test_rebalanceQueuesWithdrawalEpochNoERC20BalanceInDepositPool() public {
        // Ensure there is an operator to allocate to.
        addOperatorDelegators(reLST.operatorRegistry, address(reLST.rewardDistributor), 1);

        uint256 amount = 100e18;

        address _rETH = address(rETH);
        rETH.approve(address(reLST.coordinator), type(uint256).max);

        // Deposit and push the balance into EigenLayer.
        uint256 amountOut = reLST.coordinator.deposit(_rETH, amount);
        reLST.coordinator.rebalance(_rETH);

        // Request a withdrawal. There is no rETH in the deposit pool.
        reLST.coordinator.requestWithdrawal(_rETH, amountOut);

        skip(reLST.coordinator.rebalanceDelay());

        uint256 epoch = reLST.withdrawalQueue.getCurrentEpoch(_rETH);
        reLST.coordinator.rebalance(_rETH);

        IRioLRTWithdrawalQueue.EpochWithdrawalSummary memory epochSummary =
            reLST.withdrawalQueue.getEpochWithdrawalSummary(_rETH, epoch);
        assertFalse(epochSummary.settled);
        assertNotEq(epochSummary.aggregateRoot, bytes32(0));
        assertEq(epochSummary.assetsReceived, 0);
        assertEq(rETH.balanceOf(address(reLST.withdrawalQueue)), 0);
    }

    receive() external payable {}
}
