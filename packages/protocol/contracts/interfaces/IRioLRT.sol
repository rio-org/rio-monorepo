// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';

interface IRioLRT is IERC20 {
    /// @notice Thrown when the initializer is not the LRT issuer.
    error ONLY_ISSUER();

    /// @notice Thrown when the caller is not the LRT coordinator.
    error ONLY_COORDINATOR();

    /// @notice Initializes the contract.
    /// @param initialOwner The initial owner of the contract.
    /// @param name The name of the token.
    /// @param symbol The symbol of the token.
    function initialize(address initialOwner, string memory name, string memory symbol) external;

    /// @notice Mint `amount` tokens to the specified address.
    /// @param to The address to mint tokens to.
    /// @param amount The amount of tokens to mint.
    function mint(address to, uint256 amount) external;

    /// @notice Burn `amount` tokens from the `msg.sender`.
    /// @param amount The amount of tokens to burn.
    function burn(uint256 amount) external;
}
