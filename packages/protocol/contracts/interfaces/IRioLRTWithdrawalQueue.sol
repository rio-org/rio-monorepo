// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

interface IRioLRTWithdrawalQueue {
    /// @notice How many shares are owed to a user in a given epoch,
    /// as well as whether or not the user has completed the withdrawal.
    struct UserWithdrawalSummary {
        /// @dev Indicates whether or not the user has completed the withdrawal.
        bool claimed;
        /// @dev The amount of shares owed to the user. Owed shares will
        /// be available to the user upon epoch settlement.
        uint120 sharesOwed;
    }

    /// @notice How many shares owed to all users in a given epoch,
    /// as well as whether or not the epoch's withdrawals have been completed.
    struct EpochWithdrawals {
        /// @dev Indicates whether or not the epoch has been settled.
        bool settled;
        /// @dev The amount of assets received to settle the epoch.
        uint120 assetsReceived;
        /// @dev The value of the assets received in EigenLayer shares at
        /// the time that the assets were received.
        uint120 shareValueOfAssetsReceived;
        /// @dev The total number of shares owed to users in the epoch.
        uint120 sharesOwed;
        /// @dev The aggregate root of the queued EigenLayer withdrawals.
        bytes32 aggregateRoot;
        /// @dev The amount of restaking tokens that to burn upon epoch settlement.
        uint256 amountToBurnAtSettlement;
        /// @dev All user withdrawals in the epoch.
        mapping(address => UserWithdrawalSummary) users;
    }

    /// @notice Epoch withdrawal information without the mapping, which
    /// allows us to return the struct from a view function.
    struct EpochWithdrawalSummary {
        /// @dev Indicates whether or not the epoch has been settled.
        bool settled;
        /// @dev The amount of assets received to settle the epoch.
        uint120 assetsReceived;
        /// @dev The value of the assets received in EigenLayer shares at
        /// the time that the assets were received.
        uint120 shareValueOfAssetsReceived;
        /// @dev The total number of shares owed to users in the epoch.
        uint120 sharesOwed;
        /// @dev The aggregate root of the queued EigenLayer withdrawals.
        bytes32 aggregateRoot;
        /// @dev The amount of restaking tokens that to burn upon epoch settlement.
        uint256 amountToBurnAtSettlement;
    }

    /// @notice The information needed to claim an owed asset in a given epoch.
    struct ClaimRequest {
        address asset;
        uint256 epoch;
    }

    /// @notice Thrown when attempting to queue a withdrawal with no shares owed.
    error NO_SHARES_OWED();

    /// @notice Thrown when attempting an operation on an epoch in which no shares are owed.
    error NO_SHARES_OWED_IN_EPOCH();

    /// @notice Thrown when attempting to settle an epoch that has already been settled.
    error EPOCH_ALREADY_SETTLED();

    /// @notice Thrown when attempting to withdraw from an epoch that has not been settled.
    error EPOCH_NOT_SETTLED();

    /// @notice Thrown when attempting to queue withdrawals for an epoch that has already been queued.
    error WITHDRAWALS_ALREADY_QUEUED_FOR_EPOCH();

    /// @notice Thrown when attempting to settle an epoch that has not been queued from EigenLayer.
    error WITHDRAWALS_NOT_QUEUED_FOR_EPOCH();

    /// @notice Thrown when attempting to claim a withdrawal that has already been claimed.
    error WITHDRAWAL_ALREADY_CLAIMED();

    /// @notice Thrown when the calculated aggregate withdrawal root does not match the stored root.
    error INVALID_AGGREGATE_WITHDRAWAL_ROOT();

    /// @notice Thrown when an incorrect number of middleware times indexes are provided.
    error INVALID_MIDDLEWARE_TIMES_INDEXES_LENGTH();

    /// @notice Emitted when a user withdrawal is queued.
    /// @param epoch The epoch containing the withdrawal.
    /// @param asset The address of the asset.
    /// @param withdrawer The address of the withdrawer.
    /// @param sharesOwed The amount of EigenLayer shares owed to the user.
    /// @param amountIn The amount of restaking tokens pulled from the user.
    event WithdrawalQueued(
        uint256 indexed epoch, address asset, address withdrawer, uint256 sharesOwed, uint256 amountIn
    );

    /// @notice Emitted when a user claims a withdrawal.
    /// @param epoch The epoch containing the withdrawal.
    /// @param asset The address of the asset.
    /// @param withdrawer The address of the withdrawer.
    /// @param amountOut The amount of assets received.
    event WithdrawalsClaimedForEpoch(uint256 indexed epoch, address asset, address withdrawer, uint256 amountOut);

    /// @notice Emitted when an epoch is settled from the deposit pool.
    /// @param epoch The epoch that was settled.
    /// @param asset The address of the asset that was settled.
    /// @param assetsReceived The amount of assets received to settle the epoch.
    event EpochSettledFromDepositPool(uint256 indexed epoch, address asset, uint256 assetsReceived);

    /// @notice Emitted when an epoch is queued for settlement via EigenLayer.
    /// @param epoch The epoch that was queued.
    /// @param asset The address of the asset that was queued.
    /// @param assetsReceived The amount of assets received from the deposit pool.
    /// @param shareValueOfAssetsReceived The value of the assets received in EigenLayer shares.
    /// @param restakingTokensBurned The amount of restaking tokens burned.
    /// @param aggregateRoot The aggregate root of the queued EigenLayer withdrawals.
    event EpochQueuedForSettlementFromEigenLayer(
        uint256 indexed epoch,
        address asset,
        uint256 assetsReceived,
        uint256 shareValueOfAssetsReceived,
        uint256 restakingTokensBurned,
        bytes32 aggregateRoot
    );

    /// @notice Emitted when an epoch is settled from EigenLayer.
    /// @param epoch The epoch that was settled.
    /// @param asset The address of the asset that was settled.
    /// @param assetsReceived The amount of assets received to settle the epoch.
    event EpochSettledFromEigenLayer(uint256 indexed epoch, address asset, uint256 assetsReceived);

    /// @notice Initializes the contract.
    /// @param initialOwner The initial owner of the contract.
    /// @param token The address of the liquid restaking token.
    function initialize(address initialOwner, address token) external;

    /// @notice Retrieve the current withdrawal epoch for a given asset.
    /// @param asset The asset to retrieve the current epoch for.
    function getCurrentEpoch(address asset) external view returns (uint256);

    /// @notice Get the amount of shares owed to withdrawers in the current `epoch` for `asset`.
    /// @param asset The address of the withdrawal asset.
    function getSharesOwedInCurrentEpoch(address asset) external view returns (uint256 sharesOwed);

    /// @notice Retrieve withdrawal epoch information for a given asset and epoch.
    /// @param asset The withdrawal asset.
    /// @param epoch The epoch for which to retrieve the information.
    function getEpochWithdrawalSummary(address asset, uint256 epoch)
        external
        view
        returns (EpochWithdrawalSummary memory);

    /// @notice Retrieve a user's withdrawal information for a given asset and epoch.
    /// @param asset The withdrawal asset.
    /// @param epoch The epoch for which to retrieve the information.
    /// @param user The address of the user for which to retrieve the information.
    function getUserWithdrawalSummary(address asset, uint256 epoch, address user)
        external
        view
        returns (UserWithdrawalSummary memory);

    /// @notice Queue `sharesOwed` of `asset` to `withdrawer` in the current epoch. These owed shares
    /// can be claimed as the underlying asset by the withdrawer once the current epoch is settled.
    /// @param withdrawer The address requesting the withdrawal.
    /// @param asset The address of the asset being withdrawn.
    /// @param sharesOwed The amount of shares owed to the withdrawer.
    /// @param amountIn The amount of restaking tokens pulled from the withdrawer.
    function queueWithdrawal(address withdrawer, address asset, uint256 sharesOwed, uint256 amountIn) external;

    /// @notice Withdraws all `asset` owed to the caller in a given epoch.
    /// @param request The asset claim request.
    function claimWithdrawalsForEpoch(ClaimRequest calldata request) external returns (uint256 amountOut);

    /// @notice Withdraws owed assets owed to the caller from many withdrawal requests.
    /// @param requests The withdrawal claim request.
    function claimWithdrawalsForManyEpochs(ClaimRequest[] calldata requests)
        external
        returns (uint256[] memory amountsOut);

    /// @notice Settle the current epoch for `asset` using `assetsPaid` from the deposit pool.
    /// @param asset The address of the withdrawal asset.
    /// @param assetsReceived The amount of assets received to settle the epoch.
    /// @param shareValueOfAssetsReceived The value of the assets received in EigenLayer shares.
    function settleCurrentEpoch(address asset, uint256 assetsReceived, uint256 shareValueOfAssetsReceived) external;

    /// @notice Queues the current epoch for `asset` settlement via EigenLayer and record
    /// the amount of assets received from the deposit pool.
    /// @param asset The address of the withdrawal asset.
    /// @param assetsReceived The amount of assets received from the deposit pool.
    /// @param shareValueOfAssetsReceived The value of the assets received in EigenLayer shares.
    /// @param aggregateRoot The aggregate root of the queued EigenLayer withdrawals.
    function queueCurrentEpochSettlement(
        address asset,
        uint256 assetsReceived,
        uint256 shareValueOfAssetsReceived,
        bytes32 aggregateRoot
    ) external;
}
