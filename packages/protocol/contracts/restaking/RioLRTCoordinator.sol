// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {IRioLRTWithdrawalQueue} from 'contracts/interfaces/IRioLRTWithdrawalQueue.sol';
import {UUPSUpgradeable} from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {IRioLRTOperatorRegistry} from 'contracts/interfaces/IRioLRTOperatorRegistry.sol';
import {IRioLRTAssetRegistry} from 'contracts/interfaces/IRioLRTAssetRegistry.sol';
import {IRioLRTCoordinator} from 'contracts/interfaces/IRioLRTCoordinator.sol';
import {IRioLRTDepositPool} from 'contracts/interfaces/IRioLRTDepositPool.sol';
import {OperatorOperations} from 'contracts/utils/OperatorOperations.sol';
import {ETH_ADDRESS} from 'contracts/utils/Constants.sol';
import {IRioLRT} from 'contracts/interfaces/IRioLRT.sol';
import {Asset} from 'contracts/utils/Asset.sol';

contract RioLRTCoordinator is IRioLRTCoordinator, OwnableUpgradeable, UUPSUpgradeable {
    using OperatorOperations for IRioLRTOperatorRegistry;
    using SafeERC20 for IERC20;
    using Asset for address;

    /// @notice The liquid restaking token (LRT).
    IRioLRT public restakingToken;

    /// @notice The contract that stores information about supported underlying assets.
    IRioLRTAssetRegistry public assetRegistry;

    /// @notice The operator registry used allocate to and deallocate from EigenLayer operators.
    IRioLRTOperatorRegistry public operatorRegistry;

    /// @notice The contract that holds funds awaiting deposit into EigenLayer.
    IRioLRTDepositPool public depositPool;

    /// @notice The contract used to queue and process withdrawals.
    IRioLRTWithdrawalQueue public withdrawalQueue;

    /// @notice The required delay between rebalances.
    uint24 public rebalanceDelay;

    /// @notice Tracks the last timestamp when each asset was rebalanced.
    mapping(address asset => uint256 timestamp) public assetLastRebalancedAt;

    /// @notice Tracks the amount of EigenLayer shares owned by the LRT.
    mapping(address asset => uint256 shares) public assetSharesHeld;

    /// @notice Require that the asset deposit cap has not been reached.
    /// @param asset The asset being deposited.
    /// @param amountIn The amount of the asset being deposited.
    modifier onlyIfCapNotReached(address asset, uint256 amountIn) {
        _checkDepositCapReached(asset, amountIn);
        _;
    }

    /// @notice First, require that the rebalance delay has been met. Then,
    /// update the last rebalanced timestamp.
    /// @param asset The asset being rebalanced.
    modifier onRebalance(address asset) {
        _checkRebalanceDelayMet(asset);
        assetLastRebalancedAt[asset] = uint40(block.timestamp);
        _;
    }

    /// @dev Prevent any future reinitialization.
    constructor() {
        _disableInitializers();
    }

    /// @dev Initializes the contract.
    /// @param initialOwner The owner of the contract.
    /// @param restakingToken_ The liquid restaking token (LRT).
    /// @param assetRegistry_ The contract that stores information about supported underlying assets.
    /// @param operatorRegistry_ The operator registry used allocate to and deallocate from EigenLayer operators.
    /// @param depositPool_ The contract in charge of holding funds awaiting deposit into EigenLayer.
    /// @param withdrawalQueue_ The contract used to queue and process withdrawals.
    function initialize(
        address initialOwner,
        address restakingToken_,
        address assetRegistry_,
        address operatorRegistry_,
        address depositPool_,
        address withdrawalQueue_
    ) external initializer {
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();

        restakingToken = IRioLRT(restakingToken_);
        assetRegistry = IRioLRTAssetRegistry(assetRegistry_);
        operatorRegistry = IRioLRTOperatorRegistry(operatorRegistry_);
        depositPool = IRioLRTDepositPool(depositPool_);
        withdrawalQueue = IRioLRTWithdrawalQueue(withdrawalQueue_);

        _setRebalanceDelay(24 hours);
    }

    /// @notice Returns the total value of all underlying assets in the unit of account.
    function getTVL() public view returns (uint256 value) {
        address[] memory assets = assetRegistry.getSupportedAssets();
        for (uint256 i = 0; i < assets.length; ++i) {
            value += getTVLForAsset(assets[i]);
        }
    }

    /// @notice Returns the total value of the underlying asset in the unit of account.
    /// @param asset The address of the asset.
    function getTVLForAsset(address asset) public view returns (uint256) {
        return assetRegistry.convertToUnitOfAccountFromAsset(asset, getTotalBalanceForAsset(asset));
    }

    /// @notice Returns the total balance of the asset, including the deposit pool and EigenLayer.
    /// @param asset The address of the asset.
    function getTotalBalanceForAsset(address asset) public view returns (uint256) {
        uint256 sharesHeld = assetSharesHeld[asset];
        if (asset == ETH_ADDRESS) {
            return address(depositPool).balance + sharesHeld;
        }

        IRioLRTAssetRegistry.AssetInfo memory info = assetRegistry.getAssetInfoByAddress(asset);

        uint256 tokensInRio = IERC20(asset).balanceOf(address(depositPool));
        uint256 tokensInEigenLayer = assetRegistry.convertFromSharesToAsset(info.strategy, sharesHeld);

        return tokensInRio + tokensInEigenLayer;
    }

    /// @notice Deposits ERC20 tokens and mints restaking token(s) to the caller.
    /// @param token The token being deposited.
    /// @param amountIn The amount of the asset being deposited.
    function deposit(address token, uint256 amountIn) external payable onlyIfCapNotReached(token, amountIn) {
        if (!assetRegistry.isSupportedAsset(token)) revert ASSET_NOT_SUPPORTED(token);

        // Pull tokens from the sender to the deposit pool.
        IERC20(token).safeTransferFrom(msg.sender, address(depositPool), amountIn);

        // Convert deposited asset amount to restaking tokens.
        uint256 amountOut = convertFromAssetToRestakingTokens(token, amountIn);

        // Mint restaking tokens to the caller.
        restakingToken.mint(msg.sender, amountOut);

        emit Deposited(msg.sender, token, amountIn, amountOut);
    }

    /// @notice Deposits ETH and mints restaking token(s) to the caller.
    function depositETH() external payable {
        _depositETH();
    }

    /// @notice Requests a withdrawal to `asset` for `amountIn` restaking tokens.
    /// @param asset The asset being withdrawn.
    /// @param amountIn The amount of restaking tokens being redeemed.
    function requestWithdrawal(address asset, uint256 amountIn) external {
        uint256 sharesOwed = convertToSharesFromRestakingTokens(asset, amountIn);

        IERC20(address(restakingToken)).safeTransferFrom(msg.sender, address(withdrawalQueue), amountIn);

        if (sharesOwed > assetSharesHeld[asset] - withdrawalQueue.getSharesOwedInCurrentEpoch(asset)) {
            revert INSUFFICIENT_SHARES_FOR_WITHDRAWAL();
        }
        withdrawalQueue.queueWithdrawal(msg.sender, asset, sharesOwed, amountIn);

        emit WithdrawalRequested(msg.sender, asset, sharesOwed, amountIn);
    }

    /// @notice Rebalances the provided `asset` by processing outstanding withdrawals and
    /// depositing remaining assets into EigenLayer.
    /// @param asset The asset to rebalance.
    function rebalance(address asset) external onRebalance(asset) {
        uint256 sharesOwed = withdrawalQueue.getSharesOwedInCurrentEpoch(asset);
        if (sharesOwed > 0) {
            _processUserWithdrawalsForCurrentEpoch(asset, sharesOwed);
        }

        assetSharesHeld[asset] += depositPool.depositBalanceIntoEigenLayer(asset);
    }

    /// @notice Sets the rebalance delay.
    /// @param newRebalanceDelay The new rebalance delay.
    function setRebalanceDelay(uint24 newRebalanceDelay) external onlyOwner {
        _setRebalanceDelay(newRebalanceDelay);
    }

    /// @notice Converts the unit of account value to its equivalent in restaking tokens.
    /// The unit of account is the price feed's quote asset.
    /// @param value The restaking token's value in the unit of account.
    function convertFromUnitOfAccountToRestakingTokens(uint256 value) public view returns (uint256) {
        uint256 tvl = getTVL();
        uint256 supply = restakingToken.totalSupply();

        if (supply == 0) {
            return value;
        }
        return value * supply / tvl;
    }

    /// @notice Converts an amount of restaking tokens to its equivalent value in the unit of account.
    /// The unit of account is the price feed's quote asset.
    /// @param amount The amount of restaking tokens to convert.
    function convertToUnitOfAccountFromRestakingTokens(uint256 amount) public view returns (uint256) {
        uint256 tvl = getTVL();
        uint256 supply = restakingToken.totalSupply();

        if (supply == 0) {
            return amount;
        }
        return tvl * amount / supply;
    }

    /// @notice Converts an asset amount to its equivalent value in restaking tokens.
    /// @param asset The address of the asset to convert.
    /// @param amount The amount of the asset to convert.
    function convertFromAssetToRestakingTokens(address asset, uint256 amount) public view returns (uint256) {
        uint256 value = assetRegistry.convertToUnitOfAccountFromAsset(asset, amount);
        return convertFromUnitOfAccountToRestakingTokens(value);
    }

    /// @notice Converts an amount of restaking tokens to the equivalent in the asset.
    /// @param asset The address of the asset to convert to.
    /// @param amount The amount of restaking tokens to convert.
    function convertToAssetFromRestakingTokens(address asset, uint256 amount) public view returns (uint256) {
        uint256 value = convertToUnitOfAccountFromRestakingTokens(amount);
        return assetRegistry.convertFromUnitOfAccountToAsset(asset, value);
    }

    /// @notice Converts an amount of restaking tokens to the equivalent in the provided
    /// asset's EigenLayer shares.
    /// @param asset The address of the asset whose EigenLayer shares to convert to.
    /// @param amount The amount of restaking tokens to convert.
    function convertToSharesFromRestakingTokens(address asset, uint256 amount) public view returns (uint256 shares) {
        uint256 assetAmount = convertToAssetFromRestakingTokens(asset, amount);
        return assetRegistry.convertToSharesFromAsset(asset, assetAmount);
    }

    /// @notice Deposits ETH and mints restaking token(s) to the caller.
    receive() external payable {
        _depositETH();
    }

    /// @notice Deposits ETH and mints restaking token(s) to the caller.
    /// @dev This function assumes that the quote asset is ETH.
    function _depositETH() internal onlyIfCapNotReached(ETH_ADDRESS, msg.value) {
        if (!assetRegistry.isSupportedAsset(ETH_ADDRESS)) revert ASSET_NOT_SUPPORTED(ETH_ADDRESS);

        // Forward ETH to the deposit pool.
        address(depositPool).transferETH(msg.value);

        // Convert deposited ETH to restaking tokens and mint to the caller.
        uint256 amountOut = convertFromUnitOfAccountToRestakingTokens(msg.value);
        restakingToken.mint(msg.sender, amountOut);

        emit Deposited(msg.sender, ETH_ADDRESS, msg.value, amountOut);
    }

    /// @dev Sets the rebalance delay.
    /// @param newRebalanceDelay The new rebalance delay.
    function _setRebalanceDelay(uint24 newRebalanceDelay) internal {
        rebalanceDelay = newRebalanceDelay;

        emit RebalanceDelaySet(newRebalanceDelay);
    }

    /// @dev Checks if the deposit cap for the asset has been reached.
    /// @param asset The address of the asset.
    /// @param amountIn The amount of the asset being deposited.
    function _checkDepositCapReached(address asset, uint256 amountIn) internal view {
        uint256 depositCap = assetRegistry.getAssetDepositCap(asset);
        uint256 existingBalance = getTotalBalanceForAsset(asset);
        if (depositCap != 0 && existingBalance + amountIn > depositCap) {
            revert DEPOSIT_CAP_REACHED(asset, depositCap);
        }
    }

    /// @dev Processes user withdrawals for the provided asset by transferring available
    /// assets from the deposit pool and queueing any remaining amount for withdrawal from
    /// EigenLayer.
    /// @param asset The asset being withdrawn.
    /// @param sharesOwed The amount of shares owed to users.
    function _processUserWithdrawalsForCurrentEpoch(address asset, uint256 sharesOwed) internal {
        (uint256 assetsSent, uint256 sharesSent) = depositPool.transferMaxAssetsForShares(
            asset,
            sharesOwed,
            address(withdrawalQueue)
        );
        uint256 sharesRemaining = sharesOwed - sharesSent;

        // Exit early if all pending withdrawals were paid from the deposit pool.
        if (sharesRemaining == 0) {
            withdrawalQueue.settleCurrentEpoch(asset, sharesSent, assetsSent);
            return;
        }

        address strategy = assetRegistry.getAssetStrategy(asset);
        bytes32 aggregateRoot = operatorRegistry.queueWithdrawals(
            strategy,
            sharesRemaining,
            address(withdrawalQueue)
        );
        withdrawalQueue.queueCurrentEpochSettlement(asset, sharesSent, assetsSent, aggregateRoot);
    }

    /// @dev Reverts if the rebalance delay has not been met.
    /// @param asset The asset being rebalanced.
    function _checkRebalanceDelayMet(address asset) internal view {
        uint256 lastRebalancedAt = assetLastRebalancedAt[asset];
        if (lastRebalancedAt > 0 && block.timestamp - lastRebalancedAt < rebalanceDelay) {
            revert REBALANCE_DELAY_NOT_MET();
        }
    }

    /// @dev Allows the owner to upgrade the gateway implementation.
    /// @param newImplementation The implementation to upgrade to.
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
