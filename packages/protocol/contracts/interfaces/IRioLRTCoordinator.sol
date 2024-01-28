// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

interface IRioLRTCoordinator {
    /// @notice Thrown when attempting an action on an unsupported asset.
    /// @param asset The address of the asset.
    error ASSET_NOT_SUPPORTED(address asset);

    /// @notice Thrown when attempting to deposit an amount of zero.
    error AMOUNT_MUST_BE_GREATER_THAN_ZERO();

    /// @notice Thrown when attempting to deposit an amount that would exceed the deposit cap.
    /// @param asset The address of the asset.
    /// @param depositCap The asset's deposit cap.
    error DEPOSIT_CAP_REACHED(address asset, uint256 depositCap);

    /// @notice Thrown when attempting to request a withdrawal for an amount that would exceed the
    /// total number of shares in EigenLayer.
    error INSUFFICIENT_SHARES_FOR_WITHDRAWAL();

    /// @notice Thrown when attempting rebalance before the rebalance delay has elapsed.
    error REBALANCE_DELAY_NOT_MET();

    /// @notice Thrown when attempting to rebalance an asset that does not need to be rebalanced.
    error NO_REBALANCE_NEEDED();

    /// @notice Emitted when a user deposits an asset into Rio.
    /// @param user The address of the user.
    /// @param asset The address of the asset.
    /// @param amountIn The amount of the asset deposited.
    /// @param amountOut The amount of restaking tokens minted.
    event Deposited(address indexed user, address indexed asset, uint256 amountIn, uint256 amountOut);

    /// @notice Emitted when an asset is rebalanced.
    /// @param asset The address of the asset.
    event Rebalanced(address indexed asset);

    /// @notice Emitted when the rebalance delay is set.
    /// @param newRebalanceDelay The new rebalance delay.
    event RebalanceDelaySet(uint24 newRebalanceDelay);

    /// @dev Initializes the contract.
    /// @param initialOwner The owner of the contract.
    /// @param token The address of the liquid restaking token.
    function initialize(address initialOwner, address token) external;

    /// @notice Returns the total value of all underlying assets in the unit of account.
    function getTVL() external view returns (uint256);

    /// @notice Converts an amount of restaking tokens to its equivalent value in the unit of account.
    /// The unit of account is the price feed's quote asset.
    /// @param amount The amount of restaking tokens to convert.
    function convertToUnitOfAccountFromRestakingTokens(uint256 amount) external view returns (uint256);

    /// @notice Converts the unit of account value to its equivalent in restaking tokens. The unit of
    /// account is the price feed's quote asset.
    /// @param value The restaking token's value in the unit of account.
    function convertFromUnitOfAccountToRestakingTokens(uint256 value) external view returns (uint256);

    /// @notice Converts an asset amount to its equivalent value in restaking tokens.
    /// @param asset The address of the asset to convert.
    /// @param amount The amount of the asset to convert.
    function convertFromAssetToRestakingTokens(address asset, uint256 amount) external view returns (uint256);

    /// @notice Converts an amount of restaking tokens to the equivalent in the asset.
    /// @param asset The address of the asset to convert to.
    /// @param amount The amount of restaking tokens to convert.
    function convertToAssetFromRestakingTokens(address asset, uint256 amount) external view returns (uint256);

    /// @notice Converts an amount of restaking tokens to the equivalent in the provided
    /// asset's EigenLayer shares.
    /// @param asset The address of the asset whose EigenLayer shares to convert to.
    /// @param amount The amount of restaking tokens to convert.
    function convertToSharesFromRestakingTokens(address asset, uint256 amount) external view returns (uint256);

    /// @notice Deposits ERC20 tokens and mints restaking token(s) to the caller.
    /// @param asset The asset being deposited.
    /// @param amountIn The amount of the asset being deposited.
    function deposit(address asset, uint256 amountIn) external returns (uint256);

    /// @notice Deposits ETH and mints restaking token(s) to the caller.
    function depositETH() external payable returns (uint256);

    /// @notice Requests a withdrawal to `asset` for `amountIn` restaking tokens.
    /// @param asset The asset being withdrawn.
    /// @param amountIn The amount of restaking tokens being redeemed.
    function requestWithdrawal(address asset, uint256 amountIn) external returns (uint256);

    /// @notice Rebalances the provided `asset` by processing outstanding withdrawals and
    /// depositing remaining assets into EigenLayer.
    /// @param asset The asset to rebalance.
    function rebalance(address asset) external;
}
