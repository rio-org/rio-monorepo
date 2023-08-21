// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {IManagedPoolSettings} from './IManagedPoolSettings.sol';

interface IRioLRTIssuer {
    /// @notice Information required to issue a new liquid restaking token.
    struct LRTConfig {
        uint256[] amountsIn;
        address[] allowedLPs;
        address securityCouncil;
        IManagedPoolSettings.ManagedPoolSettingsParams settings;
    }

    /// @notice The pool join kind.
    enum JoinKind {
        INIT,
        EXACT_TOKENS_IN_FOR_BPT_OUT,
        TOKEN_IN_FOR_EXACT_BPT_OUT,
        ALL_TOKENS_IN_FOR_EXACT_BPT_OUT
    }

    /// @notice Thrown when the provided input does not match the expected length.
    error INPUT_LENGTH_MISMATCH();

    /// @notice Thrown when the swap fee is too high.
    error SWAP_FEE_TOO_HIGH();

    /// @notice Thrown when the AUM fee is too high.
    error AUM_FEE_TOO_HIGH();

    /// @notice Thrown when the LP allowlist is enabled, but no LPs have been allowlisted.
    error NO_LPS_ALLOWLISTED();

    /// @notice Thrown when the LP allowlist is disabled, but LPs have been allowlisted.
    error ALLOWLIST_DISABLED_BUT_LPS_ALLOWLISTED();

    /// @notice Emitted when a new liquid restaking token is issued.
    /// @param id The LRT pool ID.
    /// @param name The name of the new LRT.
    /// @param symbol The symbol of the new LRT.
    /// @param tokens The underlying tokens of the LRT.
    /// @param controller The LRT controller.
    event LiquidRestakingTokenIssued(bytes32 id, string name, string symbol, IERC20[] tokens, address controller);
}
