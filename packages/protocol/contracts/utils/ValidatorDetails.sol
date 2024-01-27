// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

/// @title Library for managing validator details in storage
/// @notice Modified from KRogLA's work for Lido
library ValidatorDetails {
    using ValidatorDetails for bytes32;

    /// @notice The validator pubkey byte length.
    uint256 internal constant PUBKEY_LENGTH = 48;

    /// @notice The validator signature byte length.
    uint256 internal constant SIGNATURE_LENGTH = 96;

    /// @notice The maximum uint40 value.
    uint256 internal constant UINT40_MAX = type(uint40).max;

    /// @notice Thrown when the number of keys is invalid.
    error INVALID_KEYS_COUNT();

    /// @notice Thrown when the keys and signatures lengths mismatch.
    error LENGTH_MISMATCH();

    /// @notice Thrown when the key is empty.
    error EMPTY_KEY();

    /// @notice Emitted when a new validator signing key is added.
    /// @param operatorId The operator ID.
    /// @param pubkey The validator public key.
    event ValidatorDetailsAdded(uint8 indexed operatorId, bytes pubkey);

    /// @notice Emitted when a validator signing key is removed.
    /// @param operatorId The operator ID.
    /// @param pubkey The validator public key.
    event ValidatorDetailsRemoved(uint8 indexed operatorId, bytes pubkey);

    // forgefmt: disable-next-item
    /// @notice Compute the storage key offset.
    /// @param position The storage slot.
    /// @param operatorId The operator ID.
    /// @param keyIndex The key index.
    function computeStorageKeyOffset(bytes32 position, uint8 operatorId, uint256 keyIndex) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(position, operatorId, keyIndex)));
    }

    /// @notice Store operator details.
    /// @param position The storage slot.
    /// @param operatorId The operator ID.
    /// @param startIndex The start index.
    /// @param keysCount Keys count to load.
    /// @param pubkeys Keys buffer to read from.
    /// @param signatures Signatures buffer to read from.
    /// @return totalKeysCount New total keys count.
    function saveValidatorDetails(
        bytes32 position,
        uint8 operatorId,
        uint256 startIndex,
        uint256 keysCount,
        bytes memory pubkeys,
        bytes memory signatures
    ) internal returns (uint40) {
        if (keysCount == 0 || startIndex + keysCount > UINT40_MAX) revert INVALID_KEYS_COUNT();
        if (pubkeys.length != keysCount * PUBKEY_LENGTH || signatures.length != keysCount * SIGNATURE_LENGTH) {
            revert LENGTH_MISMATCH();
        }

        uint256 currentOffset;
        bool isEmpty;
        bytes memory tempKey = new bytes(48);

        for (uint256 i; i < keysCount;) {
            currentOffset = position.computeStorageKeyOffset(operatorId, startIndex);
            assembly {
                let _ofs := add(add(pubkeys, 0x20), mul(i, 48)) // PUBKEY_LENGTH = 48
                let _part1 := mload(_ofs) // bytes 0..31
                let _part2 := mload(add(_ofs, 0x10)) // bytes 16..47
                isEmpty := iszero(or(_part1, _part2))
                mstore(add(tempKey, 0x30), _part2) // Store 2nd part first
                mstore(add(tempKey, 0x20), _part1) // Store 1st part with overwrite bytes 16-31
            }

            if (isEmpty) revert EMPTY_KEY();
            assembly {
                // Store key
                sstore(currentOffset, mload(add(tempKey, 0x20))) // Store bytes 0..31
                sstore(add(currentOffset, 1), shl(128, mload(add(tempKey, 0x30)))) // Store bytes 32..47

                // Store signature
                let _ofs := add(add(signatures, 0x20), mul(i, 96)) // SIGNATURE_LENGTH = 96
                sstore(add(currentOffset, 2), mload(_ofs))
                sstore(add(currentOffset, 3), mload(add(_ofs, 0x20)))
                sstore(add(currentOffset, 4), mload(add(_ofs, 0x40)))
                i := add(i, 1)
                startIndex := add(startIndex, 1)
            }
            emit ValidatorDetailsAdded(operatorId, tempKey);
        }
        return uint40(startIndex);
    }

    // forgefmt: disable-next-item
    /// @notice Remove validator details from storage.
    /// @param position The storage slot.
    /// @param operatorId The Operator ID.
    /// @param startIndex The start index.
    /// @param keysCount Keys count to load.
    /// @param totalKeysCount Current total keys count for operator.
    /// @return totalKeysCount New total keys count.
    function removeValidatorDetails(bytes32 position, uint8 operatorId, uint256 startIndex, uint256 keysCount, uint256 totalKeysCount) internal returns (uint40) {
        if (keysCount == 0 || startIndex + keysCount > totalKeysCount || totalKeysCount > UINT40_MAX) {
            revert INVALID_KEYS_COUNT();
        }

        uint256 currentOffset;
        uint256 lastOffset;
        uint256 j;

        bytes memory tempKey = new bytes(48);

        // Remove from the last index
        for (uint256 i = startIndex + keysCount; i > startIndex;) {
            currentOffset = position.computeStorageKeyOffset(operatorId, i - 1);
            assembly {
                // Read key
                mstore(add(tempKey, 0x30), shr(128, sload(add(currentOffset, 1)))) // bytes 16..47
                mstore(add(tempKey, 0x20), sload(currentOffset)) // bytes 0..31
            }
            if (i < totalKeysCount) {
                lastOffset = position.computeStorageKeyOffset(operatorId, totalKeysCount - 1);

                // Move last key to deleted key index
                for (j = 0; j < 5;) {
                    assembly {
                        sstore(add(currentOffset, j), sload(add(lastOffset, j)))
                        j := add(j, 1)
                    }
                }
                currentOffset = lastOffset;
            }

            // Clear storage
            for (j = 0; j < 5;) {
                assembly {
                    sstore(add(currentOffset, j), 0)
                    j := add(j, 1)
                }
            }
            assembly {
                totalKeysCount := sub(totalKeysCount, 1)
                i := sub(i, 1)
            }
            emit ValidatorDetailsRemoved(operatorId, tempKey);
        }
        return uint40(totalKeysCount);
    }

    /// @notice Load validator details from storage.
    /// @param position The storage slot.
    /// @param operatorId The operator ID.
    /// @param startIndex The start index.
    /// @param keysCount Keys count to load.
    /// @param pubkeys Pre-allocated key buffer to read in.
    /// @param signatures Pre-allocated signature buffer to read in.
    /// @param bufferOffset start offset in `pubkeys`/`signatures` buffer to place values (in number of keys).
    function loadValidatorDetails(
        bytes32 position,
        uint8 operatorId,
        uint256 startIndex,
        uint256 keysCount,
        bytes memory pubkeys,
        bytes memory signatures,
        uint256 bufferOffset
    ) internal view {
        uint256 currentOffset;
        for (uint256 i; i < keysCount;) {
            currentOffset = position.computeStorageKeyOffset(operatorId, startIndex + i);

            assembly {
                // Read key
                let _ofs := add(add(pubkeys, 0x20), mul(add(bufferOffset, i), 48)) // PUBKEY_LENGTH = 48
                mstore(add(_ofs, 0x10), shr(128, sload(add(currentOffset, 1)))) // bytes 16..47
                mstore(_ofs, sload(currentOffset)) // bytes 0..31

                // Store signature
                _ofs := add(add(signatures, 0x20), mul(add(bufferOffset, i), 96)) // SIGNATURE_LENGTH = 96
                mstore(_ofs, sload(add(currentOffset, 2)))
                mstore(add(_ofs, 0x20), sload(add(currentOffset, 3)))
                mstore(add(_ofs, 0x40), sload(add(currentOffset, 4)))
                i := add(i, 1)
            }
        }
    }

    /// @notice Allocate memory for `count` validator details.
    /// @param count The number of validators.
    function allocateMemory(uint256 count) internal pure returns (bytes memory, bytes memory) {
        return (new bytes(count * PUBKEY_LENGTH), new bytes(count * SIGNATURE_LENGTH));
    }
}
