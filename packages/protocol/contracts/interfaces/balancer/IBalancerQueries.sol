// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IVault} from 'contracts/interfaces/balancer/IVault.sol';

/// @dev Provides a way to perform queries on swaps, joins and exits, simulating these operations and returning the exact
/// result they would have if called on the Vault given the current state. Note that the results will be affected by
/// other transactions interacting with the Pools involved.
///
/// All query functions can be called both on-chain and off-chain.
///
/// If calling them from a contract, note that all query functions are not `view`. Despite this, these functions produce
/// no net state change, and for all intents and purposes can be thought of as if they were indeed `view`. However,
/// calling them via STATICCALL will fail.
///
/// If calling them from an off-chain client, make sure to use eth_call: most clients default to eth_sendTransaction for
/// non-view functions.
///
/// In all cases, the `fromInternalBalance` and `toInternalBalance` fields are entirely ignored: we just use the same
/// structs for simplicity.
interface IBalancerQueries {
    function querySwap(IVault.SingleSwap memory singleSwap, IVault.FundManagement memory funds)
        external
        returns (uint256);

    function queryBatchSwap(
        IVault.SwapKind kind,
        IVault.BatchSwapStep[] memory swaps,
        address[] memory assets,
        IVault.FundManagement memory funds
    ) external returns (int256[] memory assetDeltas);

    function queryJoin(bytes32 poolId, address sender, address recipient, IVault.JoinPoolRequest memory request)
        external
        returns (uint256 bptOut, uint256[] memory amountsIn);

    function queryExit(bytes32 poolId, address sender, address recipient, IVault.ExitPoolRequest memory request)
        external
        returns (uint256 bptIn, uint256[] memory amountsOut);
}
