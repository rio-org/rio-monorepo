// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

interface IRioLRTOperatorRegistry {
    /// @dev Configuration used to track the maximum number of shares that can be
    /// allocated to an operator for a given strategy.
    struct StrategyShareCap {
        /// @dev The strategy address.
        address strategy;
        /// @dev The maximum amount of strategy shares that can be allocated to the operator.
        uint128 cap;
    }

    /// @dev Tracks both the cap and current allocation of strategy shares for an operator.
    struct OperatorShareDetails {
        /// @dev The maximum amount of strategy shares that can be allocated to the operator.
        uint128 cap;
        /// @dev The current amount of strategy shares allocated to the operator.
        uint128 allocation;
    }

    /// @dev Aggregate validator information for a single operator.
    struct OperatorValidatorDetails {
        /// @dev The timestamp at which the next batch of pending validators will be considered
        /// "confirmed".
        uint40 nextConfirmationTimestamp;
        /// @dev The maximum number of validators approved by the DAO.
        uint40 cap;
        /// @dev The total number of keys that have been uploaded (all-time). This number will be
        /// decremented in the event that pending keys are removed.
        uint40 total;
        /// @dev The total number of validator keys that have been confirmed following
        /// review by the security daemon (all-time).
        uint40 confirmed;
        /// @dev The number of validators that have reached the deposited state (all-time).
        uint40 deposited;
        /// @dev The number of validators that have reached the exited state (all-time).
        uint40 exited;
    }

    /// @dev Details for a single operator.
    struct OperatorDetails {
        /// @dev Flag indicating if the operator can participate in further staking and reward distribution.
        bool active;
        /// @dev The staker contract that delegates to the operator.
        address delegator;
        /// @dev The address that manages the operator.
        address manager;
        /// @dev The address that will manage the operator once confirmed.
        address pendingManager;
        /// @dev The address that will receive operator rewards.
        address earningsReceiver;
        /// @dev Aggregate validator information for the operator.
        OperatorValidatorDetails validatorDetails;
        /// @dev Operator strategy share allocation caps and current allocations.
        mapping(address => OperatorShareDetails) shareDetails;
    }

    /// @dev Details for a single operator, excluding the share details, so we can expose externally.
    struct OperatorPublicDetails {
        /// @dev Flag indicating if the operator can participate in further staking and reward distribution.
        bool active;
        /// @dev The operator's contract address.
        address operatorContract;
        /// @dev The address that manages the operator.
        address manager;
        /// @dev The address that will manage the operator once confirmed.
        address pendingManager;
        /// @dev The address that will receive operator rewards.
        address earningsReceiver;
        /// @dev Aggregate validator information for the operator.
        OperatorValidatorDetails validatorDetails;
    }

    /// @notice An operator address and strategy share allocation.
    struct OperatorStrategyAllocation {
        /// @dev The operator's contract address.
        address operator;
        /// @dev The amount of shares allocated to the operator.
        uint256 shares;
        /// @dev The amount of tokens allocated to the operator.
        uint256 tokens;
    }

    /// @notice An operator address, ETH deposit allocation, and validator details.
    struct OperatorETHAllocation {
        /// @dev The operator's contract address.
        address operator;
        /// @dev The amount of ETH deposits allocated to the operator.
        uint256 deposits;
        /// @dev One or more validator public keys, concatenated together.
        bytes pubKeyBatch;
        /// @dev One or more validator signatures, concatenated together.
        bytes signatureBatch;
    }

    /// @notice An operator address and strategy share deallocation.
    struct OperatorStrategyDeallocation {
        /// @dev The operator delegator's contract address.
        address operator;
        /// @dev The amount of shares deallocated from the operator.
        uint256 shares;
        /// @dev The amount of tokens deallocated from the operator.
        uint256 tokens;
    }

    /// @notice An operator address and ETH deposit deallocation.
    struct OperatorETHDeallocation {
        /// @dev The operator's contract address.
        address operator;
        /// @dev The amount of ETH deposits deallocated from the operator.
        uint256 deposits;
    }

    /// @notice Thrown when the caller is not the operator's manager.
    error ONLY_OPERATOR_MANAGER();

    /// @notice Thrown when the caller is not the operator's manager or OR the security daemon.
    error ONLY_OPERATOR_MANAGER_OR_SECURITY_DAEMON();

    /// @notice Thrown when the caller is not the coordinator.
    error ONLY_COORDINATOR();

    /// @notice Thrown when the caller is not the deposit pool.
    error ONLY_DEPOSIT_POOL();

    /// @notice Thrown when the caller is not the operator's pending manager.
    error ONLY_OPERATOR_PENDING_MANAGER();

    /// @notice Thrown when the maximum number of operators has been reached.
    error MAX_OPERATOR_COUNT_EXCEEDED();

    /// @notice Thrown when the maximum number of active operators has been reached.
    error MAX_ACTIVE_OPERATOR_COUNT_EXCEEDED();

    /// @notice Thrown when the operator is `address(0)`.
    error INVALID_OPERATOR();

    /// @notice Thrown when the manager is `address(0)`.
    error INVALID_MANAGER();

    /// @notice Thrown when the pending manager is `address(0)`.
    error INVALID_PENDING_MANAGER();

    /// @notice Thrown when the operator's earnings receiver is `address(0)`.
    error INVALID_EARNINGS_RECEIVER();

    /// @notice Thrown when an invalid (non-existent) operator delegator contract address is provided.
    error INVALID_OPERATOR_DELEGATOR();

    /// @notice Thrown when the provided validator count is invalid (zero).
    error INVALID_VALIDATOR_COUNT();

    /// @notice Thrown when an invalid index is provided.
    error INVALID_INDEX();

    /// @notice Thrown when attempting an operation that requires the operator to be active.
    error OPERATOR_NOT_ACTIVE();

    /// @notice Thrown when attempting to activate an operator that is already active.
    error OPERATOR_ALREADY_ACTIVE();

    /// @notice Thrown when attempting to deactivate an operator that is already inactive.
    error OPERATOR_ALREADY_INACTIVE();

    /// @notice Thrown when an attempt is made to complete a natural exit for an operator that
    /// still has shares allocated.
    error OPERATOR_STILL_HAS_ALLOCATED_SHARES();

    /// @notice Thrown when there are no available operators for allocation.
    error NO_AVAILABLE_OPERATORS_FOR_ALLOCATION();

    /// @notice Thrown when there are no available operators for deallocation.
    error NO_AVAILABLE_OPERATORS_FOR_DEALLOCATION();

    /// @notice Thrown when attempting an operation that requires the AVS to be active.
    error AVS_NOT_ACTIVE();

    /// @notice Thrown when attempting an operation that requires the AVS to be registered.
    error AVS_NOT_REGISTERED();

    /// @notice Thrown when attempting to opt into slashing for an AVS that has no slashing contract.
    error NO_SLASHING_CONTRACT_FOR_AVS();

    /// @notice Thrown when attempting to queue the exit of zero shares.
    error CANNOT_EXIT_ZERO_SHARES();

    /// @notice Emitted when a new operator is added to the registry.
    /// @param operatorId The operator's ID.
    /// @param operator The operator's contract address.
    /// @param delegator The operator's delegator contract address.
    /// @param initialManager The initial manager of the operator.
    /// @param initialEarningsReceiver The initial reward address of the operator.
    /// @param initialMetadataURI The initial metadata URI of the operator.
    event OperatorAdded(
        uint8 indexed operatorId,
        address indexed operator,
        address indexed delegator,
        address initialManager,
        address initialEarningsReceiver,
        string initialMetadataURI
    );

    /// @notice Emitted when an operator is activated.
    /// @param operatorId The operator's ID.
    event OperatorActivated(uint8 indexed operatorId);

    /// @notice Emitted when an operator is deactivated.
    /// @param operatorId The operator's ID.
    event OperatorDeactivated(uint8 indexed operatorId);

    /// @notice Emitted when an operator's strategy share allocation cap is set.
    /// @param operatorId The operator's ID.
    /// @param strategy The strategy whose cap was set.
    /// @param cap The new strategy share cap for the operator.
    event OperatorStrategyShareCapSet(uint8 indexed operatorId, address strategy, uint128 cap);

    /// @notice Emitted when an operator's validator cap is set.
    /// @param operatorId The operator's ID.
    /// @param cap The new maximum active validator cap.
    event OperatorValidatorCapSet(uint8 indexed operatorId, uint40 cap);

    /// @notice Emitted when the security daemon is set.
    /// @param securityDaemon The new security daemon.
    event SecurityDaemonSet(address securityDaemon);

    /// @notice Emitted when the min staker opt out blocks is set.
    event MinStakerOptOutBlocksSet(uint24 minStakerOptOutBlocks);

    /// @notice Emitted when the validator key review period is set.
    /// @param validatorKeyReviewPeriod The new validator key review period.
    event ValidatorKeyReviewPeriodSet(uint24 validatorKeyReviewPeriod);

    /// @notice Emitted when an operator's earnings receiver is set.
    /// @param operatorId The operator's ID.
    /// @param earningsReceiver The new earnings receiver for the operator.
    event OperatorEarningsReceiverSet(uint8 indexed operatorId, address earningsReceiver);

    /// @notice Emitted when an operator's pending manager is set.
    /// @param operatorId The operator's ID.
    /// @param pendingManager The new pending manager of the operator.
    event OperatorPendingManagerSet(uint8 indexed operatorId, address pendingManager);

    /// @notice Emitted when an operator's manager is set.
    /// @param operatorId The operator's ID.
    /// @param manager The new manager of the operator.
    event OperatorManagerSet(uint8 indexed operatorId, address manager);

    /// @notice Emitted following the verification of withdrawal credentials for one or more validators.
    /// @param operatorId The operator's ID.
    /// @param oracleTimestamp The Beacon Chain timestamp whose state root the `proof` will be proven against.
    /// @param validatorIndices The list of indices of the validators being proven, refer to consensus specs.
    event OperatorWithdrawalCredentialsVerified(
        uint8 indexed operatorId, uint64 oracleTimestamp, uint40[] validatorIndices
    );

    /// @notice Emitted when an operator uploads a new set of validator details (public keys and signatures).
    /// @param operatorId The operator's ID.
    /// @param validatorCount The number of validator details that were added.
    event OperatorPendingValidatorDetailsAdded(uint8 indexed operatorId, uint256 validatorCount);

    /// @notice Emitted when an operator removes pending validator details (public keys and signatures).
    /// @param operatorId The operator's ID.
    /// @param validatorCount The number of pending validator details that were removed.
    event OperatorPendingValidatorDetailsRemoved(uint8 indexed operatorId, uint256 validatorCount);

    /// @notice Emitted when a strategy exit is queued for an operator.
    /// @param operatorId The operator's ID.
    /// @param strategy The strategy to exit.
    /// @param sharesToExit The number of shares to exit.
    event OperatorStrategyExitQueued(uint8 indexed operatorId, address strategy, uint256 sharesToExit);

    // forgefmt: disable-next-item
    /// @notice Initializes the contract.
    /// @param initialOwner The initial owner of the contract.
    /// @param coordinator The LRT coordinator.
    /// @param assetRegistry The LRT asset registry.
    /// @param avsRegistry The AVS registry.
    /// @param depositPool The LRT deposit pool.
    /// @param rewardDistributor The LRT reward distributor.
    function initialize(address initialOwner, address coordinator, address assetRegistry, address avsRegistry, address depositPool, address rewardDistributor) external;

    /// @notice Returns the operator details for the provided operator ID.
    /// @param operatorId The operator's ID.
    function getOperatorDetails(uint8 operatorId) external view returns (OperatorPublicDetails memory);

    /// @notice Returns the operator share cap and allocation for the provided operator ID and strategy.
    /// @param operatorId The operator's ID.
    /// @param strategy The strategy to get the share details for.
    function getOperatorShareDetails(uint8 operatorId, address strategy)
        external
        view
        returns (OperatorShareDetails memory);

    /// @notice Returns the total number of operators in the registry.
    function operatorCount() external view returns (uint8);

    /// @notice Returns the total number of active operators in the registry.
    function activeOperatorCount() external view returns (uint8);

    /// @notice The minimum acceptable delay between an operator signaling intent to register
    // for an AVS and completing registration.
    function minStakerOptOutBlocks() external view returns (uint24);

    /// @notice The amount of time (in seconds) before uploaded validator keys are considered "vetted".
    function validatorKeyReviewPeriod() external view returns (uint24);

    /// @notice Adds a new operator to the registry, deploying a delegator contract and
    /// delegating to the provided `operator`.
    /// @param operator The operator's address.
    /// @param initialManager The initial manager of the operator.
    /// @param initialEarningsReceiver The initial reward address of the operator.
    /// @param strategyShareCaps The maximum number of shares that can be allocated to
    /// the operator for each strategy.
    /// @param validatorCap The maximum number of active validators allowed.
    function addOperator(
        address operator,
        address initialManager,
        address initialEarningsReceiver,
        string calldata initialMetadataURI,
        StrategyShareCap[] calldata strategyShareCaps,
        uint40 validatorCap
    ) external returns (uint8 operatorId, address operatorContract);

    /// @notice Activates an operator.
    /// @param operatorId The operator's ID.
    function activateOperator(uint8 operatorId) external;

    /// Deactivates an operator, exiting all remaining stake to the
    /// deposit pool.
    /// @param operatorId The operator's ID.
    function deactivateOperator(uint8 operatorId) external;

    /// @notice Adds pending validator details (public keys and signatures) to storage for the provided operator.
    /// Each added batch extends the timestamp at which the details will be considered confirmed.
    /// @param operatorId The operator's ID.
    /// @param validatorCount The number of validators in the batch.
    /// @param publicKeys The validator public keys.
    /// @param signatures The validator signatures.
    function addValidatorDetails(
        uint8 operatorId,
        uint256 validatorCount,
        bytes calldata publicKeys,
        bytes calldata signatures
    ) external;

    // forgefmt: disable-next-item
    /// @notice Removes pending validator details (public keys and signatures) from storage for the provided operator.
    /// @param operatorId The operator's ID.
    /// @param fromIndex The index of the first validator to remove.
    /// @param validatorCount The number of validator to remove.
    function removeValidatorDetails(uint8 operatorId, uint256 fromIndex, uint256 validatorCount) external;

    // forgefmt: disable-next-item
    /// @notice Allocates a specified amount of shares for the provided strategy to the operators with the lowest utilization.
    /// @param strategy The strategy to allocate the shares to.
    /// @param sharesToAllocate The amount of shares to allocate.
    function allocateStrategyShares(address strategy, uint256 sharesToAllocate) external returns (uint256 sharesAllocated, OperatorStrategyAllocation[] memory allocations);

    // forgefmt: disable-next-item
    /// @notice Allocates a specified amount of ETH deposits to the operators with the lowest utilization.
    /// @param depositsToAllocate The amount of deposits to allocate (32 ETH each)
    function allocateETHDeposits(uint256 depositsToAllocate) external returns (uint256 depositsAllocated, OperatorETHAllocation[] memory allocations);

    // forgefmt: disable-next-item
    /// @notice Deallocates a specified amount of shares for the provided strategy from the operators with the highest utilization.
    /// @param strategy The strategy to deallocate the shares from.
    /// @param sharesToDeallocate The amount of shares to deallocate.
    function deallocateStrategyShares(address strategy, uint256 sharesToDeallocate) external returns (uint256 sharesDeallocated, OperatorStrategyDeallocation[] memory deallocations);

    // forgefmt: disable-next-item
    /// @notice Deallocates a specified amount of ETH deposits from the operators with the highest utilization.
    /// @param depositsToDeallocate The amount of deposits to deallocate (32 ETH each)
    function deallocateETHDeposits(uint256 depositsToDeallocate) external returns (uint256 depositsDeallocated, OperatorETHDeallocation[] memory deallocations);
}
