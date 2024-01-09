// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

interface ITokenWrapperFactory {
    /// @notice Thrown when there is no known wrapper for a token
    /// in which wrapping or unwrapping is requested.
    error NO_WRAPPER_FOR_TOKEN();

    /// @notice Emitted when a new token wrapper is deployed.
    /// @param unwrapped The unwrapped token address.
    /// @param wrapped The wrapped token address.
    /// @param wrappers The addresses used to wrap and unwrap the tokens.
    event WrappersDeployed(address indexed unwrapped, address indexed wrapped, address[2] wrappers);

    /// @notice Deploys the token wrappers for the specified tokens.
    /// @param wrapped The wrapped token address.
    /// @param unwrapped The unwrapped token address.
    /// @param creationCode The creation code of the token wrapper.
    function deployWrappers(address wrapped, address unwrapped, bytes calldata creationCode) external;

    /// @notice Returns true if a wrapper exists for the provided token.
    /// @param token The token in question.
    function hasDeployedWrapper(address token) external view returns (bool);

    /// @notice Returns the token wrapper for the provided token.
    /// @param token The token that requires a wrapper.
    /// @dev Throws if no wrapper exists for the token.
    function getDeployedWrapper(address token) external view returns (address wrapper);
}
