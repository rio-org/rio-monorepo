// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IRioLRTIssuer} from 'contracts/interfaces/IRioLRTIssuer.sol';

interface IRioLRTAssetManager {
    /// @notice The struct representing a token's rebalance information.
    struct TokenRebalance {
        /// @dev The target managed asset percentage (18 decimals).
        uint64 targetAUMPercentage;
        /// @dev The unix timestamp at which the token was last rebalanced.
        uint40 lastRebalancedAt;
    }

    /// @notice Thrown when the caller is not the LRT gateway.
    error ONLY_LRT_GATEWAY();

    /// @notice Thrown when the caller is not the owner or the LRT gateway.
    error ONLY_OWNER_OR_LRT_GATEWAY();

    /// @notice Thrown when the rebalance delay has not been met.
    error REBALANCE_DELAY_NOT_MET();

    /// @notice Thrown when the token has already been added.
    error TOKEN_ALREADY_ADDED();

    /// @notice Thrown when the token is not supported by the asset manager.
    error INVALID_TOKEN();

    /// @notice Thrown when an invalid target AUM is provided (>100%).
    error INVALID_TARGET_AUM_PERCENTAGE();

    /// @notice Thrown when trying to set the strategy for a token with a non-zero strategy.
    error TOKEN_STRATEGY_ALREADY_SET();

    /// @notice Thrown when no strategy is set for the provided token.
    error NO_STRATEGY_FOR_TOKEN();

    /// @notice Thrown when there is not enough operator capacity to allocate all strategy shares.
    error INSUFFICIENT_OPERATOR_CAPACITY();

    /// @notice Thrown when the amount of shares received is not the expected amount.
    error INCORRECT_NUMBER_OF_SHARES_RECEIVED();

    /// @notice Thrown when the ETH sender is not the WETH contract.
    error SENDER_IS_NOT_WETH();

    /// @notice Emitted when the rebalance delay is set.
    /// @param newRebalanceDelay The new rebalance delay.
    event RebalanceDelaySet(uint24 newRebalanceDelay);

    /// @notice Emitted when the strategy for a token is set.
    /// @param token The token that had its strategy set.
    /// @param newStrategy The new strategy.
    event StrategySet(address indexed token, address newStrategy);

    /// @notice Emitted when the target AUM percentage for a token is set.
    /// @param token The token that had its target AUM percentage set.
    /// @param newTargetAUMPercentage The new target AUM percentage.
    event TargetAUMPercentageSet(address indexed token, uint64 newTargetAUMPercentage);

    /// @notice Emitted when a donation is received.
    /// @param token The token that was received.
    /// @param amount The amount of tokens that were received.
    event DonationReceived(address indexed token, uint256 amount);

    /// @notice Initializes the asset manager.
    /// @param initialOwner The initial owner of the contract.
    /// @param poolId The underlying Balancer pool ID.
    /// @param deployment The LRT deployment.
    function initialize(address initialOwner, bytes32 poolId, IRioLRTIssuer.LRTDeployment calldata deployment)
        external;

    /// @notice Returns the amount of shares held for the given EigenLayer strategy.
    /// @param strategy The strategy to get the shares for.
    function getStrategyShares(address strategy) external view returns (uint256);

    /// @notice Returns the rebalance information for a token.
    /// @param token The token to get the rebalance information for.
    function getRebalance(address token) external view returns (TokenRebalance memory);

    /// @notice Returns the EigenLayer strategy for the provided token.
    /// @param token The token to get the strategy for.
    function getStrategy(address token) external view returns (address);

    /// @notice Returns cash (pool) and managed (EigenLayer) balances for a token.
    /// @param token The token to get the balances for.
    function getPoolBalances(address token) external view returns (uint256 cashBalance, uint256 managedBalance);

    /// @notice Rebalances `token` in the pool by processing outstanding withdrawals,
    /// depositing excess cash into EigenLayer, and updating the pool's cash and managed balances.
    /// @param token The token to rebalance.
    function rebalance(address token) external;

    /// @notice Enable asset management for the token by setting up its wrapper, allowing
    /// the vault to pull tokens from this contract, and making the initial deposit.
    /// @param token The token to be enabled.
    /// @param amount The amount of the token to deposit.
    function enableManagementAndDeposit(address token, uint256 amount) external;

    /// Withdraws the remaining balance of `token` from the Balancer pool.
    /// @param token The token to be withdrawn.
    /// @param amount The amount of the token to withdraw.
    /// @param recipient The address to send the withdrawn tokens to.
    function withdrawRemainingBalance(address token, uint256 amount, address recipient) external;

    /// @notice Sets the rebalance delay.
    /// @param newRebalanceDelay The new rebalance delay.
    function setRebalanceDelay(uint24 newRebalanceDelay) external;

    /// @notice Sets a token's EigenLayer strategy.
    /// @param token The token to set the strategy for.
    /// @param newStrategy The new strategy.
    function setStrategy(address token, address newStrategy) external;

    /// @notice Sets the target AUM percentage for a token.
    /// @param token The token to set the target AUM percentage for.
    /// @param newTargetAUMPercentage The new target AUM percentage.
    function setTargetAUMPercentage(address token, uint64 newTargetAUMPercentage) external;

    /// @notice Converts an amount of EigenLayer shares to the equivalent amount
    /// of underlying pool tokens, accounting for wrapped tokens.
    /// @param token The token address.
    /// @param shares The amount of EigenLayer shares.
    function getPoolTokensForStrategyShares(address token, uint256 shares) external view returns (uint256);

    /// @notice Converts an amount of pool tokens to the equivalent amount
    /// of EigenLayer shares, accounting for wrapped tokens.
    /// @param token The token address.
    /// @param amount The amount of tokens.
    function getStrategySharesForPoolTokens(address token, uint256 amount) external view returns (uint256);

    /// @notice Pull available cash to the caller and calculate the amount of share debt owed.
    /// @param token The token to pull cash for.
    /// @param owed The amount of tokens owed to the withdrawer.
    function pullCashAndCalculateShareDebt(address token, uint256 owed)
        external
        returns (uint256 cashPulled, uint256 sharesOwed);
}
