// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

/// @title Memory utility functions
/// @notice Modified from skozin's work for Lido. Switch over to the MCOPY
/// instruction once available - https://eips.ethereum.org/EIPS/eip-5656.
library Memory {
    /// @notice Thrown when there is an attempt to access an out of bounds array element.
    error BYTES_ARRAY_OUT_OF_BOUNDS();

    /// @notice Allocates a memory byte array of `len` bytes without zeroing it out.
    /// @param len The length of the byte array to allocate.
    function unsafeAllocateBytes(uint256 len) internal pure returns (bytes memory result) {
        assembly {
            result := mload(0x40)
            mstore(result, len)
            let freeMemPtr := add(add(result, 32), len)
            // Align free mem ptr to 32 bytes as the compiler does now.
            mstore(0x40, and(add(freeMemPtr, 31), not(31)))
        }
    }

    /// @notice Performs a memory copy of `len` bytes from position `src` to position `dst`.
    /// @param src The source memory position.
    /// @param dst The destination memory position.
    /// @param len The number of bytes to copy.
    function memcpy(uint256 src, uint256 dst, uint256 len) internal pure {
        assembly {
            // While at least 32 bytes left, copy in 32-byte chunks.
            for {} gt(len, 31) {} {
                mstore(dst, mload(src))
                src := add(src, 32)
                dst := add(dst, 32)
                len := sub(len, 32)
            }
            if gt(len, 0) {
                // Read the next 32-byte chunk from `dst` and replace the first N bytes
                // with those left in the `src`, and write the transformed chunk back.
                let mask := sub(shl(mul(8, sub(32, len)), 1), 1) // 2 ** (8 * (32 - len)) - 1
                let srcMasked := and(mload(src), not(mask))
                let dstMasked := and(mload(dst), mask)
                mstore(dst, or(dstMasked, srcMasked))
            }
        }
    }

    /// @notice Copies `len` bytes from `src`, starting at position `srcStart`, into `dst`, starting at position `dstStart` into `dst`.
    /// @param src The source bytes array.
    /// @param dst The destination bytes array.
    /// @param srcStart The starting position in `src`.
    /// @param dstStart The starting position in `dst`.
    /// @param len The number of bytes to copy.
    function copyBytes(bytes memory src, bytes memory dst, uint256 srcStart, uint256 dstStart, uint256 len)
        internal
        pure
    {
        if (srcStart + len > src.length || dstStart + len > dst.length) revert BYTES_ARRAY_OUT_OF_BOUNDS();
        uint256 srcStartPos;
        uint256 dstStartPos;
        assembly {
            srcStartPos := add(add(src, 32), srcStart)
            dstStartPos := add(add(dst, 32), dstStart)
        }
        memcpy(srcStartPos, dstStartPos, len);
    }

    /// @notice Copies bytes from `src` to `dst`, starting at position `dstStart` into `dst`.
    /// @param src The source bytes array.
    /// @param dst The destination bytes array.
    /// @param dstStart The starting position in `dst`.
    function copyBytes(bytes memory src, bytes memory dst, uint256 dstStart) internal pure {
        copyBytes(src, dst, 0, dstStart, src.length);
    }
}
