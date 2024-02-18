// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

interface IRioLRTAssetRegistry {
    /// @notice The configuration used to add a new asset.
    struct AssetConfig {
        /// @dev The address of the asset.
        address asset;
        /// @dev The asset's deposit cap (disabled if 0).
        uint96 depositCap;
        /// @dev The price feed for the asset.
        address priceFeed;
        /// @dev The EigenLayer strategy used by the asset.
        address strategy;
    }

    /// @notice Information about a supported asset.
    struct AssetInfo {
        /// @dev The asset's deposit cap (disabled if 0).
        uint96 depositCap;
        /// @dev The price feed for the asset.
        address priceFeed;
        /// @dev The number of EigenLayer strategy shares held for the asset.
        /// This value is NOT used for the beacon chain strategy as its shares
        /// can fluctuate outside the system.
        uint256 shares;
        /// @dev The EigenLayer strategy used by the asset.
        address strategy;
        /// @dev The number of decimals used to get its user representation.
        uint8 decimals;
    }

    /// @notice Thrown when the caller is not the LRT withdrawal queue or deposit pool.
    error ONLY_WITHDRAWAL_QUEUE_OR_DEPOSIT_POOL();

    /// @notice Thrown when attempting an action on an unsupported asset.
    /// @param asset The address of the asset.
    error ASSET_NOT_SUPPORTED(address asset);

    /// @notice Thrown when attempting to add an asset that is already supported.
    /// @param asset The address of the asset.
    error ASSET_ALREADY_SUPPORTED(address asset);

    /// @notice Thrown when attempting to remove an asset with a non-zero balance.
    error ASSET_HAS_BALANCE();

    /// @notice Thrown when attempting to add an asset with an invalid address.
    error INVALID_ASSET_ADDRESS();

    /// @notice Thrown when an asset has greater than 18 decimals.
    error INVALID_ASSET_DECIMALS();

    /// @notice Thrown when a srategy's underlying token does not match the asset.
    error INVALID_STRATEGY();

    /// @notice Thrown when a provided price feed has an unexpected amount of decimals.
    error INVALID_PRICE_FEED_DECIMALS();

    /// @notice Thrown when a price feed is provided when not needed, or not provided when required.
    error INVALID_PRICE_FEED();

    /// @notice Emitted when a new asset is added.
    /// @param config The asset's configuration.
    event AssetAdded(AssetConfig config);

    /// @notice Emitted when an asset is removed.
    /// @param asset The address of the asset.
    event AssetRemoved(address indexed asset);

    /// @notice Emitted when an asset's EigenLayer strategy is set.
    /// @param asset The address of the asset.
    /// @param newDepositCap The new deposit cap.
    event AssetDepositCapSet(address indexed asset, uint96 newDepositCap);

    /// @notice Emitted when an asset's price feed is set.
    /// @param asset The address of the asset.
    /// @param newPriceFeed The new price feed.
    event AssetPriceFeedSet(address indexed asset, address newPriceFeed);

    /// @notice Emitted when the number of EigenLayer shares held for an asset is increased.
    /// @param asset The address of the asset.
    /// @param amount The amount of EigenLayer shares to increase.
    event AssetSharesIncreased(address indexed asset, uint256 amount);

    /// @notice Emitted when the number of EigenLayer shares held for an asset is decreased.
    /// @param asset The address of the asset.
    /// @param amount The amount of EigenLayer shares to decrease.
    event AssetSharesDecreased(address indexed asset, uint256 amount);

    /// @notice Emitted when the unverified validator ETH balance is increased.
    /// @param amount The amount of ETH to increase.
    event UnverifiedValidatorETHBalanceIncreased(uint256 amount);

    /// @notice Emitted when the unverified validator ETH balance is decreased.
    /// @param amount The amount of ETH to decrease.
    event UnverifiedValidatorETHBalanceDecreased(uint256 amount);

    /// @notice Initializes the asset registry contract.
    /// @param initialOwner The initial owner of the contract.
    /// @param token The address of the liquid restaking token.
    /// @param priceFeedDecimals The number of decimals that all price feeds must use.
    /// @param initialAssets The initial supported asset configurations.
    function initialize(
        address initialOwner,
        address token,
        uint8 priceFeedDecimals,
        AssetConfig[] calldata initialAssets
    ) external;

    /// @notice Returns the total value of all assets in the unit of account.
    function getTVL() external view returns (uint256 value);

    /// @notice Returns the total value of the underlying asset in the unit of account.
    /// @param asset The address of the asset.
    function getTVLForAsset(address asset) external view returns (uint256);

    /// @notice Returns the total balance of the asset, including the deposit pool and EigenLayer.
    /// @param asset The address of the asset.
    function getTotalBalanceForAsset(address asset) external view returns (uint256);

    /// @notice Checks if a given asset is supported.
    /// @param asset The address of the asset to check.
    function isSupportedAsset(address asset) external view returns (bool);

    /// @notice Returns information about an asset.
    /// @param asset The address of the asset.
    function getAssetInfoByAddress(address asset) external view returns (AssetInfo memory);

    /// @notice Returns the asset's EigenLayer strategy.
    /// @param asset The address of the asset.
    function getAssetStrategy(address asset) external view returns (address);

    /// @notice Returns the amount of EigenLayer shares held for an asset.
    /// @param asset The address of the asset.
    function getAssetSharesHeld(address asset) external view returns (uint256);

    /// @notice Returns the asset's current deposit cap.
    /// @param asset The address of the asset.
    function getAssetDepositCap(address asset) external view returns (uint256);

    /// @notice Returns an array of all supported assets.
    function getSupportedAssets() external view returns (address[] memory);

    /// @notice Returns the EigenLayer strategies for all supported assets.
    function getAssetStrategies() external view returns (address[] memory);

    /// @notice Increases the number of EigenLayer shares held for an asset.
    /// @param asset The address of the asset.
    /// @param amount The amount of EigenLayer shares to increase.
    function increaseSharesHeldForAsset(address asset, uint256 amount) external;

    /// @notice Decreases the number of EigenLayer shares held for an asset.
    /// @param asset The address of the asset.
    /// @param amount The amount of EigenLayer shares to decrease.
    function decreaseSharesHeldForAsset(address asset, uint256 amount) external;

    /// @notice Increases the unverified validator ETH balance.
    /// @param amount The amount of ETH to increase.
    function increaseUnverifiedValidatorETHBalance(uint256 amount) external;

    /// @notice Decreases the unverified validator ETH balance.
    /// @param amount The amount of ETH to decrease.
    function decreaseUnverifiedValidatorETHBalance(uint256 amount) external;

    /// @notice Converts an asset amount to its equivalent value in the unit of account. The unit of
    /// account is the price feed's quote asset.
    /// @param asset The address of the asset to convert.
    /// @param amount The amount of the asset to convert.
    function convertToUnitOfAccountFromAsset(address asset, uint256 amount) external view returns (uint256);

    /// @notice Converts the unit of account value to its equivalent in the asset. The unit of
    /// account is the price feed's quote asset.
    /// @param asset The address of the asset to convert to.
    /// @param value The asset's value in the unit of account.
    function convertFromUnitOfAccountToAsset(address asset, uint256 value) external view returns (uint256);

    /// @notice Converts an amount of an asset to the equivalent amount of EigenLayer shares.
    /// @param asset The address of the asset to convert.
    /// @param amount The amount of the asset to convert.
    function convertToSharesFromAsset(address asset, uint256 amount) external view returns (uint256 shares);

    /// @notice Converts an amount of EigenLayer shares to the equivalent amount of an asset.
    /// @param strategy The EigenLayer strategy.
    /// @param shares The amount of EigenLayer shares.
    function convertFromSharesToAsset(address strategy, uint256 shares) external view returns (uint256 amount);
}
