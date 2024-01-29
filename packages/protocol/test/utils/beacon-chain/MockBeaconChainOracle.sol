// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.23;

contract MockBeaconChainOracle {
    mapping(uint64 => bytes32) blockRoots;

    function timestampToBlockRoot(uint256 timestamp) public view returns (bytes32) {
        return blockRoots[uint64(timestamp)];
    }

    function setBlockRoot(uint64 timestamp, bytes32 blockRoot) public {
        blockRoots[timestamp] = blockRoot;
    }
}
