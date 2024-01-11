// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IRioLRTAssetRegistry} from 'contracts/interfaces/IRioLRTAssetRegistry.sol';

interface IRioLRTIssuer {
    /// @notice Information required to issue a new liquid restaking token.
    struct LRTConfig {
        IRioLRTAssetRegistry.AssetConfig[] assets;
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

    /// @notice Emitted when a new liquid restaking token is issued.
    /// @param name The name of the new LRT.
    /// @param symbol The symbol of the new LRT.
    /// @param config The LRT configuration.
    /// @param deployment The LRT deployment addresses.
    event LiquidRestakingTokenIssued(
        string name, string symbol, LRTConfig config, LRTDeployment deployment
    );

    /// @notice Initializes the contract.
    /// @param initialOwner The initial owner of the contract.
    function initialize(address initialOwner) external;
}
