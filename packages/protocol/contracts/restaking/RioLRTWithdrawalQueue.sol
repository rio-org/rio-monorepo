// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {IVault} from '@balancer-v2/contracts/interfaces/contracts/vault/IVault.sol';
import {UUPSUpgradeable} from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {IDelegationManager} from 'contracts/interfaces/eigenlayer/IDelegationManager.sol';
import {IRioLRTWithdrawalQueue} from 'contracts/interfaces/IRioLRTWithdrawalQueue.sol';
import {Array} from 'contracts/utils/Array.sol';

contract RioLRTWithdrawalQueue is IRioLRTWithdrawalQueue, OwnableUpgradeable, UUPSUpgradeable {
    using SafeERC20 for IERC20;
    using Array for *;

    /// @notice The primary delegation contract for EigenLayer.
    IDelegationManager public immutable delegationManager;

    /// @notice The Balancer vault contract.
    IVault public immutable vault;

    /// @notice The LRT asset manager.
    address public assetManager;

    /// @notice Current token withdrawal epochs. Incoming withdrawals are included
    /// in the current epoch, which will be queued and incremented by the asset manager.
    mapping(address token => uint256 epoch) internal currentEpochs;

    /// @notice The amount of tokens owed to users in a given epoch, as well as the state
    /// of the epoch's withdrawals.
    mapping(address token => mapping(uint256 epoch => EpochWithdrawals withdrawals)) internal epochWithdrawals;

    /// @notice Require that the caller is the LRT's asset manager.
    modifier onlyAssetManager() {
        if (msg.sender != assetManager) revert ONLY_ASSET_MANAGER();
        _;
    }

    /// @param _delegationManager The EigenLayer delegation manager.
    /// @param _vault The Balancer vault contract.
    constructor(address _delegationManager, address _vault) initializer {
        delegationManager = IDelegationManager(_delegationManager);
        vault = IVault(_vault);
    }

    // forgefmt: disable-next-item
    /// @notice Initializes the withdrawal queue.
    /// @param initialOwner The initial owner of the contract.
    /// @param _assetManager The LRT asset manager.
    function initialize(address initialOwner, address _assetManager) external initializer {
        __UUPSUpgradeable_init();
        _transferOwnership(initialOwner);

        assetManager = _assetManager;
    }

    /// @notice Retrieve the current withdrawal epoch for a given token.
    /// @param token The token for which to retrieve the current epoch.
    function getCurrentEpoch(address token) external view returns (uint256) {
        return currentEpochs[token];
    }

    /// @notice Get the amount of `token` owed to withdrawers in the current `epoch`.
    /// @param token The withdrawal token.
    function getAmountOwedInCurrentEpoch(address token) external view returns (uint256 amountOwed) {
        amountOwed = epochWithdrawals[token][currentEpochs[token]].owed;
    }

    /// @notice Retrieve the owed cash and completion status for a given token and epoch.
    /// @param token The token for which to retrieve the information.
    /// @param epoch The epoch for which to retrieve the information.
    function getEpochWithdrawals(address token, uint256 epoch) external view returns (uint248 owed, bool completed, bytes32 aggregateRoot) {
        EpochWithdrawals storage withdrawals = epochWithdrawals[token][epoch];
        return (withdrawals.owed, withdrawals.completed, withdrawals.aggregateRoot);
    }

    /// @notice Retrieve a user's withdrawal information for a given token and epoch.
    /// @param token The token for which to retrieve the user's withdrawal information.
    /// @param epoch The epoch for which to retrieve the user's withdrawal information.
    /// @param user The address of the user to retrieve the withdrawal information for.
    function getUserWithdrawal(address token, uint256 epoch, address user) external view returns (UserWithdrawal memory) {
        return epochWithdrawals[token][epoch].users[user];
    }

    // forgefmt: disable-next-item
    /// @notice Queues token withdrawals for `withdrawer`.
    /// @param withdrawer The address requesting the exit.
    /// @param tokens The tokens to withdraw.
    function queueWithdrawals(address withdrawer, address[] memory tokens, uint256[] calldata amountsOut) external /* onlyRestakingToken */ {
        uint208 amountOut;
        uint256 length = tokens.length;
        for (uint256 i = 0; i < length; ++i) {
            amountOut = uint208(amountsOut[i]);
            if (amountOut == 0) continue;
            
            address token = tokens[i];
            uint256 currentEpoch = currentEpochs[token];

            EpochWithdrawals storage withdrawals = epochWithdrawals[token][currentEpoch];
            withdrawals.users[withdrawer].owed += amountOut;
            withdrawals.owed += amountOut;

            emit WithdrawalQueued(currentEpoch, token, withdrawer, amountOut);
        }
    }

    /// @notice Completes withdrawals from the pool's cash for the current epoch.
    /// @param token The token to complete withdrawals for.
    function completeWithdrawalsFromPoolForCurrentEpoch(address token) external onlyAssetManager {
        uint256 _currentEpoch = currentEpochs[token];

        EpochWithdrawals storage withdrawals = epochWithdrawals[token][_currentEpoch];
        if (withdrawals.owed == 0) revert NO_WITHDRAWALS_IN_EPOCH();
        if (withdrawals.completed) revert WITHDRAWALS_ALREADY_COMPLETED_FOR_EPOCH();
        if (withdrawals.aggregateRoot != bytes32(0)) revert WITHDRAWALS_MUST_BE_COMPLETED_FROM_EIGEN_LAYER();

        withdrawals.completed = true;
        currentEpochs[token] += 1;

        emit WithdrawalsCompletedForEpoch(_currentEpoch, token, withdrawals.owed);
    }

    // forgefmt: disable-next-item
    /// @notice Records queued EigenLayer withdrawals for the current epoch.
    /// @param token The token to queue withdrawals for.
    /// @param aggregateRoot The aggregate root of the queued withdrawals.
    function recordQueuedEigenLayerWithdrawalsForCurrentEpoch(address token, bytes32 aggregateRoot) external onlyAssetManager {
        uint256 _currentEpoch = currentEpochs[token];

        EpochWithdrawals storage withdrawals = epochWithdrawals[token][_currentEpoch];
        if (withdrawals.aggregateRoot != bytes32(0)) revert WITHDRAWALS_ALREADY_QUEUED_FOR_EPOCH();

        withdrawals.aggregateRoot = aggregateRoot;

        emit WithdrawalsQueuedForEpoch(_currentEpoch, token, withdrawals.owed, aggregateRoot);
    }

    /// @notice Completes withdrawals from EigenLayer for the given epoch.
    /// @param epoch The withdrawal epoch.
    /// @param token The token to complete withdrawals for.
    /// @param queuedWithdrawals The queued withdrawals.
    /// @param middlewareTimesIndexes The middleware times indexes for the queued withdrawals.
    function completeEigenLayerWithdrawalsForEpoch(
        uint256 epoch,
        address token,
        IDelegationManager.Withdrawal[] calldata queuedWithdrawals,
        uint256[] calldata middlewareTimesIndexes
    ) external {
        EpochWithdrawals storage withdrawals = epochWithdrawals[token][epoch];
        if (withdrawals.owed == 0) revert NO_WITHDRAWALS_IN_EPOCH();
        if (withdrawals.completed) revert WITHDRAWALS_ALREADY_COMPLETED_FOR_EPOCH();
        if (withdrawals.aggregateRoot == bytes32(0)) revert WITHDRAWALS_NOT_QUEUED_FROM_EIGENLAYER_FOR_EPOCH();

        uint256 queuedWithdrawalCount = queuedWithdrawals.length;
        if (queuedWithdrawalCount != middlewareTimesIndexes.length) revert INVALID_MIDDLEWARE_TIMES_INDEXES_LENGTH();

        withdrawals.completed = true;

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

        emit WithdrawalsCompletedForEpoch(epoch, token, withdrawals.owed);
    }

    /// @notice Withdraws owed tokens owed to the caller.
    /// @param request The withdrawal request.
    function withdraw(WithdrawalRequest calldata request) public {
        address caller = msg.sender;

        UserWithdrawal storage store = epochWithdrawals[request.token][request.epoch].users[caller];
        UserWithdrawal memory withdrawal = store;

        if (withdrawal.owed == 0) revert WITHDRAWAL_DOES_NOT_EXIST();
        if (withdrawal.claimed) revert WITHDRAWAL_ALREADY_CLAIMED();

        store.claimed = true;

        IERC20(request.token).safeTransfer(caller, withdrawal.owed);
        emit WithdrawalClaimed(request.epoch, request.token, caller, withdrawal.owed);
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
