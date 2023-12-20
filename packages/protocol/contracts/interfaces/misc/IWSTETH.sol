// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';

interface IWSTETH is IERC20 {
    /// @notice Get amount of stETH for a one wstETH.
    function stEthPerToken() external view returns (uint256);

    /// @notice Get amount of wstETH for a one stETH.
    function tokensPerStEth() external view returns (uint256);

    /// @notice Get amount of wstETH for a given amount of stETH
    /// @param stETHAmount The amount of stETH
    function getWstETHByStETH(uint256 stETHAmount) external view returns (uint256);

    /// @notice Get amount of stETH for a given amount of wstETH
    /// @param wstETHAmount The amount of wstETH
    function getStETHByWstETH(uint256 wstETHAmount) external view returns (uint256);

    /// @notice Wrap stETH into wstETH.
    /// @param amount The amount of stETH to wrap.
    function wrap(uint256 amount) external returns (uint256);

    /// @notice Unwrap wstETH into stETH.
    /// @param amount The amount of wstETH to unwrap.
    function unwrap(uint256 amount) external returns (uint256);
}
