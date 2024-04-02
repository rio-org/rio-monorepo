// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {IRioLRTRewardDistributor} from 'contracts/interfaces/IRioLRTRewardDistributor.sol';
import {RioDeployer} from 'test/utils/RioDeployer.sol';

contract RioLRTRewardDistributorTest is RioDeployer {
    TestLRTDeployment public reETH;
    TestLRTDeployment public reLST;

    function setUp() public {
        deployRio();

        (reETH,) = issueRestakedETH();
        (reLST,) = issueRestakedLST();
    }

    function test_setTreasuryAndOperatorETHValidatorRewardShareBPSNonOwnerReverts() public {
        vm.prank(address(42));
        vm.expectRevert(abi.encodeWithSelector(OwnableUpgradeable.OwnableUnauthorizedAccount.selector, address(42)));
        reETH.rewardDistributor.setTreasuryAndOperatorETHValidatorRewardShareBPS(0, 0);
    }

    function test_setTreasuryAndOperatorETHValidatorRewardShareBPSAboveMaxReverts() public {
        vm.expectRevert(abi.encodeWithSelector(IRioLRTRewardDistributor.ETH_VALIDATOR_SHARE_BPS_TOO_HIGH.selector));
        reETH.rewardDistributor.setTreasuryAndOperatorETHValidatorRewardShareBPS(9_999, 2);
    }

    function test_setTreasuryAndOperatorETHValidatorRewardShareBPS() public {
        reETH.rewardDistributor.setTreasuryAndOperatorETHValidatorRewardShareBPS(50, 50);
        assertEq(reETH.rewardDistributor.treasuryETHValidatorRewardShareBPS(), 50);
        assertEq(reETH.rewardDistributor.operatorETHValidatorRewardShareBPS(), 50);
    }

    function test_setTreasuryETHValidatorRewardShareBPSNonOwnerReverts() public {
        vm.prank(address(42));
        vm.expectRevert(abi.encodeWithSelector(OwnableUpgradeable.OwnableUnauthorizedAccount.selector, address(42)));
        reETH.rewardDistributor.setTreasuryETHValidatorRewardShareBPS(0);
    }

    function test_setTreasuryETHValidatorRewardShareBPSAboveMaxReverts() public {
        vm.expectRevert(
            abi.encodeWithSelector(IRioLRTRewardDistributor.TREASURY_ETH_VALIDATOR_SHARE_BPS_TOO_HIGH.selector)
        );
        reETH.rewardDistributor.setTreasuryETHValidatorRewardShareBPS(10_000 + 1);
    }

    function test_setTreasuryETHValidatorRewardShareBPS() public {
        reETH.rewardDistributor.setTreasuryETHValidatorRewardShareBPS(50);
        assertEq(reETH.rewardDistributor.treasuryETHValidatorRewardShareBPS(), 50);
    }

    function test_setOperatorETHValidatorRewardShareBPSNonOwnerReverts() public {
        vm.prank(address(42));
        vm.expectRevert(abi.encodeWithSelector(OwnableUpgradeable.OwnableUnauthorizedAccount.selector, address(42)));
        reETH.rewardDistributor.setOperatorETHValidatorRewardShareBPS(0);
    }

    function test_setOperatorETHValidatorRewardShareBPSAboveMaxReverts() public {
        vm.expectRevert(
            abi.encodeWithSelector(IRioLRTRewardDistributor.OPERATOR_ETH_VALIDATOR_SHARE_BPS_TOO_HIGH.selector)
        );
        reETH.rewardDistributor.setOperatorETHValidatorRewardShareBPS(10_000 + 1);
    }

    function test_setOperatorETHValidatorRewardShareBPS() public {
        reETH.rewardDistributor.setOperatorETHValidatorRewardShareBPS(50);
        assertEq(reETH.rewardDistributor.operatorETHValidatorRewardShareBPS(), 50);
    }

    function test_receiveFunctionCorrectlySplitsEther() public {
        vm.deal(address(reETH.depositPool), 0); // Zero out deposit pool balance.

        uint256 amount = 16.2 ether;

        reETH.rewardDistributor.setTreasuryETHValidatorRewardShareBPS(400);
        reETH.rewardDistributor.setOperatorETHValidatorRewardShareBPS(600);

        (bool success,) = address(reETH.rewardDistributor).call{value: amount}('');
        assertTrue(success);

        uint256 EXPECTED_TREASURY_BALANCE = (amount * 4) / 100;
        uint256 EXPECTED_OPERATOR_BALANCE = (amount * 6) / 100;

        assertEq(REETH_TREASURY.balance, EXPECTED_TREASURY_BALANCE);
        assertEq(REETH_OPERATOR_REWARD_POOL.balance, EXPECTED_OPERATOR_BALANCE);
        assertEq(address(reETH.depositPool).balance, amount - EXPECTED_TREASURY_BALANCE - EXPECTED_OPERATOR_BALANCE);
    }
}
