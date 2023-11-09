// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IERC20} from '@balancer-v2/contracts/interfaces/contracts/solidity-utils/openzeppelin/IERC20.sol';
import {IVault} from '@balancer-v2/contracts/interfaces/contracts/vault/IVault.sol';
import {IStrategy} from 'contracts/interfaces/eigenlayer/IStrategy.sol';

interface IRioLRTAssetManager {
    /// @notice The asset management configuration for a token.
    struct TokenConfig {
        /// @dev The timestamp at which the token was last rebalanced.
        uint32 lastRebalancedAt;
        /// @dev The target managed asset percentage (18 decimals).
        uint64 targetAUMPercentage;
        /// @dev The token's EigenLayer strategy contract.
        IStrategy strategy;
    }

    /// @notice Thrown when the caller is not the LRT controller for the asset manager.
    error ONLY_LRT_CONTROLLER();

    /// @notice Thrown when the rebalance delay has not been met.
    error REBALANCE_DELAY_NOT_MET();

    /// @notice Thrown when the token has already been added.
    error TOKEN_ALREADY_ADDED();

    /// @notice Thrown when the token is not supported by the asset manager.
    error INVALID_TOKEN();

    /// @notice Thrown when the ETH sender is not the WETH contract.
    error SENDER_IS_NOT_WETH();

    /// @notice Emitted when a token is added.
    /// @param token The token that was added.
    /// @param amount The amount of tokens that were added.
    /// @param config The token's asset management configuration.
    event TokenAdded(IERC20 indexed token, uint256 amount, TokenConfig config);

    /// @notice Emitted when a token is removed.
    /// @param token The token that was removed.
    /// @param amount The amount of tokens that were removed.
    event TokenRemoved(IERC20 indexed token, uint256 amount, address recipient);

    /// @notice Emitted when the target AUM percentage for a token is set.
    /// @param token The token that had its target AUM percentage set.
    /// @param newTargetAUMPercentage The new target AUM percentage.
    event TargetAUMPercentageSet(IERC20 indexed token, uint96 newTargetAUMPercentage);

    /// @notice Emitted when the rebalance delay is set.
    /// @param newRebalanceDelay The new rebalance delay.
    event RebalanceDelaySet(uint24 newRebalanceDelay);

    /// @notice Emitted when a reward is received.
    /// @param token The token that was received.
    /// @param amount The amount of tokens that were received.
    event RewardReceived(IERC20 indexed token, uint256 amount);

    // forgefmt: disable-next-item
    /// @notice Initializes the asset manager.
    /// @param initialOwner The initial owner of the contract.
    /// @param poolId The LRT Balancer pool ID.
    /// @param controller The LRT controller.
    /// @param operatorRegistry The operator registry used for token allocation.
    /// @param withdrawalQueue The contract used to queue and process withdrawals.
    function initialize(address initialOwner, bytes32 poolId, address controller, address operatorRegistry, address withdrawalQueue) external;

    /// @notice Adds a token by setting its config, depositing it into the vault, and updating the balance.
    /// @param token The token to add.
    /// @param amount The amount of tokens to add.
    /// @param config The token's asset management configuration.
    function addToken(IERC20 token, uint256 amount, TokenConfig calldata config) external;

    /// @notice Removes a token by withdrawing it from the vault and updating the balance to 0.
    /// @param token The token to remove.
    /// @param amount The amount of tokens to remove.
    /// @param recipient The recipient of the tokens.
    function removeToken(IERC20 token, uint256 amount, address recipient) external;

    /// @notice Sets the target AUM percentage for a token.
    /// @param token The token to set the target AUM percentage for.
    /// @param newTargetAUMPercentage The new target AUM percentage.
    function setTargetAUMPercentage(IERC20 token, uint64 newTargetAUMPercentage) external;

    /// @notice Sets the rebalance delay.
    /// @param newRebalanceDelay The new rebalance delay.
    function setRebalanceDelay(uint24 newRebalanceDelay) external;
}
