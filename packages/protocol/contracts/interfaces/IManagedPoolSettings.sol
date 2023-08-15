// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {IVault} from '@balancer-v2/contracts/interfaces/contracts/vault/IVault.sol';
import {IProtocolFeePercentagesProvider} from '@balancer-v2/contracts/interfaces/contracts/standalone-utils/IProtocolFeePercentagesProvider.sol';
import {IExternalWeightedMath} from '@balancer-v2/contracts/interfaces/contracts/pool-weighted/IExternalWeightedMath.sol';
import {IRecoveryModeHelper} from '@balancer-v2/contracts/interfaces/contracts/pool-utils/IRecoveryModeHelper.sol';

interface IManagedPoolSettings {
    struct ManagedPoolParams {
        string name;
        string symbol;
        address[] assetManagers;
    }

    struct ManagedPoolConfigParams {
        IVault vault;
        IProtocolFeePercentagesProvider protocolFeeProvider;
        IExternalWeightedMath weightedMath;
        IRecoveryModeHelper recoveryModeHelper;
        uint256 pauseWindowDuration;
        uint256 bufferPeriodDuration;
        string version;
    }

    struct ManagedPoolSettingsParams {
        IERC20[] tokens;
        uint256[] normalizedWeights;
        uint256 swapFeePercentage;
        bool swapEnabledOnStart;
        bool mustAllowlistLPs;
        uint256 managementAumFeePercentage;
        uint256 aumFeeId;
    }
}
