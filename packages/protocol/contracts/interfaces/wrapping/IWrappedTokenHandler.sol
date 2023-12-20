// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

interface IWrappedTokenHandler {
    /// @notice Thrown when there is no known wrapper for a token
    /// in which wrapping or unwrapping is requested.
    error NO_WRAPPER_FOR_TOKEN();
}
