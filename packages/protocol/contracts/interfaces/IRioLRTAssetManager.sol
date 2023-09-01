// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IERC20} from '@balancer-v2/contracts/interfaces/contracts/solidity-utils/openzeppelin/IERC20.sol';
import {IVault} from '@balancer-v2/contracts/interfaces/contracts/vault/IVault.sol';
import {IStrategy} from './eigenlayer/IStrategy.sol';

interface IRioLRTAssetManager {
    /// @notice The asset management configuration for a token.
    struct TokenConfig {
        uint96 targetAUMPercentage;
        IStrategy strategy;
    }

    /// @notice Thrown when the caller is not the LRT controller for the asset manager.
    error ONLY_LRT_CONTROLLER();

    /// @notice Thrown when the strategy is invalid.
    error INVALID_STRATEGY();

    function addToken(IERC20 tokenToAdd, uint256 tokenToAddBalance, IVault vault, bytes32 vaultPoolId) external;

    function removeToken(
        IERC20 tokenToRemove,
        uint256 tokenToRemoveBalance,
        IVault vault,
        bytes32 vaultPoolId,
        address recipient
    ) external;
}
