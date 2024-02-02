// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {ValidatorDetails} from 'contracts/utils/ValidatorDetails.sol';

library TestUtils {
    /// @notice Get `validatorCount` non-empty, fake validator keys.
    /// @param validatorCount The number of validator keys to return.
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
}
