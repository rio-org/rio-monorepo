// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {Clone} from '@solady/utils/Clone.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {IVault} from '@balancer-v2/contracts/interfaces/contracts/vault/IVault.sol';
import {IERC20 as IOpenZeppelinERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {IERC20} from '@balancer-v2/contracts/interfaces/contracts/solidity-utils/openzeppelin/IERC20.sol';
import {IRioLRTWithdrawalQueue} from 'contracts/interfaces/IRioLRTWithdrawalQueue.sol';
import {IStrategyManager} from 'contracts/interfaces/eigenlayer/IStrategyManager.sol';
import {Array} from 'contracts/utils/Array.sol';

contract RioLRTWithdrawalQueue is IRioLRTWithdrawalQueue, Clone {
    using SafeERC20 for IOpenZeppelinERC20;
    using Array for *;

    /// @notice The primary entry and exit-point for funds into and out of EigenLayer.
    IStrategyManager public immutable strategyManager;

    /// @notice The Balancer vault contract.
    IVault public immutable vault;

    /// @notice Current token withdrawal epochs. Incoming withdrawals are included
    /// in the current epoch, which will be queued and incremented by the asset manager.
    mapping(IERC20 token => uint40 epoch) public currentEpochs;

    /// @notice The amount of tokens owed to users in a given epoch, as well as the state
    /// of the epoch's withdrawals.
    mapping(IERC20 token => mapping(uint40 epoch => EpochWithdrawals withdrawals)) public epochWithdrawals;

    /// @notice Require that the caller is the LRT's asset manager.
    modifier onlyAssetManager() {
        if (msg.sender != assetManager()) revert ONLY_ASSET_MANAGER();
        _;
    }

    /// @notice Require that the caller is the pool (LRT).
    modifier onlyPool() {
        if (msg.sender != _getPoolAddress(poolId())) revert ONLY_ASSET_MANAGER();
        _;
    }

    /// @notice The LRT Balancer pool ID.
    function poolId() public pure returns (bytes32) {
        return _getArgBytes32(0);
    }

    /// @notice The LRT asset manager.
    function assetManager() public pure returns (address) {
        return _getArgAddress(32);
    }

    /// @param _strategyManager The EigenLayer strategy manager.
    /// @param _vault The Balancer vault contract.
    constructor(address _strategyManager, address _vault) {
        strategyManager = IStrategyManager(_strategyManager);
        vault = IVault(_vault);
    }

    /// @notice Get the amount of `token` owed to withdrawers in the current `epoch`.
    /// @param token The withdrawal token.
    function getAmountOwedInCurrentEpoch(IERC20 token) external view returns (uint256 amountOwed) {
        amountOwed = epochWithdrawals[token][currentEpochs[token]].owed;
    }

    /// @notice Queues token withdrawals from `sender` if there is a cash deficit in the pool
    /// and returns the amount of cash that can be paid out immediately.
    /// @param sender The address of the user exiting the pool.
    /// @param tokens The tokens to withdraw.
    /// @param amountsOut The total token amounts attempting to be withdrawn.
    function queueWithdrawals(address sender, IERC20[] memory tokens, uint256[] calldata amountsOut) external onlyPool returns (uint256[] memory cashAmountsOut) {
        uint256 length = tokens.length;
        cashAmountsOut = new uint256[](length);

        uint256 cash;
        uint256 amountOut;
        uint208 deficit;
        IERC20 token;
        for (uint256 i = 0; i < length; ++i) {
            amountOut = amountsOut[i];
            if (amountOut == 0) continue;

            token = tokens[i];
            (cash, , , ) = vault.getPoolTokenInfo(poolId(), token);
            if (cash >= amountOut) continue;

            uint40 _currentEpoch = currentEpochs[token];

            // The pool's buffer is short cash for the withdrawal. Record the amount owed and how much cash can be paid out.
            cashAmountsOut[i] = cash;
            deficit = uint208(amountOut - cash);

            EpochWithdrawals storage withdrawals = epochWithdrawals[token][_currentEpoch];
            withdrawals.users[sender].owed += deficit;
            withdrawals.owed += deficit;

            emit WithdrawalQueued(_currentEpoch, token, sender, deficit);
        }
    }

    /// @notice Completes withdrawals from the pool's cash for the current epoch.
    /// @param token The token to complete withdrawals for.
    function completeWithdrawalsFromPoolForCurrentEpoch(IERC20 token) external onlyAssetManager {
        uint40 _currentEpoch = currentEpochs[token];

        EpochWithdrawals storage withdrawals = epochWithdrawals[token][_currentEpoch];
        if (withdrawals.owed == 0) revert NO_WITHDRAWALS_IN_EPOCH();
        if (withdrawals.completed) revert WITHDRAWALS_ALREADY_COMPLETED_FOR_EPOCH();
        if (withdrawals.aggregateRoot != bytes32(0)) revert WITHDRAWALS_MUST_BE_COMPLETED_FROM_EIGEN_LAYER();

        withdrawals.completed = true;
        currentEpochs[token] += 1;

        emit WithdrawalsCompletedForEpoch(_currentEpoch, token, withdrawals.owed);
    }

    /// @notice Records queued EigenLayer withdrawals for the current epoch.
    /// @param token The token to queue withdrawals for.
    /// @param aggregateRoot The aggregate root of the queued withdrawals.
    function recordQueuedEigenLayerWithdrawalsForCurrentEpoch(IERC20 token, bytes32 aggregateRoot) external onlyAssetManager {
        uint40 _currentEpoch = currentEpochs[token];

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
        uint40 epoch,
        IERC20 token,
        IStrategyManager.QueuedWithdrawal[] calldata queuedWithdrawals,
        uint256[] calldata middlewareTimesIndexes
    ) external {
        EpochWithdrawals storage withdrawals = epochWithdrawals[token][epoch];
        if (withdrawals.owed == 0) revert NO_WITHDRAWALS_IN_EPOCH();
        if (withdrawals.completed) revert WITHDRAWALS_ALREADY_COMPLETED_FOR_EPOCH();
        if (withdrawals.aggregateRoot == bytes32(0)) revert WITHDRAWALS_NOT_QUEUED_FROM_EIGENLAYER_FOR_EPOCH();

        uint256 queuedWithdrawalCount = queuedWithdrawals.length;
        if (queuedWithdrawalCount != middlewareTimesIndexes.length) revert INVALID_MIDDLEWARE_TIMES_INDEXES_LENGTH();

        withdrawals.completed = true;

        IOpenZeppelinERC20[] memory tokens = address(token).toArray();
        bytes32[] memory roots = new bytes32[](queuedWithdrawalCount);

        IStrategyManager.QueuedWithdrawal memory queuedWithdrawal;
        for (uint256 i; i < queuedWithdrawalCount; ) {
            queuedWithdrawal = queuedWithdrawals[i];

            roots[i] = _computeWithdrawalRoot(queuedWithdrawal);
            strategyManager.completeQueuedWithdrawal(queuedWithdrawal, tokens, middlewareTimesIndexes[i], true);

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
        
        IOpenZeppelinERC20(address(request.token)).safeTransfer(caller, withdrawal.owed);
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

    /// @dev Returns the address of a Pool's contract.
    /// @param _poolId The ID of the pool.
    function _getPoolAddress(bytes32 _poolId) internal pure returns (address) {
        // 12 byte logical shift left to remove the nonce and specialization setting. We don't need to mask,
        // since the logical shift already sets the upper bits to zero.
        return address(uint160(uint256(_poolId) >> (12 * 8)));
    }

    /// @dev Computes the withdrawal root for a queued withdrawal.
    /// @param queuedWithdrawal The queued withdrawal.
    function _computeWithdrawalRoot(IStrategyManager.QueuedWithdrawal memory queuedWithdrawal) internal pure returns (bytes32) {
        return (
            keccak256(
                abi.encode(
                    queuedWithdrawal.strategies,
                    queuedWithdrawal.shares,
                    queuedWithdrawal.depositor,
                    queuedWithdrawal.withdrawerAndNonce,
                    queuedWithdrawal.withdrawalStartBlock,
                    queuedWithdrawal.delegatedAddress
                )
            )
        );
    }
}