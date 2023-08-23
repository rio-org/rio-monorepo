// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IERC20} from '@balancer-v2/contracts/interfaces/contracts/solidity-utils/openzeppelin/IERC20.sol';
import {IVault} from '@balancer-v2/contracts/interfaces/contracts/vault/IVault.sol';

interface IRioLRTAssetManager {
    function addToken(IERC20 tokenToAdd, uint256 tokenToAddBalance, IVault vault, bytes32 vaultPoolId) external;
    function removeToken(
        IERC20 tokenToRemove,
        uint256 tokenToRemoveBalance,
        IVault vault,
        bytes32 vaultPoolId,
        address recipient
    ) external;
}
