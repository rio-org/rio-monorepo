// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {ITokenWrapper} from 'contracts/interfaces/wrapping/ITokenWrapper.sol';

library TokenWrapper {
    /// @notice Thrown when the token wrapper setup fails.
    /// @param wrapper The address of the token wrapper contract.
    error TOKEN_WRAPPER_SETUP_FAILED(address wrapper);

    /// @notice Thrown when the token wrapper teardown fails.
    /// @param wrapper The address of the token wrapper contract.
    error TOKEN_WRAPPER_TEARDOWN_FAILED(address wrapper);

    /// @notice Thrown when the token wrap fails.
    /// @param wrapper The address of the token wrapper contract.
    /// @param failure The revert message from the token wrap.
    error TOKEN_WRAP_FAILED(address wrapper, bytes failure);

    /// @notice Thrown when the token unwrap fails.
    /// @param wrapper The address of the token wrapper contract.
    /// @param failure The revert message from the token unwrap.
    error TOKEN_UNWRAP_FAILED(address wrapper, bytes failure);

    /// @notice Thrown when attempting to wrap zero tokens.
    error CANNOT_WRAP_ZERO_AMOUNT();

    /// @notice Thrown when attempting to unwrap zero tokens.
    error CANNOT_UNWRAP_ZERO_AMOUNT();

    /// @notice Delegates a call to set up the wrapper contract.
    /// @param wrapper The address of the token wrapper contract.
    function setup(address wrapper) internal {
        (bool success,) = wrapper.delegatecall(abi.encodeWithSelector(ITokenWrapper.setup.selector));
        if (!success) revert TOKEN_WRAPPER_SETUP_FAILED(wrapper);
    }

    /// @notice Delegates a call to tear down the wrapper contract.
    /// @param wrapper The address of the token wrapper contract.
    function teardown(address wrapper) internal {
        (bool success,) = wrapper.delegatecall(abi.encodeWithSelector(ITokenWrapper.teardown.selector));
        if (!success) revert TOKEN_WRAPPER_TEARDOWN_FAILED(wrapper);
    }

    // forgefmt: disable-next-item
    /// @notice Delegates a call to wrap tokens using the provided wrapper,
    /// returning the wrapped token address and amount.
    /// @param wrapper The address of the token wrapper contract.
    /// @param amount The amount of tokens to wrap.
    function wrap(address wrapper, uint256 amount) internal returns (address, uint256) {
        if (amount == 0) revert CANNOT_WRAP_ZERO_AMOUNT();

        (bool success, bytes memory data) = wrapper.delegatecall(
          abi.encodeWithSelector(ITokenWrapper.wrap.selector, amount)
        );
        if (!success) revert TOKEN_WRAP_FAILED(wrapper, data);

        return (ITokenWrapper(wrapper).getWrappedToken(), abi.decode(data, (uint256)));
    }

    // forgefmt: disable-next-item
    /// @notice Delegates a call to unwrap tokens using the provided wrapper,
    /// returning the unwrapped token address and amount.
    /// @param wrapper The address of the token wrapper contract.
    /// @param amount The amount of tokens to wrap.
    function unwrap(address wrapper, uint256 amount) internal returns (address, uint256) {
        if (amount == 0) revert CANNOT_UNWRAP_ZERO_AMOUNT();

        (bool success, bytes memory data) = wrapper.delegatecall(
          abi.encodeWithSelector(ITokenWrapper.unwrap.selector, amount)
        );
        if (!success) revert TOKEN_UNWRAP_FAILED(wrapper, data);

        return (ITokenWrapper(wrapper).getUnwrappedToken(), abi.decode(data, (uint256)));
    }
}
