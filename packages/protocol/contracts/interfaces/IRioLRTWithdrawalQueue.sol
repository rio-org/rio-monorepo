// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

interface IRioLRTWithdrawalQueue {
    /// @notice How many shares are owed to a user in a given epoch,
    /// as well as whether or not the user has completed the withdrawal.
    struct UserWithdrawal {
        /// @dev Indicates whether or not the user has completed the withdrawal.
        bool claimed;
        /// @dev The amount of shares owed to the user. Owed shares will
        /// be available to the user upon epoch settlement.
        uint112 shares;
    }

    /// @notice How much cash is owed to all users in a given epoch,
    /// as well as whether or not the epoch's withdrawals have been completed.
    struct EpochWithdrawals {
        /// @dev Indicates whether or not the epoch has been settled.
        bool settled;
        /// @dev The total number of shares owed to users in the epoch.
        uint112 shares;
        /// @dev The conversion rate from shares to tokens at the time
        /// of epoch settlement (0 if not settled).
        uint112 conversionRate;
        /// @dev The aggregate root of the queued EigenLayer withdrawals.
        bytes32 aggregateRoot;
        /// @dev All user withdrawals in the epoch.
        mapping(address => UserWithdrawal) users;
    }

    /// @notice A withdrawal request made by a user.
    struct WithdrawalRequest {
        uint256 epoch;
        address token;
    }

    /// @notice Thrown when the caller is not the LRT asset manager.
    error ONLY_ASSET_MANAGER();

    /// @notice Thrown when the caller is not the LRT gateway.
    error ONLY_LRT_GATEWAY();

    /// @notice Thrown when no shares are owed in the epoch.
    error NO_SHARES_OWED_IN_EPOCH();

    /// @notice Thrown when withdrawals have already been queued for the epoch.
    error WITHDRAWALS_ALREADY_QUEUED_FOR_EPOCH();

    /// @notice Thrown when withdrawals have already been settled for the epoch.
    error WITHDRAWALS_ALREADY_SETTLED_FOR_EPOCH();

    /// @notice Thrown when withdrawals have already been queued from EigenLayer.
    error WITHDRAWALS_MUST_BE_COMPLETED_FROM_EIGEN_LAYER();

    /// @notice Thrown when withdrawal completion is attempted, but withdrawals have not been queued from EigenLayer.
    error WITHDRAWALS_NOT_QUEUED_FROM_EIGENLAYER_FOR_EPOCH();

    /// @notice Thrown when a withdrawal is attempted for an epoch that has not been settled.
    error EPOCH_NOT_SETTLED();

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
    /// @param shares The sum of all shares owed in the epoch.
    /// @param aggregateRoot The aggregate root of the withdrawals.
    event WithdrawalsQueuedForEpoch(
        uint256 indexed epoch, address indexed token, uint256 shares, bytes32 aggregateRoot
    );

    /// @notice Emitted when withdrawals are completed from the pool's cash for an epoch.
    /// @param epoch The withdrawal epoch.
    /// @param token The withdrawal token.
    /// @param shares The sum of all shares owed in the epoch.
    /// @param cash The amount of tokens withdrawn from the pool.
    event WithdrawalsSettledFromPoolForEpoch(
        uint256 indexed epoch, address indexed token, uint256 shares, uint256 cash
    );

    /// @notice Emitted when withdrawals are completed from EigenLayer for an epoch.
    /// @param epoch The withdrawal epoch.
    /// @param token The withdrawal token.
    /// @param shares The sum of all shares owed in the epoch.
    /// @param cash The amount of tokens withdrawn from EigenLayer.
    event WithdrawalsSettledFromEigenLayerForEpoch(
        uint256 indexed epoch, address indexed token, uint256 shares, uint256 cash
    );

    /// @notice Emitted when a withdrawal is queued.
    /// @param epoch The withdrawal epoch.
    /// @param token The withdrawal token.
    /// @param user The user who queued the withdrawal.
    /// @param shares The withdrawal amount, in shares.
    event WithdrawalQueued(uint256 indexed epoch, address indexed token, address indexed user, uint256 shares);

    /// @notice Emitted when a queued withdrawal is claimed.
    /// @param epoch The withdrawal epoch.
    /// @param token The withdrawal token.
    /// @param user The user who claimed the withdrawal.
    /// @param shares The withdrawal amount, in shares.
    /// @param cash The withdrawal amount, in tokens.
    event WithdrawalClaimed(
        uint256 indexed epoch, address indexed token, address indexed user, uint256 shares, uint256 cash
    );

    /// @notice Initializes the withdrawal queue.
    /// @param initialOwner The initial owner of the contract.
    /// @param gateway The LRT gateway.
    /// @param assetManager The LRT asset manager.
    function initialize(address initialOwner, address gateway, address assetManager) external;

    /// @notice Retrieve the current withdrawal epoch for a given token.
    /// @param token The token for which to retrieve the current epoch.
    function getCurrentEpoch(address token) external view returns (uint256);

    // forgefmt: disable-next-item
    /// @notice Retrieve the owed cash and settlement status for a given token and epoch.
    /// @param token The token for which to retrieve the information.
    /// @param epoch The epoch for which to retrieve the information.
    function getEpochWithdrawals(address token, uint256 epoch) external view returns (uint112 sharesOwed, bool settled, bytes32 aggregateRoot);

    // forgefmt: disable-next-item
    /// @notice Retrieve a user's withdrawal information for a given token and epoch.
    /// @param token The token for which to retrieve the user's withdrawal information.
    /// @param epoch The epoch for which to retrieve the user's withdrawal information.
    /// @param user The address of the user to retrieve the withdrawal information for.
    function getUserWithdrawal(address token, uint256 epoch, address user)
        external
        view
        returns (UserWithdrawal memory);

    /// @notice Get the amount of shares owed to withdrawers in the current `epoch` for `token`.
    /// @param token The withdrawal token.
    function getSharesOwedInCurrentEpoch(address token) external view returns (uint256 sharesOwed);

    /// @notice Records queued EigenLayer withdrawals for the current epoch.
    /// @param token The token to queue withdrawals for.
    /// @param aggregateRoot The aggregate root of the queued withdrawals.
    function recordQueuedEigenLayerWithdrawalsForCurrentEpoch(address token, bytes32 aggregateRoot) external;

    /// @notice Settles withdrawals from the pool's cash for the current epoch.
    /// @param token The token to settle withdrawals for.
    function settleWithdrawalsFromPoolForCurrentEpoch(address token) external;

    /// @notice Queue `shares` of `token` to `withdrawer` in the current epoch. These owed
    /// shares can be claimed as tokens by the withdrawer once the current epoch is settled.
    /// @param withdrawer The address requesting the exit.
    /// @param token The address of the token for which the withdrawal is being queued.
    /// @param shares The number of shares to queue.
    function queueWithdrawal(address withdrawer, address token, uint112 shares) external;
}
