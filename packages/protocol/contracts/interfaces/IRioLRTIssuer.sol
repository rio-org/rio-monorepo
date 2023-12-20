// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

interface IRioLRTIssuer {
    /// @notice Information required to issue a new liquid restaking token.
    struct LRTConfig {
        address[] tokens;
        address[] strategies;
        uint256[] amountsIn;
        uint256[] normalizedWeights;
        uint64[] targetAUMPercentages;
        uint256 swapFeePercentage;
        uint256 managementAumFeePercentage;
        bool swapEnabledOnStart;
        address securityCouncil;
    }

    /// @notice Deployed addresses for a given liquid restaking token.
    struct LRTDeployment {
        address token;
        address gateway;
        address assetManager;
        address rewardDistributor;
        address operatorRegistry;
        address withdrawalQueue;
        address avsRegistry;
    }

    /// @notice The pool join kind.
    enum JoinKind {
        INIT,
        EXACT_TOKENS_IN_FOR_BPT_OUT,
        TOKEN_IN_FOR_EXACT_BPT_OUT,
        ALL_TOKENS_IN_FOR_EXACT_BPT_OUT
    }

    /// @notice Thrown when the provided input does not match the expected length.
    error INPUT_LENGTH_MISMATCH();

    /// @notice Thrown when the swap fee is too high.
    error SWAP_FEE_TOO_HIGH();

    /// @notice Thrown when the AUM fee is too high.
    error AUM_FEE_TOO_HIGH();

    /// @notice Emitted when a new liquid restaking token is issued.
    /// @param name The name of the new LRT.
    /// @param symbol The symbol of the new LRT.
    /// @param poolId The underlying pool ID.
    /// @param config The LRT configuration.
    /// @param deployment The LRT deployment addresses.
    event LiquidRestakingTokenIssued(
        string name, string symbol, bytes32 poolId, LRTConfig config, LRTDeployment deployment
    );

    /// @notice Initializes the contract.
    /// @param initialOwner The initial owner of the contract.
    function initialize(address initialOwner) external;
}
