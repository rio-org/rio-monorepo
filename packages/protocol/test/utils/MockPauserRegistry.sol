// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

contract MockPauserRegistry {
    address public unpauser;

    mapping (address => bool) public isPauser;

    constructor(address pauser_) {
        unpauser = pauser_;
        isPauser[pauser_] = true;
    }
}
