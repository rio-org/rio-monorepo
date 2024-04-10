// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {LibPRNG} from '@solady/utils/LibPRNG.sol';
import {ValidatorDetails} from 'contracts/utils/ValidatorDetails.sol';

library TestUtils {
    using LibPRNG for *;

    /// @notice Get `validatorCount` non-empty, fake validator keys.
    /// @param validatorCount The number of validator keys to return.
    /// @dev This function populates the public keys and signatures with their corresponding index + 1.
    function getValidatorKeys(uint256 validatorCount)
        internal
        pure
        returns (bytes memory publicKeys, bytes memory signatures)
    {
        publicKeys = new bytes(ValidatorDetails.PUBKEY_LENGTH * validatorCount);
        signatures = new bytes(ValidatorDetails.SIGNATURE_LENGTH * validatorCount);

        // Validator keys cannot be empty.
        for (uint16 i = 0; i < validatorCount; ++i) {
            bytes memory keySigBytes = abi.encodePacked(i + 1);
            for (uint256 j = 0; j < keySigBytes.length; j++) {
                publicKeys[i * ValidatorDetails.PUBKEY_LENGTH + j] = keySigBytes[j];
                signatures[i * ValidatorDetails.SIGNATURE_LENGTH + j] = keySigBytes[j];
            }
        }
    }

    /// @notice Get `validatorCount` non-empty, fake validator keys.
    /// @param validatorCount The number of validator keys to return.
    /// @dev This function populates the public keys and signatures with random bytes.
    /// This is helpful when trying to validate that the entire key is being populated correctly.
    function getRandomValidatorKeys(uint256 validatorCount)
        internal
        returns (bytes memory publicKeys, bytes memory signatures)
    {
        publicKeys = new bytes(ValidatorDetails.PUBKEY_LENGTH * validatorCount);
        signatures = new bytes(ValidatorDetails.SIGNATURE_LENGTH * validatorCount);

        bytes memory publicKey = new bytes(ValidatorDetails.PUBKEY_LENGTH);
        bytes memory signature = new bytes(ValidatorDetails.SIGNATURE_LENGTH);

        // Generate random bytes for the public keys and signatures.
        LibPRNG.PRNG memory prng = LibPRNG.PRNG(_random());
        for (uint256 i = 0; i < publicKey.length; i++) {
            publicKey[i] = bytes1(uint8(prng.next() % 255));
        }
        for (uint256 i = 0; i < signature.length; i++) {
            signature[i] = bytes1(uint8(prng.next() % 255));
        }

        // Shuffle bytes and repopulate the public keys and signatures.
        for (uint16 i = 0; i < validatorCount; ++i) {
            prng.shuffle(publicKey);
            prng.shuffle(signature);

            for (uint256 j = 0; j < publicKey.length; j++) {
                publicKeys[i * ValidatorDetails.PUBKEY_LENGTH + j] = publicKey[j];
            }
            for (uint256 j = 0; j < signature.length; j++) {
                signatures[i * ValidatorDetails.SIGNATURE_LENGTH + j] = signature[j];
            }
        }
    }

    /// @dev Returns a pseudorandom random number from [0 .. 2**256 - 1] (inclusive).
    /// For usage in fuzz tests, please ensure that the function has an unnamed uint256 argument.
    /// e.g. `testSomething(uint256) public`.
    function _random() internal returns (uint256 r) {
        /// @solidity memory-safe-assembly
        assembly {
            // This is the keccak256 of a very long string I randomly mashed on my keyboard.
            let sSlot := 0xd715531fe383f818c5f158c342925dcf01b954d24678ada4d07c36af0f20e1ee
            let sValue := sload(sSlot)

            mstore(0x20, sValue)
            r := keccak256(0x20, 0x40)

            // If the storage is uninitialized, initialize it to the keccak256 of the calldata.
            if iszero(sValue) {
                sValue := sSlot
                let m := mload(0x40)
                calldatacopy(m, 0, calldatasize())
                r := keccak256(m, calldatasize())
            }
            sstore(sSlot, add(r, 1))

            // Do some biased sampling for more robust tests.
            // prettier-ignore
            for {} 1 {} {
                let d := byte(0, r)
                // With a 1/256 chance, randomly set `r` to any of 0,1,2.
                if iszero(d) {
                    r := and(r, 3)
                    break
                }
                // With a 1/2 chance, set `r` to near a random power of 2.
                if iszero(and(2, d)) {
                    // Set `t` either `not(0)` or `xor(sValue, r)`.
                    let t := xor(not(0), mul(iszero(and(4, d)), not(xor(sValue, r))))
                    // Set `r` to `t` shifted left or right by a random multiple of 8.
                    switch and(8, d)
                    case 0 {
                        if iszero(and(16, d)) { t := 1 }
                        r := add(shl(shl(3, and(byte(3, r), 0x1f)), t), sub(and(r, 7), 3))
                    }
                    default {
                        if iszero(and(16, d)) { t := shl(255, 1) }
                        r := add(shr(shl(3, and(byte(3, r), 0x1f)), t), sub(and(r, 7), 3))
                    }
                    // With a 1/2 chance, negate `r`.
                    if iszero(and(0x20, d)) { r := not(r) }
                    break
                }
                // Otherwise, just set `r` to `xor(sValue, r)`.
                r := xor(sValue, r)
                break
            }
        }
    }
}
