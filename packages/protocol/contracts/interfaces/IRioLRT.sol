// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

interface IRioLRT {
    /// @notice Thrown when the caller is not the LRT gateway.
    error ONLY_LRT_GATEWAY();

    /// @notice Initializes the contract.
    /// @param initialOwner The initial owner of the contract.
    /// @param name The name of the token.
    /// @param symbol The symbol of the token.
    /// @param gateway The liquid restaking token gateway.
    function initialize(address initialOwner, string memory name, string memory symbol, address gateway) external;

    /// @notice Mint `amount` tokens to the specified address.
    /// @param to The address to mint tokens to.
    /// @param amount The amount of tokens to mint.
    function mint(address to, uint256 amount) external;

    /// @notice Burn `amount` tokens from the specified address.
    /// @param from The address to burn tokens from.
    /// @param amount The amount of tokens to burn.
    function burn(address from, uint256 amount) external;
}
