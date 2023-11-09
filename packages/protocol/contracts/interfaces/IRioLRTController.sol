// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IERC20} from '@balancer-v2/contracts/interfaces/contracts/solidity-utils/openzeppelin/IERC20.sol';
import {IManagedPoolSettings} from 'contracts/interfaces/balancer/IManagedPoolSettings.sol';

interface IRioLRTController {
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

    /// @notice Thrown when the underlying token of the provided strategy is not the pool token.
    error INVALID_STRATEGY_FOR_TOKEN();

    /// @notice Emitted when the security council is updated by the owner.
    event SecurityCouncilChanged(address newSecurityCouncil);

    /// @notice Emitted when the security daemon's wallet is updated by the owner or the security council.
    event SecurityDaemonChanged(address newSecurityDaemon);

    // forgefmt: disable-next-item
    /// @notice Initializes the controller.
    /// @param initialOwner The initial owner of the contract.
    /// @param pool The pool (LRT) that's controlled by this contract.
    /// @param assetManager The contract in charge of managing the LRT's assets.
    /// @param securityCouncil The address of the DAO-managed security council.
    /// @param allowedLPs The addresses of the LPs that are allowed to join the pool.
    function initialize(address initialOwner, address pool, address assetManager, address securityCouncil, address[] calldata allowedLPs) external;

    /// @notice The pool (LRT) that's controlled by this contract.
    function pool() external view returns (IManagedPoolSettings);

    /// @notice The security daemon's wallet, which is controlled by the security council and owner.
    /// The security daemon is responsible for removal of duplicate or invalid validator keys.
    function securityDaemon() external view returns (address);
}
