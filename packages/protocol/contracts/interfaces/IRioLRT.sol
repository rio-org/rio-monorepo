// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

interface IRioLRT {
    /// @notice Thrown when the caller is not the LRT coordinator.
    error ONLY_COORDINATOR();

    /// @notice Initializes the contract.
    /// @param initialOwner The initial owner of the contract.
    /// @param name The name of the token.
    /// @param symbol The symbol of the token.
    /// @param coordinator The liquid restaking token coordinator.
    function initialize(address initialOwner, string memory name, string memory symbol, address coordinator) external;

    /// @notice Returns the amount of tokens in existence.
    function totalSupply() external view returns (uint256);

    /// @notice Mint `amount` tokens to the specified address.
    /// @param to The address to mint tokens to.
    /// @param amount The amount of tokens to mint.
    function mint(address to, uint256 amount) external;

    /// @notice Burn `amount` tokens from the `msg.sender`.
    /// @param amount The amount of tokens to burn.
    function burn(uint256 amount) external;
}
