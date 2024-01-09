// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {ITokenWrapper} from 'contracts/interfaces/wrapping/ITokenWrapper.sol';
import {OnlyDelegateCall} from 'contracts/utils/OnlyDelegateCall.sol';
import {IWSTETH} from 'contracts/interfaces/misc/IWSTETH.sol';

/// @notice Wraps and unwraps Lido staked ether.
contract LidoStakedEtherWrapper is ITokenWrapper, OnlyDelegateCall {
    using SafeERC20 for IERC20;

    /// @notice The Lido staked ether token contract.
    IERC20 public immutable stETH;

    /// @notice The Lido wrapped staked ether token contract.
    IWSTETH public immutable wstETH;

    /// @param stETH_ The Lido staked ether token address.
    /// @param wstETH_ The Lido wrapped staked ether token address.
    constructor(address stETH_, address wstETH_) {
        stETH = IERC20(stETH_);
        wstETH = IWSTETH(wstETH_);
    }

    /// @notice Returns the wrapped token address.
    function getWrappedToken() external view override returns (address) {
        return address(wstETH);
    }

    /// @notice Returns the unwrapped token address.
    function getUnwrappedToken() external view override returns (address) {
        return address(stETH);
    }

    /// @notice Sets up the wrapper contract by approving the wstETH contract
    /// to spend an unlimited amount of stETH.
    function setup() external onlyDelegateCall {
        stETH.safeApprove(address(wstETH), type(uint256).max);
    }

    /// @notice Tears down the wrapper contract by revoking the wstETH contract's
    /// ability to spend stETH.
    function teardown() external override onlyDelegateCall {
        stETH.safeApprove(address(wstETH), 0);
    }

    /// @notice Get the amount of wrapped tokens received for a given amount of unwrapped tokens.
    /// @param unwrappedAmount The amount of unwrapped tokens.
    function getWrappedForUnwrapped(uint256 unwrappedAmount) external view returns (uint256) {
        return wstETH.getWstETHByStETH(unwrappedAmount);
    }

    /// @notice Get the amount of unwrapped tokens received for a given amount of wrapped tokens.
    /// @param wrappedAmount The amount of wrapped tokens.
    function getUnwrappedForWrapped(uint256 wrappedAmount) external view returns (uint256) {
        return wstETH.getStETHByWstETH(wrappedAmount);
    }

    /// @notice Wraps the provided amount of Lido staked ether.
    /// @param amount The amount of Lido staked ether to wrap.
    function wrap(uint256 amount) external onlyDelegateCall returns (uint256) {
        return wstETH.wrap(amount);
    }

    /// @notice Unwraps the provided amount of Lido wrapped staked ether.
    /// @param amount The amount of Lido wrapped staked ether to unwrap.
    function unwrap(uint256 amount) external onlyDelegateCall returns (uint256) {
        return wstETH.unwrap(amount);
    }
}
