// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {IRioLRTAssetRegistry} from 'contracts/interfaces/IRioLRTAssetRegistry.sol';

interface IRioLRTIssuer {
    /// @notice A sacrificial deposit used to prevent inflation attacks.
    struct SacrificialDeposit {
        address asset;
        uint256 amount;
    }

    /// @notice Information required to issue a new liquid restaking token.
    struct LRTConfig {
        IRioLRTAssetRegistry.AssetConfig[] assets;
        SacrificialDeposit deposit;
        uint8 priceFeedDecimals;
        address operatorRewardPool;
        address treasury;
    }

    /// @notice Deployed addresses for a given liquid restaking token.
    struct LRTDeployment {
        address token;
        address coordinator;
        address assetRegistry;
        address operatorRegistry;
        address avsRegistry;
        address depositPool;
        address withdrawalQueue;
        address rewardDistributor;
    }

    /// @notice Thrown when the sacrificial deposit amount is less than the minimum.
    error INSUFFICIENT_SACRIFICIAL_DEPOSIT();

    /// @notice Thrown when an incorrect amount of ETH is provided for a sacrificial deposit.
    error INVALID_ETH_PROVIDED();

    /// @notice Emitted when a new liquid restaking token is issued.
    /// @param name The name of the new LRT.
    /// @param symbol The symbol of the new LRT.
    /// @param config The LRT configuration.
    /// @param deployment The LRT deployment addresses.
    event LiquidRestakingTokenIssued(string name, string symbol, LRTConfig config, LRTDeployment deployment);

    /// @notice Initializes the contract.
    /// @param initialOwner The initial owner of the contract.
    function initialize(address initialOwner) external;

    /// @notice Returns whether the provided token was issued by this factory.
    /// @param token The token to check.
    function isTokenFromFactory(address token) external view returns (bool);
}
