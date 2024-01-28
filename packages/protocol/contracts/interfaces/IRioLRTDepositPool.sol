// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

interface IRioLRTDepositPool {
    /// @notice Initializes the deposit pool contract.
    /// @param initialOwner The initial owner of the contract.
    /// @param token The address of the liquid restaking token.
    function initialize(address initialOwner, address token) external;

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
