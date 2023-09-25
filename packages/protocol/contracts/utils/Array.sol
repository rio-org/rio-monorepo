// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IERC20} from '@balancer-v2/contracts/interfaces/contracts/solidity-utils/openzeppelin/IERC20.sol';
import {IERC20 as IOpenZeppelinERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {IStrategy} from 'contracts/interfaces/eigenlayer/IStrategy.sol';

/// @title Array utility functions
library Array {
    /// @notice Convert a `uint256` element to an array.
    /// @param element The element to convert.
    function toArray(uint256 element) internal pure returns (uint256[] memory array) {
        array = new uint256[](1);
        array[0] = element;
    }

    /// @notice Convert an `IStrategy` element to an array.
    /// @param element The element to convert.
    function toArray(IStrategy element) internal pure returns (IStrategy[] memory array) {
        array = new IStrategy[](1);
        array[0] = element;
    }

    /// @notice Convert an `IERC20` element to an array.
    /// @param element The element to convert.
    function toArray(IERC20 element) internal pure returns (IERC20[] memory array) {
        array = new IERC20[](1);
        array[0] = element;
    }

    /// @notice Convert an `IERC20` element to an `IOpenZeppelinERC20` array.
    /// @param element The element to convert.
    function toArray(address element) internal pure returns (IOpenZeppelinERC20[] memory array) {
        array = new IOpenZeppelinERC20[](1);
        array[0] = IOpenZeppelinERC20(address(element));
    }
}
