// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

interface IPoolController {
    /// @notice Thrown when the contract has already been initialized
    /// or the provided pool address is invalid.
    error INVALID_INITIALIZATION();

    /// @notice Thrown when the caller is not the owner or the security council.
    error ONLY_OWNER_OR_SECURITY_COUNCIL();

    /// @notice Thrown when the token weight change duration is too fast.
    error WEIGHT_CHANGE_TOO_FAST();

    /// @notice Thrown when the swap fee is too high.
    error SWAP_FEE_TOO_HIGH();

    /// @notice Thrown when the swap fee end time is less than the start time.
    error INVALID_SWAP_FEE_END_TIME();

    /// @notice Thrown when the AUM fee is too high.
    error AUM_FEE_TOO_HIGH();

    /// @notice Emitted when the security council is updated by the owner.
    /// @param newSecurityCouncil The new security council address.
    event SecurityCouncilChanged(address newSecurityCouncil);
}
