// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {Math} from '@openzeppelin/contracts/utils/math/Math.sol';
import {FixedPointMathLib} from '@solady/utils/FixedPointMathLib.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {IVault} from '@balancer-v2/contracts/interfaces/contracts/vault/IVault.sol';
import {IERC20} from '@balancer-v2/contracts/interfaces/contracts/solidity-utils/openzeppelin/IERC20.sol';
import {IERC20 as IOpenZeppelinERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {IRioLRTOperatorRegistry} from 'contracts/interfaces/IRioLRTOperatorRegistry.sol';
import {IRioLRTWithdrawalQueue} from 'contracts/interfaces/IRioLRTWithdrawalQueue.sol';
import {IRioLRTAssetManager} from 'contracts/interfaces/IRioLRTAssetManager.sol';
import {IRioLRTOperator} from 'contracts/interfaces/IRioLRTOperator.sol';
import {IStrategy} from 'contracts/interfaces/eigenlayer/IStrategy.sol';

contract RioLRTAssetManager is IRioLRTAssetManager {
    using SafeERC20 for IOpenZeppelinERC20;
    using FixedPointMathLib for uint256;

    /// @notice The Balancer vault that holds the pool's cash.
    IVault public immutable vault;

    /// @notice The LRT Balancer pool ID.
    bytes32 public poolId;

    /// @notice The LRT controller.
    address public controller;

    /// @notice The timestamp at which the pool last rebalanced.
    uint40 public lastRebalanceTimestamp;

    /// @notice The required delay between rebalances.
    uint40 public rebalanceDelay;

    /// @notice The operator registry used for token allocation.
    IRioLRTOperatorRegistry public operatorRegistry;

    /// @notice The contract used to queue and process withdrawals.
    IRioLRTWithdrawalQueue public withdrawalQueue;

    /// @notice A mapping of tokens to their asset management configurations.
    mapping(address token => TokenConfig config) public configs;

    /// @notice A mapping of strategies to their shares held by the LRT.
    mapping(address strategy => uint256 shares) public strategyShares;

    /// @notice Require that the caller is the LRT controller.
    modifier onlyController() {
        if (msg.sender != controller) revert ONLY_LRT_CONTROLLER();
        _;
    }

    /// @notice Require that the rebalance delay has been met.
    modifier onlyAfterRebalanceDelay() {
        if (block.timestamp - lastRebalanceTimestamp >= rebalanceDelay) revert REBALANCE_DELAY_NOT_MET();
        _;
    }

    /// @param _vault The Balancer vault that holds the pool's cash.
    constructor(address _vault) {
        vault = IVault(_vault);
    }

    /// @notice Initializes the asset manager.
    /// @param _poolId The LRT Balancer pool ID.
    /// @param _controller The LRT controller.
    /// @param _operatorRegistry The operator registry used for token allocation.
    /// @param _withdrawalQueue The contract used to queue and process withdrawals.
    function initialize(bytes32 _poolId, address _controller, address _operatorRegistry, address _withdrawalQueue) external {
        if (poolId != bytes32(0) || _poolId == bytes32(0)) revert INVALID_INITIALIZATION();

        poolId = _poolId;
        controller = _controller;
        operatorRegistry = IRioLRTOperatorRegistry(_operatorRegistry);
        withdrawalQueue = IRioLRTWithdrawalQueue(_withdrawalQueue);

        _setRebalanceDelay(24 hours);
    }

    /// @notice Adds a token by setting its config, depositing it into the vault, and updating the balance.
    /// @param token The token to add.
    /// @param amount The amount of tokens to add.
    /// @param config The token's asset management configuration.
    function addToken(IERC20 token, uint256 amount, TokenConfig calldata config) external onlyController {
        if (configs[address(token)].strategy != IStrategy(address(0))) revert TOKEN_ALREADY_ADDED();

        configs[address(token)] = config;

        if (token.allowance(address(this), address(vault)) < amount) {
            IOpenZeppelinERC20(address(token)).safeApprove(address(vault), type(uint256).max);
        }

        IVault.PoolBalanceOp[] memory ops = new IVault.PoolBalanceOp[](2);
        ops[0] = IVault.PoolBalanceOp(IVault.PoolBalanceOpKind.UPDATE, poolId, token, amount);
        ops[1] = IVault.PoolBalanceOp(IVault.PoolBalanceOpKind.DEPOSIT, poolId, token, amount);

        vault.managePoolBalance(ops);

        emit TokenAdded(token, amount, config);
    }

    /// @notice Removes a token by withdrawing it from the vault and updating the balance to 0.
    /// @param token The token to remove.
    /// @param amount The amount of tokens to remove.
    /// @param recipient The recipient of the tokens.
    function removeToken(IERC20 token, uint256 amount, address recipient) external onlyController {
        if (configs[address(token)].strategy == IStrategy(address(0))) revert INVALID_TOKEN();

        // Clear the token's config. This allows the token to be re-added with a different strategy at a later time.
        delete configs[address(token)];

        IVault.PoolBalanceOp[] memory ops = new IVault.PoolBalanceOp[](2);
        ops[0] = IVault.PoolBalanceOp(IVault.PoolBalanceOpKind.WITHDRAW, poolId, token, amount);
        ops[1] = IVault.PoolBalanceOp(IVault.PoolBalanceOpKind.UPDATE, poolId, token, 0);

        vault.managePoolBalance(ops);
        IOpenZeppelinERC20(address(token)).safeTransfer(recipient, amount);

        emit TokenRemoved(token, amount, recipient);
    }

    /// @notice Sets the target AUM percentage for a token.
    /// @param token The token to set the target AUM percentage for.
    /// @param newTargetAUMPercentage The new target AUM percentage.
    function setTargetAUMPercentage(IERC20 token, uint96 newTargetAUMPercentage) external onlyController {
        if (configs[address(token)].strategy == IStrategy(address(0))) revert INVALID_TOKEN();

        configs[address(token)].targetAUMPercentage = newTargetAUMPercentage;

        emit TargetAUMPercentageSet(token, newTargetAUMPercentage);
    }

    /// @notice Sets the rebalance delay.
    /// @param newRebalanceDelay The new rebalance delay.
    function setRebalanceDelay(uint40 newRebalanceDelay) external onlyController {
        _setRebalanceDelay(newRebalanceDelay);
    }

    /// @notice Receive underlying tokens as a reward to the LRT.
    /// @param token The token being rewarded.
    /// @param amount The amount of tokens being rewarded.
    function receiveReward(address token, uint256 amount) external {
        bytes32 _poolId = poolId;

        IOpenZeppelinERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        // Inform the vault of the new 'managed' tokens and move them into the pool's cash balance.
        IVault.PoolBalanceOp[] memory ops = new IVault.PoolBalanceOp[](2);
        ops[0] = IVault.PoolBalanceOp(IVault.PoolBalanceOpKind.UPDATE, _poolId, IERC20(token), getAUM(token) + amount);
        ops[1] = IVault.PoolBalanceOp(IVault.PoolBalanceOpKind.DEPOSIT, _poolId, IERC20(token), amount);

        vault.managePoolBalance(ops);

        emit RewardReceived(IERC20(token), amount);
    }

    /// @notice Rebalances `token` in the pool (LRT) by processing outstanding withdrawals,
    /// depositing or withdrawing funds from EigenLayer, and updating the pool's cash and managed balances.
    /// @param token The token to rebalance.
    function rebalance(address token) external onlyAfterRebalanceDelay {
        (uint256 cash, uint256 aum) = getPoolBalances(token);

        // Process outstanding withdrawals before rebalancing, if any.
        uint256 owed = withdrawalQueue.getAmountOwedInCurrentEpoch(IERC20(token));
        if (owed != 0) {
            (cash, aum) = _processWithdrawalsForToken(token, cash, aum, owed);
        }

        TokenConfig memory config = configs[token];
        uint256 targetAUM = (cash + aum).mulWad(config.targetAUMPercentage);
        if (targetAUM > aum) {
            // Pool is under-invested. Deposit funds to EigenLayer.
            _depositIntoEigenLayer(config.strategy, token, aum, targetAUM - aum);
        } else {
            // Pool is over-invested. Withdraw funds from EigenLayer.
            // TODO: Withdrawer should be set to this contract if queueing due to over-investment.
            _queueWithdrawalFromEigenLayer(config.strategy, token, aum, aum - targetAUM);
        }
    }

    /// @notice Returns cash (pool) and managed (EigenLayer) balances for a token.
    /// @param token The token to get the balances for.
    function getPoolBalances(address token) public view returns (uint256 cash, uint256 managed) {
        cash = getCash(token);
        managed = getAUM(token);
    }

    /// @notice Returns the cash balance of a token.
    /// @param token The token to get the cash balance for.
    function getCash(address token) public view returns (uint256 cash) {
        (cash,,,) = vault.getPoolTokenInfo(poolId, IERC20(token));
    }

    /// @notice Returns the AUM of a token.
    /// @param token The token to get the AUM for.
    function getAUM(address token) public view returns (uint256 aum) {
        TokenConfig memory config = configs[token];
        if (config.strategy == IStrategy(address(0))) revert INVALID_TOKEN();

        aum = config.strategy.sharesToUnderlyingView(strategyShares[address(config.strategy)]);
    }

    /// @dev Processes withdrawals for a token by withdrawing cash from the vault and/or
    /// queuing withdrawals from EigenLayer.
    /// @param token The token to process withdrawals for.
    /// @param cash The current cash balance of the token.
    /// @param aum The current AUM of the token.
    /// @param owed The amount of tokens owed to withdrawals in the current epoch.
    function _processWithdrawalsForToken(address token, uint256 cash, uint256 aum, uint256 owed) internal returns (uint256, uint256) {
        bytes32 _poolId = poolId;
        uint256 withdrawable = Math.min(cash, owed);
        uint256 deficit = owed - withdrawable;

        IVault.PoolBalanceOp[] memory ops;

        // The pool has no cash at all. Queue The total amount.
        if (cash == 0) {
            // Take the `deficit` from the pool's `aum`.
            ops = new IVault.PoolBalanceOp[](1);
            ops[0] = IVault.PoolBalanceOp(IVault.PoolBalanceOpKind.UPDATE, _poolId, IERC20(token), aum - deficit);

            vault.managePoolBalance(ops);

            withdrawalQueue.recordQueuedEigenLayerWithdrawalsForCurrentEpoch(
                IERC20(token), _queueWithdrawalFromEigenLayer(configs[token].strategy, token, aum, owed)
            );
            return (cash, aum - owed);
        }

        // Withdraw `withdrawable` from `cash` and takes the `deficit` from the pool's `aum`.
        ops = new IVault.PoolBalanceOp[](2);
        ops[0] = IVault.PoolBalanceOp(IVault.PoolBalanceOpKind.WITHDRAW, _poolId, IERC20(token), withdrawable);
        ops[1] = IVault.PoolBalanceOp(IVault.PoolBalanceOpKind.UPDATE, _poolId, IERC20(token), aum - deficit);

        vault.managePoolBalance(ops);

        // Transfer the funds that were withdrawn from the vault to the withdrawal queue.
        IOpenZeppelinERC20(token).safeTransfer(address(withdrawalQueue), withdrawable);

        // There was enough cash to cover all withdrawals in the current epoch. Mark it as completed.
        if (withdrawable == owed) {
            withdrawalQueue.completeWithdrawalsFromPoolForCurrentEpoch(IERC20(token));
            return (cash - withdrawable, aum);
        }

        // There is a cash deficit. Queue the remaining amount.
        withdrawalQueue.recordQueuedEigenLayerWithdrawalsForCurrentEpoch(
            IERC20(token), _queueWithdrawalFromEigenLayer(configs[token].strategy, token, aum, deficit)
        );
        return (cash - withdrawable, aum - deficit);
    }

    /// @dev Deposits funds into EigenLayer through the operators that are returned from the registry.
    /// @param strategy The strategy to deposit the funds into.
    /// @param token The token to deposit.
    /// @param aum The current AUM of the token.
    /// @param amount The amount of tokens to deposit.
    function _depositIntoEigenLayer(IStrategy strategy, address token, uint256 aum, uint256 amount) internal {
        bytes32 _poolId = poolId;

        // Update the vault with the new managed balance and pull funds from the vault.
        IVault.PoolBalanceOp[] memory ops = new IVault.PoolBalanceOp[](2);
        ops[0] = IVault.PoolBalanceOp(IVault.PoolBalanceOpKind.UPDATE, _poolId, IERC20(token), aum);
        ops[1] = IVault.PoolBalanceOp(IVault.PoolBalanceOpKind.WITHDRAW, _poolId, IERC20(token), amount);

        vault.managePoolBalance(ops);

        // Allocate tokens to selected operators.
        (, IRioLRTOperatorRegistry.OperatorAllocation[] memory operatorAllocations) = operatorRegistry.allocate(token, amount);

        address operator;
        uint256 allocation;
        uint256 shares;
        for (uint256 i = 0; i < operatorAllocations.length;) {
            operator = operatorAllocations[i].operator;
            allocation = operatorAllocations[i].allocation;

            IOpenZeppelinERC20(token).safeTransfer(operator, allocation);
            shares += IRioLRTOperator(operator).stakeERC20(strategy, IOpenZeppelinERC20(token), allocation);

            unchecked {
                ++i;
            }
        }
        strategyShares[address(strategy)] += shares;
    }

    /// @dev Queues a withdrawal from EigenLayer through the operators that are returned from the registry.
    /// @param strategy The strategy to withdraw the funds from.
    /// @param token The token to withdraw.
    /// @param aum The current AUM of the token.
    /// @param amount The amount of tokens to withdraw.
    function _queueWithdrawalFromEigenLayer(IStrategy strategy, address token, uint256 aum, uint256 amount) internal returns (bytes32 aggregateRoot) {
        bytes32 _poolId = poolId;

        // Remove the tokens from the pool's managed balance.
        IVault.PoolBalanceOp[] memory ops = new IVault.PoolBalanceOp[](1);
        ops[0] = IVault.PoolBalanceOp(IVault.PoolBalanceOpKind.UPDATE, _poolId, IERC20(token), aum - amount);

        vault.managePoolBalance(ops);

        // Deallocate tokens from selected operators.
        (, IRioLRTOperatorRegistry.OperatorDeallocation[] memory operatorDeallocations) = operatorRegistry.deallocate(token, amount);

        bytes32[] memory roots = new bytes32[](operatorDeallocations.length);

        address operator;
        uint256 deallocation;
        uint256 sharesToWithdraw;
        uint256 shares;
        for (uint256 i = 0; i < operatorDeallocations.length;) {
            operator = operatorDeallocations[i].operator;
            deallocation = operatorDeallocations[i].deallocation;

            shares += sharesToWithdraw = strategy.underlyingToSharesView(deallocation);
            roots[i] = IRioLRTOperator(operator).queueWithdrawal(strategy, shares, address(withdrawalQueue));

            unchecked {
                ++i;
            }
        }
        strategyShares[address(strategy)] -= shares;
        aggregateRoot = keccak256(abi.encode(roots));
    }

    /// @dev Sets the rebalance delay.
    /// @param newRebalanceDelay The new rebalance delay.
    function _setRebalanceDelay(uint40 newRebalanceDelay) internal {
        rebalanceDelay = newRebalanceDelay;

        emit RebalanceDelaySet(newRebalanceDelay);
    }
}
