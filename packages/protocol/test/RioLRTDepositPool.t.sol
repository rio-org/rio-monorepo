// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {ETH_ADDRESS, ETH_DEPOSIT_SIZE} from 'contracts/utils/Constants.sol';
import {RioLRTCore} from 'contracts/restaking/base/RioLRTCore.sol';
import {RioDeployer} from 'test/utils/RioDeployer.sol';

contract RioLRTDepositPoolTest is RioDeployer {
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
}