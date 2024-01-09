// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {CREATE3} from '@solady/utils/CREATE3.sol';
import {Ownable} from '@openzeppelin/contracts/access/Ownable.sol';
import {ITokenWrapperFactory} from 'contracts/interfaces/wrapping/ITokenWrapperFactory.sol';

contract TokenWrapperFactory is ITokenWrapperFactory, Ownable {
    /// @notice Deploys the token wrappers for the specified tokens.
    /// @param unwrapped The unwrapped token address.
    /// @param wrapped The wrapped token address.
    /// @param creationCode The creation code of the token wrapper.
    function deployWrappers(address unwrapped, address wrapped, bytes calldata creationCode) external onlyOwner {
        address[2] memory wrappers = [
            CREATE3.deploy(bytes32(uint256(uint160(unwrapped))), creationCode, 0),
            CREATE3.deploy(bytes32(uint256(uint160(wrapped))), creationCode, 0)
        ];
        emit WrappersDeployed(unwrapped, wrapped, wrappers);
    }

    /// @notice Returns true if a wrapper exists for the provided token.
    /// @param token The token in question.
    function hasDeployedWrapper(address token) external view returns (bool) {
        address wrapper = CREATE3.getDeployed(bytes32(uint256(uint160(token))));
        return wrapper.code.length != 0;
    }

    /// @notice Returns the token wrapper for the provided token.
    /// @param token The token that requires a wrapper.
    /// @dev Throws if no wrapper exists for the token.
    function getDeployedWrapper(address token) external view returns (address wrapper) {
        wrapper = CREATE3.getDeployed(bytes32(uint256(uint160(token))));
        if (wrapper.code.length == 0) revert NO_WRAPPER_FOR_TOKEN();
    }
}
