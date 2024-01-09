// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {CREATE3} from '@solady/utils/CREATE3.sol';
import {IWrappedTokenHandler} from 'contracts/interfaces/wrapping/IWrappedTokenHandler.sol';
import {ITokenWrapper} from 'contracts/interfaces/wrapping/ITokenWrapper.sol';
import {TokenWrapper} from 'contracts/wrapping/TokenWrapper.sol';

abstract contract WrappedTokenHandler is IWrappedTokenHandler {
    using TokenWrapper for address;

    /// @notice The contract that deploys token wrappers.
    address public immutable tokenWrapperFactory;

    /// @param tokenWrapperFactory_ The contract that deploys token wrappers.
    constructor(address tokenWrapperFactory_) {
        tokenWrapperFactory = tokenWrapperFactory_;
    }

    /// @notice Delegates a call to setup the wrapper contract for the provided token.
    /// @param token The token that requires a wrapper.
    function _setup(address token) internal {
        _getWrapper(token).setup();
    }

    /// @notice Delegates a call to teardown the wrapper contract.
    /// @param token The token that requires a wrapper.
    function _teardown(address token) internal {
        _getWrapper(token).teardown();
    }

    /// @notice Returns the amount of wrapped tokens received for a given amount of unwrapped tokens.
    /// @param token The token to wrap.
    /// @param amount The amount of tokens to wrap.
    function _getWrappedForUnwrapped(address token, uint256 amount) internal view returns (uint256) {
        return ITokenWrapper(_getWrapper(token)).getWrappedForUnwrapped(amount);
    }

    /// @notice Returns the amount of unwrapped tokens received for a given amount of wrapped tokens.
    /// @param token The token to unwrap.
    /// @param amount The amount of tokens to unwrap.
    function _getUnwrappedForWrapped(address token, uint256 amount) internal view returns (uint256) {
        return ITokenWrapper(_getWrapper(token)).getUnwrappedForWrapped(amount);
    }

    /// @notice Previews a token wrap, returning the wrapped token address and expected amount out.
    /// @param token The token to wrap.
    /// @param amount The amount of tokens to wrap.
    function _previewWrap(address token, uint256 amount) internal view returns (address, uint256) {
        ITokenWrapper wrapper = ITokenWrapper(_getWrapper(token));
        return (wrapper.getWrappedToken(), wrapper.getWrappedForUnwrapped(amount));
    }

    /// @notice Previews a token unwrap, returning the unwrapped token address and expected amount out.
    /// @param token The token to unwrap.
    /// @param amount The amount of tokens to unwrap.
    function _previewUnwrap(address token, uint256 amount) internal view returns (address, uint256) {
        ITokenWrapper wrapper = ITokenWrapper(_getWrapper(token));
        return (wrapper.getUnwrappedToken(), wrapper.getUnwrappedForWrapped(amount));
    }

    /// @notice Delegates a call to wrap the provided token,returning the wrapped token
    /// address and amount.
    /// @param token The token to wrap.
    /// @param amount The amount of tokens to wrap.
    function _wrap(address token, uint256 amount) internal returns (address, uint256) {
        return _getWrapper(token).wrap(amount);
    }

    /// @notice Delegates a call to unwrap the provided token, returning the unwrapped token
    /// address and amount.
    /// @param token The token to unwrap.
    /// @param amount The amount of tokens to unwrap.
    function _unwrap(address token, uint256 amount) internal returns (address, uint256) {
        return _getWrapper(token).unwrap(amount);
    }

    /// @notice Returns true if a wrapper exists for the provided token.
    /// @param token The token in question.
    function _hasWrapper(address token) internal view returns (bool) {
        address wrapper = CREATE3.getDeployed(bytes32(uint256(uint160(token))), tokenWrapperFactory);
        return wrapper.code.length != 0;
    }

    /// @notice Returns the token wrapper for the provided token.
    /// @param token The token that requires a wrapper.
    /// @dev Throws if no wrapper exists for the token.
    function _getWrapper(address token) internal view returns (address wrapper) {
        wrapper = CREATE3.getDeployed(bytes32(uint256(uint160(token))), tokenWrapperFactory);
        if (wrapper.code.length == 0) {
            revert NO_WRAPPER_FOR_TOKEN();
        }
    }
}
