// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IERC20} from '@balancer-v2/contracts/interfaces/contracts/solidity-utils/openzeppelin/IERC20.sol';

interface IRioLRTWithdrawalQueue {
    /// @notice How much cash is owed to a user in a given epoch,
    /// as well as whether or not the user has claimed the withdrawal.
    struct UserWithdrawal {
        uint248 owed;
        bool claimed;
    }

    /// @notice How much cash is owed to all users in a given epoch,
    /// as well as whether or not the epoch's withdrawals have been completed.
    struct EpochWithdrawals {
        uint248 owed;
        bool completed;
        bytes32 aggregateRoot;
        mapping(address => UserWithdrawal) users;
    }

    /// @notice A withdrawal request made by a user.
    struct WithdrawalRequest {
        uint40 epoch;
        IERC20 token;
    }

    /// @notice Thrown when the caller is not the LRT asset manager.
    error ONLY_ASSET_MANAGER();

    /// @notice Thrown when no withdrawals are present in the epoch.
    error NO_WITHDRAWALS_IN_EPOCH();

    /// @notice Thrown when withdrawals have already been queued for the epoch.
    error WITHDRAWALS_ALREADY_QUEUED_FOR_EPOCH();

    /// @notice Thrown when withdrawals have already been completed for the epoch.
    error WITHDRAWALS_ALREADY_COMPLETED_FOR_EPOCH();

    /// @notice Thrown when withdrawals have already been queued from EigenLayer.
    error WITHDRAWALS_MUST_BE_COMPLETED_FROM_EIGEN_LAYER();

    /// @notice Thrown when withdrawal completion is attempted, but withdrawals have not been queued from EigenLayer.
    error WITHDRAWALS_NOT_QUEUED_FROM_EIGENLAYER_FOR_EPOCH();

    /// @notice Thrown when a withdrawal does not exist.
    error WITHDRAWAL_DOES_NOT_EXIST();

    /// @notice Thrown when a withdrawal has already claimed.
    error WITHDRAWAL_ALREADY_CLAIMED();

    /// @notice Thrown when an incorrect number of middleware times indexes are provided.
    error INVALID_MIDDLEWARE_TIMES_INDEXES_LENGTH();

    /// @notice Thrown when the calculated aggregate withdrawal root does not match the stored root.
    error INVALID_AGGREGATE_WITHDRAWAL_ROOT();

    /// @notice Emitted when withdrawals are queued for an epoch.
    /// @param epoch The withdrawal epoch.
    /// @param token The withdrawal token.
    /// @param amount The sum of all withdrawals in the epoch.
    /// @param aggregateRoot The aggregate root of the withdrawals.
    event WithdrawalsQueuedForEpoch(uint40 indexed epoch, IERC20 indexed token, uint256 amount, bytes32 aggregateRoot);

    /// @notice Emitted when withdrawals are completed for an epoch.
    /// @param epoch The withdrawal epoch.
    /// @param token The withdrawal token.
    /// @param amount The sum of all withdrawals in the epoch.
    event WithdrawalsCompletedForEpoch(uint40 indexed epoch, IERC20 indexed token, uint256 amount);

    /// @notice Emitted when a withdrawal is queued.
    /// @param epoch The withdrawal epoch.
    /// @param token The withdrawal token.
    /// @param user The user who queued the withdrawal.
    /// @param amount The withdrawal amount.
    event WithdrawalQueued(uint40 indexed epoch, IERC20 indexed token, address indexed user, uint256 amount);

    /// @notice Emitted when a queued withdrawal is claimed.
    /// @param epoch The withdrawal epoch.
    /// @param token The withdrawal token.
    /// @param user The user who claimed the withdrawal.
    /// @param amount The withdrawal amount.
    event WithdrawalClaimed(uint40 indexed epoch, IERC20 indexed token, address indexed user, uint256 amount);

    /// @notice Initializes the withdrawal queue.
    /// @param initialOwner The initial owner of the contract.
    /// @param poolId The LRT Balancer pool ID.
    /// @param assetManager The LRT asset manager.
    function initialize(address initialOwner, bytes32 poolId, address assetManager) external;

    /// @notice Get the amount of `token` owed to withdrawers in the current `epoch`.
    /// @param token The withdrawal token.
    function getAmountOwedInCurrentEpoch(IERC20 token) external view returns (uint256 amountOwed);

    /// @notice Records queued EigenLayer withdrawals for the current epoch.
    /// @param token The token to queue withdrawals for.
    /// @param aggregateRoot The aggregate root of the queued withdrawals.
    function recordQueuedEigenLayerWithdrawalsForCurrentEpoch(IERC20 token, bytes32 aggregateRoot) external;

    /// @notice Completes withdrawals from the pool's cash for the current epoch.
    /// @param token The token to complete withdrawals for.
    function completeWithdrawalsFromPoolForCurrentEpoch(IERC20 token) external;
}
