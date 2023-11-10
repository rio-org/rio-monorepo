// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

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
        uint256 epoch;
        address token;
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
    event WithdrawalsQueuedForEpoch(uint256 indexed epoch, address indexed token, uint256 amount, bytes32 aggregateRoot);

    /// @notice Emitted when withdrawals are completed for an epoch.
    /// @param epoch The withdrawal epoch.
    /// @param token The withdrawal token.
    /// @param amount The sum of all withdrawals in the epoch.
    event WithdrawalsCompletedForEpoch(uint256 indexed epoch, address indexed token, uint256 amount);

    /// @notice Emitted when a withdrawal is queued.
    /// @param epoch The withdrawal epoch.
    /// @param token The withdrawal token.
    /// @param user The user who queued the withdrawal.
    /// @param amount The withdrawal amount.
    event WithdrawalQueued(uint256 indexed epoch, address indexed token, address indexed user, uint256 amount);

    /// @notice Emitted when a queued withdrawal is claimed.
    /// @param epoch The withdrawal epoch.
    /// @param token The withdrawal token.
    /// @param user The user who claimed the withdrawal.
    /// @param amount The withdrawal amount.
    event WithdrawalClaimed(uint256 indexed epoch, address indexed token, address indexed user, uint256 amount);

    /// @notice Initializes the withdrawal queue.
    /// @param initialOwner The initial owner of the contract.
    /// @param assetManager The LRT asset manager.
    function initialize(address initialOwner, address assetManager) external;

    /// @notice Retrieve the current withdrawal epoch for a given token.
    /// @param token The token for which to retrieve the current epoch.
    function getCurrentEpoch(address token) external view returns (uint256);

    /// @notice Retrieve the owed cash and completion status for a given token and epoch.
    /// @param token The token for which to retrieve the information.
    /// @param epoch The epoch for which to retrieve the information.
    function getEpochWithdrawals(address token, uint256 epoch) external view returns (uint248 owed, bool completed, bytes32 aggregateRoot);

    /// @notice Retrieve a user's withdrawal information for a given token and epoch.
    /// @param token The token for which to retrieve the user's withdrawal information.
    /// @param epoch The epoch for which to retrieve the user's withdrawal information.
    /// @param user The address of the user to retrieve the withdrawal information for.
    function getUserWithdrawal(address token, uint256 epoch, address user) external view returns (UserWithdrawal memory);

    /// @notice Get the amount of `token` owed to withdrawers in the current `epoch`.
    /// @param token The withdrawal token.
    function getAmountOwedInCurrentEpoch(address token) external view returns (uint256 amountOwed);

    /// @notice Queues token withdrawals for `withdrawer`.
    /// @param withdrawer The address requesting the exit.
    /// @param tokens The tokens to withdraw.
    function queueWithdrawals(address withdrawer, address[] memory tokens, uint256[] calldata amountsOut) external;

    /// @notice Records queued EigenLayer withdrawals for the current epoch.
    /// @param token The token to queue withdrawals for.
    /// @param aggregateRoot The aggregate root of the queued withdrawals.
    function recordQueuedEigenLayerWithdrawalsForCurrentEpoch(address token, bytes32 aggregateRoot) external;

    /// @notice Completes withdrawals from the pool's cash for the current epoch.
    /// @param token The token to complete withdrawals for.
    function completeWithdrawalsFromPoolForCurrentEpoch(address token) external;
}
