// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

interface IRioLRTDepositPool {
    /// @notice Thrown when the caller is not the LRT coordinator.
    error ONLY_COORDINATOR();

    /// @notice Initializes the deposit pool contract.
    /// @param initialOwner The initial owner of the contract.
    /// @param assetRegistry The address of the asset registry contract.
    /// @param operatorRegistry The address of the operator registry contract.
    /// @param coordinator The address of the coordinator contract.
    function initialize(address initialOwner, address assetRegistry, address operatorRegistry, address coordinator)
        external;

    /// @notice Deposits the entire deposit pool balance of the specified `asset` into EigenLayer.
    function depositBalanceIntoEigenLayer(address asset) external returns (uint256);

    /// @notice Transfers the maximum possible amount of assets based on the available
    /// pool balance and requested shares.
    /// @param asset The address of the asset to be transferred.
    /// @param sharesRequested The number of shares to convert into assets for transfer.
    /// @param recipient The address of the recipient of the transferred assets.
    /// @dev This function handles asset transfer by converting the share value to assets and
    /// ensures that either the requested amount or the maximum possible amount is transferred.
    function transferMaxAssetsForShares(address asset, uint256 sharesRequested, address recipient)
        external
        returns (uint256, uint256);
}
