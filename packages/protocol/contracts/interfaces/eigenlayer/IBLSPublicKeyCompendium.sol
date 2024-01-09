// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.21;

/// @title Minimal interface for the `BLSPublicKeyCompendium` contract.
/// @author Layr Labs, Inc.
/// @notice Terms of Service: https://docs.eigenlayer.xyz/overview/terms-of-service
interface IBLSPublicKeyCompendium {
    struct G1Point {
        uint256 X;
        uint256 Y;
    }

    // Encoding of field elements is: X[1] * i + X[0]
    struct G2Point {
        uint256[2] X;
        uint256[2] Y;
    }

    /// @notice Emitted when `operator` registers with the public keys `pubkeyG1` and `pubkeyG2`.
    event NewPubkeyRegistration(address indexed operator, G1Point pubkeyG1, G2Point pubkeyG2);

    /// @notice mapping from operator address to pubkey hash.
    /// Returns *zero* if the `operator` has never registered, and otherwise returns the hash of the public key of the operator.
    function operatorToPubkeyHash(address operator) external view returns (bytes32);

    /// @notice mapping from pubkey hash to operator address.
    /// Returns *zero* if no operator has ever registered the public key corresponding to `pubkeyHash`,
    /// and otherwise returns the (unique) registered operator who owns the BLS public key that is the preimage of `pubkeyHash`.
    function pubkeyHashToOperator(bytes32 pubkeyHash) external view returns (address);

    /// @notice Called by an operator to register themselves as the owner of a BLS public key and reveal their G1 and G2 public key.
    /// @param signedMessageHash is the registration message hash signed by the private key of the operator
    /// @param pubkeyG1 is the corresponding G1 public key of the operator
    /// @param pubkeyG2 is the corresponding G2 public key of the operator
    function registerBLSPublicKey(G1Point memory signedMessageHash, G1Point memory pubkeyG1, G2Point memory pubkeyG2)
        external;

    /// @notice Returns the message hash that an operator must sign to register their BLS public key.
    /// @param operator is the address of the operator registering their BLS public key
    function getMessageHash(address operator) external view returns (G1Point memory);
}
