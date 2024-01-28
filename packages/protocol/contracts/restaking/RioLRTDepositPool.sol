// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {FixedPointMathLib} from '@solady/utils/FixedPointMathLib.sol';
import {IRioLRTDepositPool} from 'contracts/interfaces/IRioLRTDepositPool.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {UUPSUpgradeable} from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import {OperatorOperations} from 'contracts/utils/OperatorOperations.sol';
import {RioLRTCore} from 'contracts/restaking/base/RioLRTCore.sol';
import {ETH_ADDRESS} from 'contracts/utils/Constants.sol';
import {Asset} from 'contracts/utils/Asset.sol';

contract RioLRTDepositPool is IRioLRTDepositPool, OwnableUpgradeable, UUPSUpgradeable, RioLRTCore {
    using FixedPointMathLib for uint256;
    using Asset for address;

    /// @param issuer_ The LRT issuer that's authorized to deploy this contract.
    constructor(address issuer_) RioLRTCore(issuer_) {}

    /// @notice Initializes the deposit pool contract.
    /// @param initialOwner The initial owner of the contract.
    /// @param token_ The address of the liquid restaking token.
    function initialize(address initialOwner, address token_) external initializer {
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
        __RioLRTCore_init(token_);
    }

    /// @notice Deposits the entire deposit pool balance of the specified `asset` into EigenLayer.
    function depositBalanceIntoEigenLayer(address asset) external onlyCoordinator returns (uint256) {
        uint256 currentBalance = asset.getSelfBalance();
        if (asset == ETH_ADDRESS) {
            return OperatorOperations.depositETH(operatorRegistry(), currentBalance);
        }

        address strategy = assetRegistry().getAssetStrategy(asset);
        uint256 sharesToAllocate = assetRegistry().convertToSharesFromAsset(asset, currentBalance);
        return OperatorOperations.depositToken(operatorRegistry(), asset, strategy, sharesToAllocate);
    }

    /// @notice Transfers the maximum possible amount of assets based on the available
    /// pool balance and requested shares.
    /// @param asset The address of the asset to be transferred.
    /// @param sharesRequested The number of shares to convert into assets for transfer.
    /// @param recipient The address of the recipient of the transferred assets.
    /// @dev This function handles asset transfer by converting the share value to assets and
    /// ensures that either the requested amount or the maximum possible amount is transferred.
    function transferMaxAssetsForShares(address asset, uint256 sharesRequested, address recipient)
        external
        onlyCoordinator
        returns (uint256, uint256)
    {
        uint256 poolBalance = asset.getSelfBalance();
        uint256 poolBalanceShareValue = assetRegistry().convertToSharesFromAsset(asset, poolBalance);

        // Return early if the deposit pool has no balance or value for the given asset.
        if (poolBalance == 0 || poolBalanceShareValue == 0) {
            return (0, 0);
        }

        // If the deposit pool balance can cover the requested shares, transfer the equivalent assets.
        if (poolBalanceShareValue >= sharesRequested) {
            address strategy = assetRegistry().getAssetStrategy(asset);
            uint256 assetsSent = assetRegistry().convertFromSharesToAsset(strategy, sharesRequested);
            asset.transferTo(recipient, assetsSent);

            return (assetsSent, sharesRequested);
        }

        // Transfer the maximum possible assets from the deposit pool if it
        // cannot cover the requested shares.
        asset.transferTo(recipient, poolBalance);

        return (poolBalance, poolBalanceShareValue);
    }

    /// @dev Receives ETH for deposit into EigenLayer.
    receive() external payable {}

    /// @dev Allows the owner to upgrade the deposit pool implementation.
    /// @param newImplementation The implementation to upgrade to.
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
