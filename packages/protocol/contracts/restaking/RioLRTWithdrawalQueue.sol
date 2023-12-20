// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {FixedPointMathLib} from '@solady/utils/FixedPointMathLib.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {UUPSUpgradeable} from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {IDelegationManager} from 'contracts/interfaces/eigenlayer/IDelegationManager.sol';
import {IRioLRTWithdrawalQueue} from 'contracts/interfaces/IRioLRTWithdrawalQueue.sol';
import {IRioLRTAssetManager} from 'contracts/interfaces/IRioLRTAssetManager.sol';
import {WrappedTokenHandler} from 'contracts/wrapping/WrappedTokenHandler.sol';
import {ITokenWrapper} from 'contracts/interfaces/wrapping/ITokenWrapper.sol';
import {SafeCast} from '@openzeppelin/contracts/utils/math/SafeCast.sol';
import {Array} from 'contracts/utils/Array.sol';

contract RioLRTWithdrawalQueue is IRioLRTWithdrawalQueue, WrappedTokenHandler, OwnableUpgradeable, UUPSUpgradeable {
    using FixedPointMathLib for *;
    using SafeERC20 for IERC20;
    using Array for *;

    /// @notice The primary delegation contract for EigenLayer.
    IDelegationManager public immutable delegationManager;

    /// @notice The liquid restaking token gateway.
    address public gateway;

    /// @notice The LRT asset manager.
    IRioLRTAssetManager public assetManager;

    /// @notice Current token withdrawal epochs. Incoming withdrawals are included
    /// in the current epoch, which will be queued and incremented by the asset manager.
    mapping(address token => uint256 epoch) internal currentEpochs;

    /// @notice The amount of tokens owed to users in a given epoch, as well as the state
    /// of the epoch's withdrawals.
    mapping(address token => mapping(uint256 epoch => EpochWithdrawals withdrawals)) internal epochWithdrawals;

    /// @notice Require that the caller is the LRT gateway.
    modifier onlyGateway() {
        if (msg.sender != gateway) revert ONLY_LRT_GATEWAY();
        _;
    }

    /// @notice Require that the caller is the LRT's asset manager.
    modifier onlyAssetManager() {
        if (msg.sender != address(assetManager)) revert ONLY_ASSET_MANAGER();
        _;
    }

    /// @param tokenWrapperFactory_ The contract that deploys token wrappers.
    /// @param delegationManager_ The EigenLayer delegation manager.
    constructor(address tokenWrapperFactory_, address delegationManager_) WrappedTokenHandler(tokenWrapperFactory_) {
        _disableInitializers();

        delegationManager = IDelegationManager(delegationManager_);
    }

    // forgefmt: disable-next-item
    /// @notice Initializes the withdrawal queue.
    /// @param initialOwner The initial owner of the contract.
    /// @param gateway_ The LRT gateway.
    /// @param assetManager_ The LRT asset manager.
    function initialize(address initialOwner, address gateway_, address assetManager_) external initializer {
        __UUPSUpgradeable_init();
        _transferOwnership(initialOwner);

        gateway = gateway_;
        assetManager = IRioLRTAssetManager(assetManager_);
    }

    /// @notice Retrieve the current withdrawal epoch for a given token.
    /// @param token The token for which to retrieve the current epoch.
    function getCurrentEpoch(address token) public view returns (uint256) {
        return currentEpochs[token];
    }

    /// @notice Get the amount of strategy shares owed to withdrawers in the current `epoch` for `token`.
    /// @param token The withdrawal token.
    function getSharesOwedInCurrentEpoch(address token) external view returns (uint256 shares) {
        shares = epochWithdrawals[token][getCurrentEpoch(token)].shares;
    }

    // forgefmt: disable-next-item
    /// @notice Retrieve the owed shares and settlement status for a given token and epoch.
    /// @param token The token for which to retrieve the information.
    /// @param epoch The epoch for which to retrieve the information.
    function getEpochWithdrawals(address token, uint256 epoch) external view returns (uint112 shares, bool settled, bytes32 aggregateRoot) {
        EpochWithdrawals storage withdrawals = epochWithdrawals[token][epoch];
        return (withdrawals.shares, withdrawals.settled, withdrawals.aggregateRoot);
    }

    // forgefmt: disable-next-item
    /// @notice Retrieve a user's withdrawal information for a given token and epoch.
    /// @param token The token for which to retrieve the user's withdrawal information.
    /// @param epoch The epoch for which to retrieve the user's withdrawal information.
    /// @param user The address of the user to retrieve the withdrawal information for.
    function getUserWithdrawal(address token, uint256 epoch, address user) external view returns (UserWithdrawal memory) {
        return epochWithdrawals[token][epoch].users[user];
    }

    // forgefmt: disable-next-item
    /// @notice Queue `shares` of `token` to `withdrawer` in the current epoch. These owed
    /// shares can be claimed as tokens by the withdrawer once the current epoch is settled.
    /// @param withdrawer The address requesting the exit.
    /// @param token The address of the token for which the withdrawal is being queued.
    /// @param shares The number of shares to queue.
    function queueWithdrawal(address withdrawer, address token, uint112 shares) external onlyGateway {
        uint256 currentEpoch = getCurrentEpoch(token);
        EpochWithdrawals storage withdrawals = epochWithdrawals[token][currentEpoch];
        UserWithdrawal storage user = withdrawals.users[withdrawer];

        user.shares += shares;
        withdrawals.shares += shares;

        emit WithdrawalQueued(currentEpoch, token, withdrawer, shares);
    }

    /// @notice Settles withdrawals from the pool's cash for the current epoch.
    /// @param token The token to settle withdrawals for.
    function settleWithdrawalsFromPoolForCurrentEpoch(address token) external onlyAssetManager {
        uint256 currentEpoch = getCurrentEpoch(token);

        EpochWithdrawals storage withdrawals = epochWithdrawals[token][currentEpoch];
        if (withdrawals.shares == 0) revert NO_SHARES_OWED_IN_EPOCH();
        if (withdrawals.settled) revert WITHDRAWALS_ALREADY_SETTLED_FOR_EPOCH();
        if (withdrawals.aggregateRoot != bytes32(0)) revert WITHDRAWALS_MUST_BE_COMPLETED_FROM_EIGEN_LAYER();

        withdrawals.settled = true;
        withdrawals.conversionRate = SafeCast.toUint112(assetManager.getPoolTokensForStrategyShares(token, 1e18));
        currentEpochs[token] += 1;

        emit WithdrawalsSettledFromPoolForEpoch(
            currentEpoch, token, withdrawals.shares, withdrawals.shares.mulWad(withdrawals.conversionRate)
        );
    }

    // forgefmt: disable-next-item
    /// @notice Records queued EigenLayer withdrawals for the current epoch.
    /// @param token The token to queue withdrawals for.
    /// @param aggregateRoot The aggregate root of the queued withdrawals.
    function recordQueuedEigenLayerWithdrawalsForCurrentEpoch(address token, bytes32 aggregateRoot) external onlyAssetManager {
        uint256 currentEpoch = getCurrentEpoch(token);

        EpochWithdrawals storage withdrawals = epochWithdrawals[token][currentEpoch];
        if (withdrawals.aggregateRoot != bytes32(0)) revert WITHDRAWALS_ALREADY_QUEUED_FOR_EPOCH();

        withdrawals.aggregateRoot = aggregateRoot;

        emit WithdrawalsQueuedForEpoch(currentEpoch, token, withdrawals.shares, aggregateRoot);
    }

    /// @notice Completes withdrawals from EigenLayer for the given epoch.
    /// @param epoch The withdrawal epoch.
    /// @param token The token to complete withdrawals for.
    /// @param queuedWithdrawals The queued withdrawals.
    /// @param middlewareTimesIndexes The middleware times indexes for the queued withdrawals.
    function settleEigenLayerWithdrawalsForEpoch(
        uint256 epoch,
        address token,
        IDelegationManager.Withdrawal[] calldata queuedWithdrawals,
        uint256[] calldata middlewareTimesIndexes
    ) external {
        EpochWithdrawals storage withdrawals = epochWithdrawals[token][epoch];
        if (withdrawals.shares == 0) revert NO_SHARES_OWED_IN_EPOCH();
        if (withdrawals.settled) revert WITHDRAWALS_ALREADY_SETTLED_FOR_EPOCH();
        if (withdrawals.aggregateRoot == bytes32(0)) revert WITHDRAWALS_NOT_QUEUED_FROM_EIGENLAYER_FOR_EPOCH();

        uint256 queuedWithdrawalCount = queuedWithdrawals.length;
        if (queuedWithdrawalCount != middlewareTimesIndexes.length) revert INVALID_MIDDLEWARE_TIMES_INDEXES_LENGTH();

        withdrawals.settled = true;
        withdrawals.conversionRate = SafeCast.toUint112(assetManager.getPoolTokensForStrategyShares(token, 1e18));

        IERC20[] memory tokens = IERC20(token).toArray();
        bytes32[] memory roots = new bytes32[](queuedWithdrawalCount);

        IDelegationManager.Withdrawal memory queuedWithdrawal;
        for (uint256 i; i < queuedWithdrawalCount;) {
            queuedWithdrawal = queuedWithdrawals[i];

            roots[i] = _computeWithdrawalRoot(queuedWithdrawal);
            delegationManager.completeQueuedWithdrawal(queuedWithdrawal, tokens, middlewareTimesIndexes[i], true);

            unchecked {
                ++i;
            }
        }
        if (withdrawals.aggregateRoot != keccak256(abi.encodePacked(roots))) revert INVALID_AGGREGATE_WITHDRAWAL_ROOT();

        emit WithdrawalsSettledFromEigenLayerForEpoch(
            epoch, token, withdrawals.shares, withdrawals.shares.mulWad(withdrawals.conversionRate)
        );
    }

    /// @notice Withdraws owed tokens to the caller.
    /// @param request The withdrawal request.
    function withdraw(WithdrawalRequest calldata request) public {
        address withdrawer = msg.sender;

        address poolToken = request.token;
        if (request.requiresUnwrap) {
            poolToken = ITokenWrapper(_getWrapper(request.token)).getWrappedToken();
        }

        EpochWithdrawals storage epoch = epochWithdrawals[poolToken][request.epoch];
        UserWithdrawal storage store = epoch.users[withdrawer];
        UserWithdrawal memory withdrawal = store;

        if (!epoch.settled) revert EPOCH_NOT_SETTLED();
        if (withdrawal.shares == 0) revert WITHDRAWAL_DOES_NOT_EXIST();
        if (withdrawal.claimed) revert WITHDRAWAL_ALREADY_CLAIMED();

        store.claimed = true;

        // Calculate the tokens owed, and unwrap if necessary.
        uint256 tokens = withdrawal.shares.mulWad(epoch.conversionRate);
        if (request.requiresUnwrap) {
            (, tokens) = _unwrap(poolToken, tokens);
        }

        IERC20(request.token).safeTransfer(withdrawer, tokens);
        emit WithdrawalClaimed(request.epoch, request.token, withdrawer, withdrawal.shares, tokens);
    }

    /// @notice Withdraws owed tokens owed to the caller from many withdrawal requests.
    /// @param requests The withdrawal requests.
    function withdrawMany(WithdrawalRequest[] calldata requests) external {
        uint256 requestLength = requests.length;
        for (uint256 i; i < requestLength;) {
            withdraw(requests[i]);

            unchecked {
                ++i;
            }
        }
    }

    /// @dev Returns the keccak256 hash of `withdrawal`.
    /// @param withdrawal The withdrawal.
    function _computeWithdrawalRoot(IDelegationManager.Withdrawal memory withdrawal) public pure returns (bytes32) {
        return keccak256(abi.encode(withdrawal));
    }

    /// @dev Allows the owner to upgrade the withdrawal queue implementation.
    /// @param newImplementation The implementation to upgrade to.
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
