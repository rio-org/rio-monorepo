// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {MockERC20} from '@solady/../test/utils/mocks/MockERC20.sol';
import {ETH_ADDRESS} from 'contracts/utils/Constants.sol';
import {Asset} from 'contracts/utils/Asset.sol';
import {Test} from 'forge-std/Test.sol';

contract AssetTest is Test {
    using Asset for *;

    function test_getSelfBalanceEther() public {
        vm.deal(address(this), 111e18);
        assertEq(ETH_ADDRESS.getSelfBalance(), 111e18);
    }

    function test_getSelfBalanceERC20() public {
        MockERC20 token = new MockERC20('Test', 'TEST', 18);
        token.mint(address(this), 222e18);
        assertEq(address(token).getSelfBalance(), 222e18);
    }

    function test_transferToEther() public {
        address recipient = address(42);

        ETH_ADDRESS.transferTo(recipient, 333e18);
        assertEq(recipient.balance, 333e18);
    }

    function test_transferToERC20() public {
        MockERC20 token = new MockERC20('Test', 'TEST', 18);
        token.mint(address(this), 333e18);

        address recipient = address(42);

        address(token).transferTo(recipient, 333e18);
        assertEq(token.balanceOf(recipient), 333e18);
    }

    function test_transferETH() public {
        address recipient = address(42);

        recipient.transferETH(555e18);
        assertEq(recipient.balance, 555e18);
    }

    function test_toWei() public {
        assertEq(199999e9.toWei(), 199999e18);
    }

    function test_toGwei() public {
        assertEq(18.312123 ether.toGwei(), 18312123000);
    }

    function test_reducePrecisionToGwei() public {
        assertEq(123456789123456789123.reducePrecisionToGwei(), 123456789123000000000);
    }
}
