// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {IDelegationManager} from 'contracts/interfaces/eigenlayer/IDelegationManager.sol';
import {BEACON_CHAIN_STRATEGY, ETH_ADDRESS, ETH_DEPOSIT_SIZE} from 'contracts/utils/Constants.sol';
import {IRioLRTOperatorDelegator} from 'contracts/interfaces/IRioLRTOperatorDelegator.sol';
import {IRioLRTOperatorRegistry} from 'contracts/interfaces/IRioLRTOperatorRegistry.sol';
import {IRioLRTDepositPool} from 'contracts/interfaces/IRioLRTDepositPool.sol';
import {RioLRTCore} from 'contracts/restaking/base/RioLRTCore.sol';
import {RioDeployer} from 'test/utils/RioDeployer.sol';
import {Array} from 'contracts/utils/Array.sol';

contract RioLRTDepositPoolTest is RioDeployer {
    using Array for *;

    TestLRTDeployment public reETH;
    TestLRTDeployment public reLST;

    function setUp() public {
        deployRio();

        (reETH,) = issueRestakedETH();
        (reLST,) = issueRestakedLST();
    }

    function test_depositBalanceIntoEigenLayerNonCoordinatorReverts() public {
        vm.prank(address(42));
        vm.expectRevert(abi.encodeWithSelector(RioLRTCore.ONLY_COORDINATOR.selector));
        reETH.depositPool.depositBalanceIntoEigenLayer(ETH_ADDRESS);
    }

    function test_depositBalanceIntoEigenLayerZeroEtherExitsEarly() public {
        vm.prank(address(reETH.coordinator));
        assertEq(reETH.depositPool.depositBalanceIntoEigenLayer(ETH_ADDRESS), 0);
    }

    function test_depositBalanceIntoEigenLayerEtherBelowDepositSizeExitsEarly() public {
        uint256 amount = ETH_DEPOSIT_SIZE - address(reETH.depositPool).balance - 1;

        vm.deal(address(reETH.depositPool), amount);
        vm.prank(address(reETH.coordinator));
        assertEq(reETH.depositPool.depositBalanceIntoEigenLayer(ETH_ADDRESS), 0);
    }

    function test_depositBalanceIntoEigenLayerEtherDeposit() public {
        uint256 initialBalance = address(reETH.depositPool).balance;
        uint256 amount = (ETH_DEPOSIT_SIZE * 40) + 2 ether - initialBalance;

        addOperatorDelegators(reETH.operatorRegistry, address(reETH.rewardDistributor), 10);

        vm.deal(address(reETH.depositPool), amount);
        vm.prank(address(reETH.coordinator));
        assertEq(reETH.depositPool.depositBalanceIntoEigenLayer(ETH_ADDRESS), amount - amount % 32 ether);
    }

    function test_depositBalanceIntoEigenLayerZeroERC20sExitsEarly() public {
        vm.prank(address(reLST.coordinator));
        assertEq(reLST.depositPool.depositBalanceIntoEigenLayer(CBETH_ADDRESS), 0);
    }

    function test_depositBalanceIntoEigenLayerERC20Deposit() public {
        uint256 initialBalance = cbETH.balanceOf(address(reLST.depositPool));
        uint256 amount = 1999e18;

        addOperatorDelegators(reLST.operatorRegistry, address(reLST.rewardDistributor), 10);
        cbETH.mint(address(reLST.depositPool), amount);

        vm.prank(address(reLST.coordinator));
        assertEq(reLST.depositPool.depositBalanceIntoEigenLayer(CBETH_ADDRESS), amount + initialBalance);
        assertEq(cbETH.balanceOf(CBETH_STRATEGY), amount + initialBalance);
    }

    function test_transferMaxAssetsForSharesNonCoordinatorReverts() public {
        vm.prank(address(42));
        vm.expectRevert(abi.encodeWithSelector(RioLRTCore.ONLY_COORDINATOR.selector));
        reETH.depositPool.transferMaxAssetsForShares(ETH_ADDRESS, 0, address(0));
    }

    function test_transferMaxAssetsForSharesNoEtherExitsEarly() public {
        vm.deal(address(reETH.depositPool), 0); // Zero out deposit pool balance.

        vm.prank(address(reETH.coordinator));
        (uint256 assetsSent, uint256 sharesSent) =
            reETH.depositPool.transferMaxAssetsForShares(ETH_ADDRESS, 1 ether, address(reETH.withdrawalQueue));

        assertEq(assetsSent, 0);
        assertEq(sharesSent, 0);
    }

    function test_transferMaxAssetsForSharesHasPartialEtherAmount() public {
        uint256 amount = 11 ether;

        vm.deal(address(reETH.depositPool), amount / 2);
        vm.prank(address(reETH.coordinator));
        (uint256 assetsSent, uint256 sharesSent) =
            reETH.depositPool.transferMaxAssetsForShares(ETH_ADDRESS, amount, address(reETH.withdrawalQueue));

        assertEq(assetsSent, amount / 2);
        assertEq(sharesSent, amount / 2);
    }

    function test_transferMaxAssetsForSharesHasFullEtherAmount() public {
        uint256 amount = 11 ether;

        vm.deal(address(reETH.depositPool), amount);
        vm.prank(address(reETH.coordinator));
        (uint256 assetsSent, uint256 sharesSent) =
            reETH.depositPool.transferMaxAssetsForShares(ETH_ADDRESS, amount, address(reETH.withdrawalQueue));

        assertEq(assetsSent, amount);
        assertEq(sharesSent, amount);
    }

    function test_transferMaxAssetsForSharesNoERC20sExitsEarly() public {
        vm.prank(address(reLST.coordinator));
        (uint256 assetsSent, uint256 sharesSent) =
            reLST.depositPool.transferMaxAssetsForShares(CBETH_ADDRESS, 1e18, address(reLST.withdrawalQueue));

        assertEq(assetsSent, 0);
        assertEq(sharesSent, 0);
    }

    function test_transferMaxAssetsForSharesHasPartialERC20Amount() public {
        uint256 amount = 221e18;

        cbETH.mint(address(reLST.depositPool), amount / 2);

        vm.prank(address(reLST.coordinator));
        (uint256 assetsSent, uint256 sharesSent) =
            reLST.depositPool.transferMaxAssetsForShares(CBETH_ADDRESS, amount, address(reETH.withdrawalQueue));
        assertEq(assetsSent, amount / 2);
        assertEq(sharesSent, amount / 2);
    }

    function test_transferMaxAssetsForSharesHasFullERC20Amount() public {
        uint256 amount = 221e18;

        cbETH.mint(address(reLST.depositPool), amount);

        vm.prank(address(reLST.coordinator));
        (uint256 assetsSent, uint256 sharesSent) =
            reLST.depositPool.transferMaxAssetsForShares(CBETH_ADDRESS, amount, address(reETH.withdrawalQueue));
        assertEq(assetsSent, amount);
        assertEq(sharesSent, amount);
    }

    function test_completeOperatorWithdrawalForAssetInvalidStakerReverts() public {
        vm.expectRevert(abi.encodeWithSelector(IRioLRTDepositPool.INVALID_WITHDRAWAL_ORIGIN.selector));
        reETH.depositPool.completeOperatorWithdrawalForAsset(
            ETH_ADDRESS,
            1,
            IDelegationManager.Withdrawal({
                staker: address(42),
                delegatedTo: address(1),
                withdrawer: address(1),
                nonce: 0,
                startBlock: 1,
                strategies: BEACON_CHAIN_STRATEGY.toArray(),
                shares: 1.toArray()
            }),
            0
        );
    }

    function test_completeOperatorETHExitToDepositPool() public {
        uint8 operatorId = addOperatorDelegator(reETH.operatorRegistry, address(reETH.rewardDistributor));
        address operatorDelegator = reETH.operatorRegistry.getOperatorDetails(operatorId).delegator;

        uint256 AMOUNT = 96 ether;

        // Allocate ETH.
        reETH.coordinator.depositETH{value: AMOUNT}();

        // Push funds into EigenLayer.
        vm.prank(EOA, EOA);
        reETH.coordinator.rebalance(ETH_ADDRESS);

        // Verify validator withdrawal credentials.
        uint40[] memory validatorIndices =
            verifyCredentialsForValidators(reETH.operatorRegistry, operatorId, uint8(AMOUNT / 32 ether));

        // Queue an ETH exit.
        reETH.operatorRegistry.setOperatorValidatorCap(operatorId, 0);

        // Actually exit the validators.
        verifyAndProcessWithdrawalsForValidatorIndexes(operatorDelegator, validatorIndices);

        // Complete the withdrawal to the deposit pool.
        uint256 ethQueuedBefore = IRioLRTOperatorDelegator(operatorDelegator).getETHQueuedForWithdrawal();
        uint256 depositPoolBalanceBefore = address(reETH.depositPool).balance;
        reETH.depositPool.completeOperatorWithdrawalForAsset(
            ETH_ADDRESS,
            operatorId,
            IDelegationManager.Withdrawal({
                staker: operatorDelegator,
                delegatedTo: address(1),
                withdrawer: address(reETH.depositPool),
                nonce: 0,
                startBlock: 1,
                strategies: BEACON_CHAIN_STRATEGY.toArray(),
                shares: AMOUNT.toArray()
            }),
            0
        );

        assertEq(IRioLRTOperatorDelegator(operatorDelegator).getETHQueuedForWithdrawal(), ethQueuedBefore - AMOUNT);
        assertEq(address(reETH.depositPool).balance, depositPoolBalanceBefore + AMOUNT);
    }

    function test_completeOperatorERC20ExitToDepositPool() public {
        uint8 operatorId = addOperatorDelegator(reLST.operatorRegistry, address(reLST.rewardDistributor));
        address operatorDelegator = reLST.operatorRegistry.getOperatorDetails(operatorId).delegator;

        uint256 AMOUNT = 195e18;

        // Allocate to cbETH strategy.
        cbETH.approve(address(reLST.coordinator), type(uint256).max);
        reLST.coordinator.deposit(CBETH_ADDRESS, AMOUNT);

        // Push funds into EigenLayer.
        vm.prank(EOA, EOA);
        reLST.coordinator.rebalance(CBETH_ADDRESS);

        // Queue the cbETH exit.
        IRioLRTOperatorRegistry.StrategyShareCap[] memory strategyShareCaps =
            new IRioLRTOperatorRegistry.StrategyShareCap[](1);
        strategyShareCaps[0] = IRioLRTOperatorRegistry.StrategyShareCap({strategy: CBETH_STRATEGY, cap: 0});
        reLST.operatorRegistry.setOperatorStrategyShareCaps(operatorId, strategyShareCaps);

        // Complete the withdrawal to the deposit pool.
        uint256 sharesHeldBefore = reLST.assetRegistry.getAssetSharesHeld(CBETH_ADDRESS);
        uint256 depositPoolBalanceBefore = cbETH.balanceOf(address(reLST.depositPool));
        reLST.depositPool.completeOperatorWithdrawalForAsset(
            CBETH_ADDRESS,
            operatorId,
            IDelegationManager.Withdrawal({
                staker: operatorDelegator,
                delegatedTo: address(1),
                withdrawer: address(reLST.depositPool),
                nonce: 0,
                startBlock: 1,
                strategies: CBETH_STRATEGY.toArray(),
                shares: AMOUNT.toArray()
            }),
            0
        );

        assertEq(reLST.assetRegistry.getAssetSharesHeld(CBETH_ADDRESS), sharesHeldBefore - AMOUNT);
        assertEq(cbETH.balanceOf(address(reLST.depositPool)), depositPoolBalanceBefore + AMOUNT);
    }
}
