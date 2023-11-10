// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

/// @title Balancer utility functions
library Balancer {
    /// @notice Extracts the pool address from a pool ID.
    /// @param poolId The ID of the pool.
    function toPoolAddress(bytes32 poolId) internal pure returns (address) {
        // 12 byte logical shift left to remove the nonce and specialization setting. We don't need to mask,
        // since the logical shift already sets the upper bits to zero.
        return address(uint160(uint256(poolId) >> (12 * 8)));
    }
}
