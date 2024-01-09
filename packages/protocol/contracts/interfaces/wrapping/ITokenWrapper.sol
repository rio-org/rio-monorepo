// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

interface ITokenWrapper {
    /// @notice Returns the wrapped token address.
    function getWrappedToken() external view returns (address);

    /// @notice Returns the unwrapped token address.
    function getUnwrappedToken() external view returns (address);

    /// @notice Sets up the wrapper contract.
    function setup() external;

    /// @notice Tears down the wrapper contract.
    function teardown() external;

    /// @notice Returns the amount of wrapped tokens received for `unwrappedAmount` unwrapped tokens.
    /// @param unwrappedAmount The amount of unwrapped tokens.
    function getWrappedForUnwrapped(uint256 unwrappedAmount) external view returns (uint256);

    /// @notice Returns amount of unwrapped tokens received for `wrappedAmount` wrapped tokens.
    /// @param wrappedAmount The amount of wrapped tokens.
    function getUnwrappedForWrapped(uint256 wrappedAmount) external view returns (uint256);

    /// @notice Wraps the provided amount of tokens.
    /// @return amountOut The amount of wrapped tokens.
    function wrap(uint256 amount) external returns (uint256);

    /// @notice Unwraps the provided amount of tokens.
    /// @return amountOut The amount of unwrapped tokens.
    function unwrap(uint256 amount) external returns (uint256);
}
