// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

interface IRioLRTRewardDistributor {
    /// @notice The token exchange configuration.
    struct TokenExchangeConfig {
        /// @dev The minimum amount of tokens to swap in.
        uint256 minAmountIn;
        /// @dev The Milkman price checker contract.
        address priceChecker;
        /// @dev The price checker data.
        bytes priceCheckerData;
    }

    /// @notice Information associated with a swap request.
    struct SwapOrder {
        address fromToken;
        uint40 timestamp;
    }

    /// @notice Thrown when there are no rewards to distribute.
    error NO_REWARDS_TO_DISTRIBUTE();

    /// @notice Thrown when the treasury share is too high.
    error TREASURY_SHARE_BPS_TOO_HIGH();

    /// @notice Thrown when the operator share is too high.
    error OPERATOR_SHARE_BPS_TOO_HIGH();

    /// @notice Thrown when there is no price checker for a token.
    error NO_PRICE_CHECKER_FOR_TOKEN();

    /// @notice Thrown when the amount in is below the minimum.
    error AMOUNT_IN_TOO_LOW();

    /// @notice Thrown when a provided token contract address is invalid.
    error INVALID_TOKEN();

    /// @notice Thrown when swap cancellation is attempted before the `swapCancellationDelay` has elapsed.
    error TOO_SOON_TO_CANCEL();

    /// @notice Emitted when rewards are distributed.
    /// @param treasuryShare The amount of rewards sent to the treasury.
    /// @param operatorShare The amount of rewards sent to the operator.
    event RewardsDistributed(uint256 treasuryShare, uint256 operatorShare);

    /// @notice Emitted when the treasury share is set.
    /// @param newTreasuryShareBPS The new treasury share.
    event TreasuryShareBPSSet(uint16 newTreasuryShareBPS);

    /// @notice Emitted when the operator share is set.
    /// @param newOperatorShareBPS The new operator share.
    event OperatorShareBPSSet(uint16 newOperatorShareBPS);

    /// @notice Emitted when the swap cancellation delay is set.
    /// @param newSwapCancellationDelay The new swap cancellation delay.
    event SwapCancellationDelaySet(uint256 newSwapCancellationDelay);

    /// @notice Emitted when a token exchange configuration is set.
    /// @param token The token for which the configuration is set.
    /// @param config The new configuration.
    event TokenExchangeConfigSet(address token, TokenExchangeConfig config);

    /// @notice Emitted when a swap is requested.
    /// @param orderContract The contract that will execute the swap.
    /// @param fromToken The sell token of the swap.
    /// @param amountIn The amount in of the swap.
    event SwapRequested(address indexed orderContract, address indexed fromToken, uint256 amountIn);

    /// @notice Emitted when a swap is cancelled.
    /// @param orderContract The contract that will execute the swap.
    /// @param fromToken The sell token of the swap.
    /// @param amountIn The amount in of the swap.
    event SwapCancelled(address indexed orderContract, address indexed fromToken, uint256 amountIn);

    /// @notice Initializes the contract.
    /// @param initialOwner The initial owner of the contract.
    /// @param bpt The BPT (LRT) token address.
    /// @param treasury The treasury address.
    /// @param operator The operator reward pool address.
    function initialize(address initialOwner, address bpt, address treasury, address operator) external;
}