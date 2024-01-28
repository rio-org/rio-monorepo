// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {IPriceFeed} from 'contracts/interfaces/oracle/IPriceFeed.sol';
import {IRioLRTAssetRegistry} from 'contracts/interfaces/IRioLRTAssetRegistry.sol';
import {IERC20Metadata} from '@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {UUPSUpgradeable} from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import {BEACON_CHAIN_STRATEGY, ETH_ADDRESS} from 'contracts/utils/Constants.sol';
import {IStrategy} from 'contracts/interfaces/eigenlayer/IStrategy.sol';
import {LRTCore} from 'contracts/utils/LRTCore.sol';

contract RioLRTAssetRegistry is IRioLRTAssetRegistry, OwnableUpgradeable, UUPSUpgradeable, LRTCore {
    /// @notice The number of decimals that all asset price feeds must use.
    uint8 public priceFeedDecimals;

    /// @notice The price scale used for all assets (max of 18 decimals).
    uint64 public priceScale;

    /// @notice All supported assets.
    address[] public supportedAssets;

    /// @notice Information about a supported asset.
    mapping(address asset => AssetInfo) public assetInfo;

    /// @notice Require that the caller is the withdrawal queue or operator registry.
    modifier onlyWithdrawalQueueOrOperatorRegistry() {
        if (msg.sender != address(withdrawalQueue()) && msg.sender != address(operatorRegistry())) {
            revert ONLY_WITHDRAWAL_QUEUE_OR_OPERATOR_REGISTRY();
        }
        _;
    }

    /// @param issuer_ The LRT issuer that's authorized to deploy this contract.
    constructor(address issuer_) LRTCore(issuer_) {}

    /// @notice Initializes the asset registry contract.
    /// @param initialOwner The initial owner of the contract.
    /// @param token_ The address of the liquid restaking token.
    /// @param priceFeedDecimals_ The number of decimals that all price feeds must use.
    /// @param initialAssets The initial supported asset configurations.
    function initialize(
        address initialOwner,
        address token_,
        uint8 priceFeedDecimals_,
        AssetConfig[] calldata initialAssets
    ) external initializer {
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
        __LRTCore_init(token_);

        // Non-ETH pairs must use 8 decimals, while ETH pairs must use 18.
        if (priceFeedDecimals_ != 8 && priceFeedDecimals_ != 18) revert INVALID_PRICE_FEED_DECIMALS();

        priceFeedDecimals = priceFeedDecimals_;
        priceScale = uint64(10) ** priceFeedDecimals_;

        // Add the initial assets, if any.
        for (uint256 i = 0; i < initialAssets.length; ++i) {
            _addAsset(initialAssets[i]);
        }
    }

    /// @notice Returns the total value of all underlying assets in the unit of account.
    function getTVL() public view returns (uint256 value) {
        address[] memory assets = getSupportedAssets();
        for (uint256 i = 0; i < assets.length; ++i) {
            value += getTVLForAsset(assets[i]);
        }
    }

    /// @notice Returns the total value of the underlying asset in the unit of account.
    /// @param asset The address of the asset.
    function getTVLForAsset(address asset) public view returns (uint256) {
        uint256 balance = getTotalBalanceForAsset(asset);
        if (asset == ETH_ADDRESS) {
            return balance;
        }
        return convertToUnitOfAccountFromAsset(asset, balance);
    }

    /// @notice Returns the total balance of the asset, including the deposit pool and EigenLayer.
    /// @param asset The address of the asset.
    function getTotalBalanceForAsset(address asset) public view returns (uint256) {
        if (!isSupportedAsset(asset)) revert ASSET_NOT_SUPPORTED(asset);

        address depositPool_ = address(depositPool());
        uint256 sharesHeld = getAssetSharesHeld(asset);

        if (asset == ETH_ADDRESS) {
            return depositPool_.balance + sharesHeld;
        }

        uint256 tokensInRio = IERC20(asset).balanceOf(depositPool_);
        uint256 tokensInEigenLayer = convertFromSharesToAsset(getAssetStrategy(asset), sharesHeld);

        return tokensInRio + tokensInEigenLayer;
    }

    /// @notice Checks if a given asset is supported.
    /// @param asset The address of the asset to check.
    function isSupportedAsset(address asset) public view returns (bool) {
        return assetInfo[asset].strategy != address(0);
    }

    /// @notice Returns information about an asset.
    /// @param asset The address of the asset.
    function getAssetInfoByAddress(address asset) public view returns (AssetInfo memory) {
        return assetInfo[asset];
    }

    /// @notice Returns the asset's EigenLayer strategy.
    /// @param asset The address of the asset.
    function getAssetStrategy(address asset) public view returns (address) {
        return assetInfo[asset].strategy;
    }

    /// @notice Returns the amount of EigenLayer shares held for an asset.
    /// @param asset The address of the asset.
    function getAssetSharesHeld(address asset) public view returns (uint256) {
        return assetInfo[asset].shares;
    }

    /// @notice Returns the asset's current price feed.
    /// @param asset The address of the asset.
    function getAssetPriceFeed(address asset) external view returns (address) {
        return assetInfo[asset].priceFeed;
    }

    /// @notice Returns the asset's current deposit cap.
    /// @param asset The address of the asset.
    function getAssetDepositCap(address asset) external view returns (uint256) {
        return assetInfo[asset].depositCap;
    }

    /// @notice Returns the asset's decimal precision.
    /// @param asset The address of the asset.
    function getAssetDecimals(address asset) external view returns (uint256) {
        return assetInfo[asset].decimals;
    }

    /// @notice Returns the asset's current price.
    /// @param asset The address of the asset.
    function getAssetPrice(address asset) public view returns (uint256) {
        return getPrice(assetInfo[asset].priceFeed);
    }

    /// @notice Returns an array of all supported assets.
    function getSupportedAssets() public view returns (address[] memory assets) {
        uint256 assetCount = supportedAssets.length;
        assets = new address[](assetCount);

        for (uint256 i = 0; i < assetCount; ++i) {
            assets[i] = supportedAssets[i];
        }
    }

    /// @notice Returns the EigenLayer strategies for all supported assets.
    function getAssetStrategies() external view returns (address[] memory strategies) {
        uint256 assetCount = supportedAssets.length;
        strategies = new address[](assetCount);

        for (uint256 i = 0; i < assetCount; ++i) {
            strategies[i] = getAssetStrategy(supportedAssets[i]);
        }
    }

    /// @notice Converts an asset amount to its equivalent value in the unit of account. The unit of
    /// account is the price feed's quote asset.
    /// @param asset The address of the asset to convert.
    /// @param amount The amount of the asset to convert.
    function convertToUnitOfAccountFromAsset(address asset, uint256 amount) public view returns (uint256) {
        if (asset == ETH_ADDRESS) {
            return amount;
        }
        address priceFeed = assetInfo[asset].priceFeed;
        uint256 price = getPrice(priceFeed);

        return _normalizeDecimals(price * amount / priceScale, assetInfo[asset].decimals, priceFeedDecimals);
    }

    /// @notice Converts the unit of account value to its equivalent in the asset. The unit of
    /// account is the price feed's quote asset.
    /// @param asset The address of the asset to convert to.
    /// @param value The asset's value in the unit of account.
    function convertFromUnitOfAccountToAsset(address asset, uint256 value) public view returns (uint256) {
        if (asset == ETH_ADDRESS) {
            return value;
        }
        address priceFeed = assetInfo[asset].priceFeed;
        uint256 price = getPrice(priceFeed);

        return _normalizeDecimals(value * priceScale / price, priceFeedDecimals, assetInfo[asset].decimals);
    }

    /// @notice Converts an amount of EigenLayer shares to the equivalent amount
    /// of underlying pool tokens.
    /// @param asset The address of the asset to convert.
    /// @param amount The amount of the asset to convert.
    function convertToSharesFromAsset(address asset, uint256 amount) public view returns (uint256 shares) {
        address strategy = assetInfo[asset].strategy;
        if (strategy == BEACON_CHAIN_STRATEGY) {
            return amount;
        }
        shares = IStrategy(strategy).underlyingToSharesView(amount);
    }

    /// @notice Converts an amount of EigenLayer shares to the equivalent amount
    /// of underlying pool tokens.
    /// @param strategy The EigenLayer strategy.
    /// @param shares The amount of EigenLayer shares.
    function convertFromSharesToAsset(address strategy, uint256 shares) public view returns (uint256 amount) {
        if (strategy == BEACON_CHAIN_STRATEGY) {
            return shares;
        }
        amount = IStrategy(strategy).sharesToUnderlyingView(shares);
    }

    /// @dev Get the current price from the provided price feed.
    /// @param priceFeed The price feed contract address.
    function getPrice(address priceFeed) public view returns (uint256) {
        if (priceFeed == address(0)) {
            revert INVALID_PRICE_FEED();
        }
        return IPriceFeed(priceFeed).getPrice();
    }

    /// @notice Adds a new underlying asset to the liquid restaking token.
    /// @param config The asset's configuration.
    function addAsset(AssetConfig calldata config) external onlyOwner {
        _addAsset(config);
    }

    /// @notice Removes an underlying asset from the liquid restaking token.
    /// @param asset The address of the asset to remove.
    function removeAsset(address asset) external onlyOwner {
        if (!isSupportedAsset(asset)) revert ASSET_NOT_SUPPORTED(asset);
        if (getTVLForAsset(asset) > 0) revert ASSET_HAS_BALANCE();

        uint256 assetCount = supportedAssets.length;
        uint256 assetIndex = _findAssetIndex(asset);

        supportedAssets[assetIndex] = supportedAssets[assetCount - 1];
        supportedAssets.pop();

        delete assetInfo[asset];

        emit AssetRemoved(asset);
    }

    /// @dev Sets the asset's deposit cap.
    /// @param newDepositCap The new rebalance delay.
    function setAssetDepositCap(address asset, uint96 newDepositCap) external onlyOwner {
        if (!isSupportedAsset(asset)) revert ASSET_NOT_SUPPORTED(asset);

        assetInfo[asset].depositCap = newDepositCap;

        emit AssetDepositCapSet(asset, newDepositCap);
    }

    /// @dev Sets the asset's price feed.
    /// @param newPriceFeed The new price feed.
    function setAssetPriceFeed(address asset, address newPriceFeed) external onlyOwner {
        if (!isSupportedAsset(asset)) revert ASSET_NOT_SUPPORTED(asset);
        if (newPriceFeed == address(0)) revert INVALID_PRICE_FEED();

        assetInfo[asset].priceFeed = newPriceFeed;

        emit AssetPriceFeedSet(asset, newPriceFeed);
    }

    /// @notice Increases the number of EigenLayer shares held for an asset.
    /// @param asset The address of the asset.
    /// @param amount The amount of EigenLayer shares to increase.
    function increaseSharesHeldForAsset(address asset, uint256 amount) external onlyCoordinator {
        if (!isSupportedAsset(asset)) revert ASSET_NOT_SUPPORTED(asset);

        assetInfo[asset].shares += amount;
        emit AssetSharesIncreased(asset, amount);
    }

    /// @notice Decreases the number of EigenLayer shares held for an asset.
    /// @param asset The address of the asset.
    /// @param amount The amount of EigenLayer shares to decrease.
    function decreaseSharesHeldForAsset(address asset, uint256 amount) external onlyWithdrawalQueueOrOperatorRegistry {
        if (!isSupportedAsset(asset)) revert ASSET_NOT_SUPPORTED(asset);

        assetInfo[asset].shares -= amount;
        emit AssetSharesDecreased(asset, amount);
    }

    /// @dev Adds a new underlying asset to the liquid restaking token.
    /// @param config The asset's configuration.
    function _addAsset(AssetConfig calldata config) internal {
        if (isSupportedAsset(config.asset)) revert ASSET_ALREADY_SUPPORTED(config.asset);
        if (config.asset == address(0)) revert INVALID_ASSET_ADDRESS();

        uint8 decimals = config.asset == ETH_ADDRESS ? 18 : IERC20Metadata(config.asset).decimals();
        if (config.asset == ETH_ADDRESS) {
            if (config.priceFeed != address(0)) revert INVALID_PRICE_FEED();
            if (config.strategy != BEACON_CHAIN_STRATEGY) revert INVALID_STRATEGY();
        } else {
            if (decimals > 18) revert INVALID_ASSET_DECIMALS();
            if (config.priceFeed == address(0)) revert INVALID_PRICE_FEED();
            if (IPriceFeed(config.priceFeed).decimals() != priceFeedDecimals) revert INVALID_PRICE_FEED_DECIMALS();
            if (IStrategy(config.strategy).underlyingToken() != config.asset) revert INVALID_STRATEGY();
        }
        supportedAssets.push(config.asset);

        AssetInfo storage info = assetInfo[config.asset];
        info.decimals = decimals;
        info.depositCap = config.depositCap;
        info.priceFeed = config.priceFeed;
        info.strategy = config.strategy;

        emit AssetAdded(config);
    }

    /// @dev Returns the index of the asset in the supported assets array.
    /// @param asset The address of the asset.
    function _findAssetIndex(address asset) internal view returns (uint256) {
        uint256 assetCount = supportedAssets.length;
        for (uint256 i = 0; i < assetCount; ++i) {
            if (supportedAssets[i] == asset) {
                return i;
            }
        }
        revert ASSET_NOT_SUPPORTED(asset);
    }

    /// @notice Normalizes an amount from one decimal precision to another.
    /// @param amount The amount to normalize.
    /// @param fromDecimals The amount's current decimal precision.
    /// @param toDecimals The amount's target decimal precision.
    function _normalizeDecimals(uint256 amount, uint8 fromDecimals, uint8 toDecimals) internal pure returns (uint256) {
        // No adjustment needed if decimals are the same.
        if (fromDecimals == toDecimals) {
            return amount;
        }
        // Scale down to match the target decimal precision.
        if (fromDecimals > toDecimals) {
            return amount / 10 ** (fromDecimals - toDecimals);
        }
        // Scale up to match the target decimal precision.
        return amount * 10 ** (toDecimals - fromDecimals);
    }

    /// @dev Allows the owner to upgrade the asset registry implementation.
    /// @param newImplementation The implementation to upgrade to.
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
