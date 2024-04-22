// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

contract MockStrategy {
    address public underlyingToken;

    constructor(address underlyingToken_) {
        underlyingToken = underlyingToken_;
    }
}
