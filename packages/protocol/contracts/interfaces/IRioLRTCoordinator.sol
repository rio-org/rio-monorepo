// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

interface IRioLRTCoordinator {
    /// @notice Thrown when attempting an action on an unsupported asset.
    /// @param asset The address of the asset.
    error ASSET_NOT_SUPPORTED(address asset);

    /// @notice Thrown when attempting to deposit an amount that would exceed the deposit cap.
    /// @param asset The address of the asset.
    /// @param depositCap The asset's deposit cap.
    error DEPOSIT_CAP_REACHED(address asset, uint256 depositCap);

    /// @notice Thrown when attempting to request a withdrawal for an amount that would exceed the
    /// total number of shares in EigenLayer.
    error INSUFFICIENT_SHARES_FOR_WITHDRAWAL();

    /// @notice Thrown when attempting rebalance before the rebalance delay has elapsed.
    error REBALANCE_DELAY_NOT_MET();

    /// @notice Emitted when a user deposits an asset into Rio.
    /// @param user The address of the user.
    /// @param asset The address of the asset.
    /// @param amountIn The amount of the asset deposited.
    /// @param amountOut The amount of restaking tokens minted.
    event Deposited(address indexed user, address indexed asset, uint256 amountIn, uint256 amountOut);

    /// @notice Emitted when a user requests a withdrawal from Rio.
    /// @param user The address of the user.
    /// @param asset The address of the asset.
    /// @param sharesOwed The amount of EigenLayer shares owed to the user.
    /// @param amountIn The amount of restaking tokens pulled from the user.
    event WithdrawalRequested(
        address indexed user, address indexed asset, uint256 sharesOwed, uint256 amountIn
    );

    /// @notice Emitted when the rebalance delay is set.
    /// @param newRebalanceDelay The new rebalance delay.
    event RebalanceDelaySet(uint24 newRebalanceDelay);

    /// @dev Initializes the contract.
    /// @param initialOwner The owner of the contract.
    /// @param restakingToken The liquid restaking token (LRT).
    /// @param assetRegistry The contract that stores information about supported underlying assets.
    /// @param operatorRegistry The operator registry used allocate to and deallocate from EigenLayer operators.
    /// @param depositPool The contract in charge of holding funds awaiting deposit into EigenLayer.
    /// @param withdrawalQueue The contract used to queue and process withdrawals.
    function initialize(
        address initialOwner,
        address restakingToken,
        address assetRegistry,
        address operatorRegistry,
        address depositPool,
        address withdrawalQueue
    ) external;

    /// @notice Returns the total value of all underlying assets in the unit of account.
    function getTVL() external view returns (uint256);

    /// @notice Returns the total value of the underlying asset in the unit of account.
    /// @param asset The address of the asset.
    function getTVLForAsset(address asset) external view returns (uint256);

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
    function convertToSharesFromRestakingTokens(address asset, uint256 amount) external view returns (uint256 shares);

    /// @notice Deposits ERC20 tokens and mints restaking token(s) to the caller.
    /// @param token The token being deposited.
    /// @param amountIn The amount of the asset being deposited.
    function deposit(address token, uint256 amountIn) external payable;

    /// @notice Deposits ETH and mints restaking token(s) to the caller.
    function depositETH() external payable;

    /// @notice Requests a withdrawal to `asset` for `amountIn` restaking tokens.
    /// @param asset The asset being withdrawn.
    /// @param amountIn The amount of restaking tokens being redeemed.
    function requestWithdrawal(address asset, uint256 amountIn) external;
}
