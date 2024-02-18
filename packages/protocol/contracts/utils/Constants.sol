// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

/// @dev The minimum allowed sacrificial deposit amount.
uint256 constant MIN_SACRIFICIAL_DEPOSIT = 1_000;

/// @dev The Beacon Chain ETH strategy pseudo-address.
address constant BEACON_CHAIN_STRATEGY = 0xbeaC0eeEeeeeEEeEeEEEEeeEEeEeeeEeeEEBEaC0;

/// @dev The ETH pseudo-address.
address constant ETH_ADDRESS = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

/// @dev The per-validator ETH deposit amount.
uint256 constant ETH_DEPOSIT_SIZE = 32 ether;

/// @dev The conversion factor from gwei to wei.
uint256 constant GWEI_TO_WEI = 1e9;

/// @dev LRT supporting contract types.
enum ContractType {
    Coordinator,
    AssetRegistry,
    OperatorRegistry,
    AVSRegistry,
    DepositPool,
    WithdrawalQueue,
    RewardDistributor
}
