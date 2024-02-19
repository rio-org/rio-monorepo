// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

/// @dev The minimum allowed sacrificial deposit amount.
uint256 constant MIN_SACRIFICIAL_DEPOSIT = 1_000;

/// @dev The maximum rebalance delay, in seconds.
uint256 constant MAX_REBALANCE_DELAY = 3 days;

/// @dev The Beacon Chain ETH strategy pseudo-address.
address constant BEACON_CHAIN_STRATEGY = 0xbeaC0eeEeeeeEEeEeEEEEeeEEeEeeeEeeEEBEaC0;

/// @dev The ETH pseudo-address.
address constant ETH_ADDRESS = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

/// @dev The per-validator ETH deposit amount.
uint256 constant ETH_DEPOSIT_SIZE = 32 ether;

/// @dev A soft cap on the amount of ETH that can be deposited in a single transaction (100 validators).
/// Depending on the ETH deposit buffer limit, the actual maximum deposit amount may slightly higher.
uint256 constant ETH_DEPOSIT_SOFT_CAP = ETH_DEPOSIT_SIZE * 100;

/// @dev Defines the maximum allowable excess amount of ETH above the soft cap that can still be deposited
/// in a single transaction. This allows for deposits slightly over the soft cap (up to 10 validators extra) to
/// be included without requiring additional transactions.
uint256 constant ETH_DEPOSIT_BUFFER_LIMIT = ETH_DEPOSIT_SIZE * 10;

/// @dev The deposit amount in gwei, converted to little endian.
/// ETH_DEPOSIT_SIZE_IN_GWEI_LE64 = toLittleEndian64(32 ether / 1 gwei)
uint64 constant ETH_DEPOSIT_SIZE_IN_GWEI_LE64 = 0x0040597307000000;

/// @dev The conversion factor from gwei to wei.
uint256 constant GWEI_TO_WEI = 1e9;

/// @dev The length of a BLS12-381 public key.
uint256 constant BLS_PUBLIC_KEY_LENGTH = 48;

/// @dev The length of a BLS12-381 signature.
uint256 constant BLS_SIGNATURE_LENGTH = 96;

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
