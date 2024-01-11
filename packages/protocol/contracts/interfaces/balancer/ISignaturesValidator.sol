// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

/// @dev Interface for the SignatureValidator helper, used to support meta-transactions.
interface ISignaturesValidator {
    /// @dev Returns the EIP712 domain separator.
    function getDomainSeparator() external view returns (bytes32);

    /// @dev Returns the next nonce used by an address to sign messages.
    function getNextNonce(address user) external view returns (uint256);
}