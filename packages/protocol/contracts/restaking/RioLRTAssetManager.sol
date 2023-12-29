// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {Math} from '@openzeppelin/contracts/utils/math/Math.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {FixedPointMathLib} from '@solady/utils/FixedPointMathLib.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {UUPSUpgradeable} from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import {IRioLRTOperatorRegistry} from 'contracts/interfaces/IRioLRTOperatorRegistry.sol';
import {IRioLRTWithdrawalQueue} from 'contracts/interfaces/IRioLRTWithdrawalQueue.sol';
import {IRioLRTAssetManager} from 'contracts/interfaces/IRioLRTAssetManager.sol';
import {WrappedTokenHandler} from 'contracts/wrapping/WrappedTokenHandler.sol';
import {IRioLRTOperator} from 'contracts/interfaces/IRioLRTOperator.sol';
import {IStrategy} from 'contracts/interfaces/eigenlayer/IStrategy.sol';
import {IRioLRTGateway} from 'contracts/interfaces/IRioLRTGateway.sol';
import {IRioLRTIssuer} from 'contracts/interfaces/IRioLRTIssuer.sol';
import {IVault} from 'contracts/interfaces/balancer/IVault.sol';
import {IWETH} from 'contracts/interfaces/misc/IWETH.sol';

contract RioLRTAssetManager is IRioLRTAssetManager, WrappedTokenHandler, OwnableUpgradeable, UUPSUpgradeable {
    using FixedPointMathLib for uint256;
    using SafeERC20 for IERC20;

    /// @dev The Beacon Chain ETH strategy pseudo-address.
    address internal constant BEACON_CHAIN_STRATEGY = 0xbeaC0eeEeeeeEEeEeEEEEeeEEeEeeeEeeEEBEaC0;

    /// @dev The per-validator deposit amount.
    uint256 internal constant DEPOSIT_SIZE = 32 ether;

    /// @notice The Balancer vault that holds the pool's cash.
    IVault public immutable vault;

    /// @notice The wrapped ether token contract.
    IWETH public immutable weth;

    /// @notice The underlying Balancer pool ID.
    bytes32 public poolId;

    /// @notice The required delay between rebalances.
    uint24 public rebalanceDelay;

    /// @notice The LRT gateway.
    IRioLRTGateway public gateway;

    /// @notice The operator registry used for token allocation.
    IRioLRTOperatorRegistry public operatorRegistry;

    /// @notice The contract used to queue and process withdrawals.
    IRioLRTWithdrawalQueue public withdrawalQueue;

    /// @notice A mapping of strategies to their shares held by the LRT.
    mapping(address strategy => uint256 shares) internal strategyShares;

    /// @notice A mapping of tokens to their rebalance information, including the target
    /// aum percentage and the timestamp at which the token was last rebalanced.
    mapping(address token => TokenRebalance rebalance) internal tokenRebalances;

    /// @notice A mapping of underlying tokens to their EigenLayer strategies.
    mapping(address token => address strategy) internal tokenStrategies;

    /// @notice Require that the caller is the LRT gateway.
    modifier onlyGateway() {
        if (msg.sender != address(gateway)) revert ONLY_LRT_GATEWAY();
        _;
    }

    /// @notice Require that the caller is the LRT gateway OR the owner.
    modifier onlyOwnerOrGateway() {
        if (msg.sender != address(gateway) && msg.sender != owner()) revert ONLY_OWNER_OR_LRT_GATEWAY();
        _;
    }

    /// @notice Require that the rebalance delay has been met.
    /// @param token The token to check the rebalance delay for.
    modifier onlyAfterRebalanceDelay(address token) {
        uint256 lastRebalancedAt = tokenRebalances[token].lastRebalancedAt;
        if (lastRebalancedAt > 0 && block.timestamp - lastRebalancedAt < rebalanceDelay) {
            revert REBALANCE_DELAY_NOT_MET();
        }
        _;
    }

    // forgefmt: disable-next-item
    /// @param tokenWrapperFactory_ The contract that deploys token wrappers.
    /// @param vault_ The Balancer vault that holds the pool's cash.
    /// @param weth_ The wrapped ether token address.
    constructor(address tokenWrapperFactory_, address vault_, address weth_) WrappedTokenHandler(tokenWrapperFactory_) {
        _disableInitializers();

        vault = IVault(vault_);
        weth = IWETH(weth_);
    }

    // forgefmt: disable-next-item
    /// @notice Initializes the asset manager.
    /// @param initialOwner The initial owner of the contract.
    /// @param poolId_ The underlying Balancer pool ID.
    /// @param deployment The LRT deployment.
    function initialize(
        address initialOwner,
        bytes32 poolId_,
        IRioLRTIssuer.LRTDeployment calldata deployment
    ) external initializer {
        poolId = poolId_;
        gateway = IRioLRTGateway(deployment.gateway);
        operatorRegistry = IRioLRTOperatorRegistry(deployment.operatorRegistry);
        withdrawalQueue = IRioLRTWithdrawalQueue(deployment.withdrawalQueue);

        _transferOwnership(initialOwner);
        _setRebalanceDelay(24 hours);
    }

    /// @notice Returns the amount of shares held for the given EigenLayer strategy.
    /// @param strategy The strategy to get the shares for.
    function getStrategyShares(address strategy) public view returns (uint256) {
        return strategyShares[strategy];
    }

    /// @notice Returns the rebalance information for a token.
    /// @param token The token to get the rebalance information for.
    function getRebalance(address token) public view returns (TokenRebalance memory) {
        return tokenRebalances[token];
    }

    /// @notice Returns the strategy for the given token.
    /// @param token The token to get the strategy for.
    function getStrategy(address token) public view returns (address strategy) {
        strategy = tokenStrategies[token];
        if (strategy == address(0)) revert NO_STRATEGY_FOR_TOKEN();
    }

    /// @notice Sets the rebalance delay.
    /// @param newRebalanceDelay The new rebalance delay.
    function setRebalanceDelay(uint24 newRebalanceDelay) external onlyOwner {
        _setRebalanceDelay(newRebalanceDelay);
    }

    /// @dev Sets the target AUM percentage for a token. That is, the percentage of the
    /// token's total balance that should be deposited into EigenLayer.
    /// @param token The token to set the target AUM percentage for.
    /// @param newTargetAUMPercentage The new target AUM percentage.
    function setTargetAUMPercentage(address token, uint64 newTargetAUMPercentage) external onlyOwnerOrGateway {
        _setTargetAUMPercentage(token, newTargetAUMPercentage);
    }

    /// @notice Sets a token's EigenLayer strategy.
    /// @param token The token to set the strategy for.
    /// @param newStrategy The new strategy.
    function setStrategy(address token, address newStrategy) external onlyGateway {
        _setStrategy(token, newStrategy);
    }

    /// @notice Enable asset management for the token by setting up its wrapper, allowing
    /// the vault to pull tokens from this contract, and making the initial deposit.
    /// @param token The token to be enabled.
    /// @param amount The amount of the token to deposit.
    function enableManagementAndDeposit(address token, uint256 amount) external onlyGateway {
        if (_hasWrapper(token)) _setup(token);

        // Allow the vault to pull tokens from this contract.
        if (IERC20(token).allowance(address(this), address(vault)) < amount) {
            IERC20(token).safeApprove(address(vault), type(uint256).max);
        }
        _depositCash(token, amount, 0);
    }

    /// Withdraws the remaining balance of `token` from the Balancer pool.
    /// @param token The token to be withdrawn.
    /// @param amount The amount of the token to withdraw.
    /// @param recipient The address to send the withdrawn tokens to.
    function withdrawRemainingBalance(address token, uint256 amount, address recipient) external onlyGateway {
        _withdrawCashAndSetManagedBalance(token, amount, 0);
        IERC20(token).safeTransfer(recipient, amount);
    }

    /// @notice Donate underlying tokens to the pool.
    /// @param token The token to donate.
    /// @param amount The amount of tokens to donate.
    function donateUnderlying(address token, uint256 amount) external {
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        _depositCash(token, amount, getManagedBalance(token));

        emit DonationReceived(token, amount);
    }

    // forgefmt: disable-next-item
    /// @notice Rebalances `token` in the pool by processing outstanding withdrawals,
    /// depositing excess cash into EigenLayer, and updating the pool's cash and managed balances.
    /// @param token The token to rebalance.
    /// @dev `getPoolBalances` will revert if the token is not registered in the pool.
    function rebalance(address token) external onlyAfterRebalanceDelay(token) {
        tokenRebalances[token].lastRebalancedAt = uint40(block.timestamp);

        (uint256 cashBalance, uint256 managedBalance) = getPoolBalances(token);

        // Process pending withdrawals before rebalancing, if any.
        uint256 sharesOwed = withdrawalQueue.getSharesOwedInCurrentEpoch(token);
        if (sharesOwed > 0) {
            (cashBalance, managedBalance) = _queueOrSettlePendingWithdrawals(
                token, cashBalance, managedBalance, sharesOwed
            );
        }

        // Determine the target managed balance. If we're under-invested, deposit funds into EigenLayer.
        uint256 targetAUM = (cashBalance + managedBalance).mulWad(tokenRebalances[token].targetAUMPercentage);
        if (managedBalance < targetAUM) {
            uint256 amountToDeposit = targetAUM - managedBalance;
            if (token == address(weth)) {
                _depositETHIntoEigenLayer(amountToDeposit, managedBalance);
            } else {
                _depositTokenIntoEigenLayer(token, amountToDeposit, managedBalance);
            }
        }
    }

    /// @notice Returns cash (pool) and managed (EigenLayer) balances for a token.
    /// @param token The token to get the balances for.
    function getPoolBalances(address token) public view returns (uint256 cashBalance, uint256 managedBalance) {
        cashBalance = getCashBalance(token);
        managedBalance = getManagedBalance(token);
    }

    /// @notice Returns the cash balance of a token. "Cash" refers to the tokens sitting
    /// in the Balancer vault, which are readily accessible in the pool.
    /// @param token The token to get the cash balance for.
    function getCashBalance(address token) public view returns (uint256 cashBalance) {
        (cashBalance,,,) = vault.getPoolTokenInfo(poolId, token);
    }

    /// @notice Returns the managed balance of a token. "Managed" refers to the tokens
    /// that are in EigenLayer earning yield via restaking.
    /// @param token The token to get the managed balance for.
    function getManagedBalance(address token) public view returns (uint256 managedBalance) {
        address strategy = getStrategy(token);
        managedBalance = getPoolTokensForStrategyShares(token, strategyShares[strategy]);
    }

    /// @notice Converts an amount of EigenLayer shares to the equivalent amount
    /// of underlying pool tokens, accounting for wrapped tokens.
    /// @param token The token address.
    /// @param shares The amount of EigenLayer shares.
    function getPoolTokensForStrategyShares(address token, uint256 shares) public view returns (uint256 amount) {
        address strategy = getStrategy(token);
        if (strategy == BEACON_CHAIN_STRATEGY) {
            return shares;
        }
        amount = IStrategy(strategy).sharesToUnderlyingView(shares);
        if (_hasWrapper(token)) {
            amount = _getWrappedForUnwrapped(token, amount);
        }
    }

    /// @notice Converts an amount of pool tokens to the equivalent amount
    /// of EigenLayer shares, accounting for wrapped tokens.
    /// @param token The token address.
    /// @param amount The amount of tokens.
    function getStrategySharesForPoolTokens(address token, uint256 amount) public view returns (uint256 shares) {
        address strategy = getStrategy(token);
        if (strategy == BEACON_CHAIN_STRATEGY) {
            return amount;
        }
        if (_hasWrapper(token)) {
            amount = _getUnwrappedForWrapped(token, amount);
        }
        shares = IStrategy(strategy).underlyingToSharesView(amount);
    }

    /// forgefmt: disable-next-item
    /// @notice Pull available cash to the caller and calculate the amount of shares owed (debt).
    /// @param token The token to pull cash for.
    /// @param tokensOwed The amount of tokens owed to the withdrawer.
    function pullCashAndCalculateShareDebt(address token, uint256 tokensOwed) external onlyGateway returns (uint256 cashPulled, uint256 sharesOwed) {
        (uint256 cashBalance, uint256 managedBalance) = getPoolBalances(token);

        uint256 sharesOwedInCurrentEpoch = withdrawalQueue.getSharesOwedInCurrentEpoch(token);
        uint256 cashOwedInCurrentEpoch = getPoolTokensForStrategyShares(token, sharesOwedInCurrentEpoch);

        // The pool has no cash at all. Calculate the number of shares owed to the withdrawer.
        if (cashBalance == 0) {
            sharesOwed = getStrategySharesForPoolTokens(token, tokensOwed);

            // We subtract the owed amount from the managed balance until the next rebalance.
            // At that time, the shares held will be decreased to reflect the withdrawal.
            _syncManagedBalance(token, managedBalance - cashOwedInCurrentEpoch - tokensOwed);

            return (0, sharesOwed);
        }

        cashPulled = Math.min(cashBalance, tokensOwed);
        uint256 tokenDeficit = tokensOwed - cashPulled;

        sharesOwed = getStrategySharesForPoolTokens(token, tokenDeficit);
        _withdrawCashAndSetManagedBalance(token, cashPulled, managedBalance - cashOwedInCurrentEpoch - tokenDeficit);

        // Send cash to the caller.
        IERC20(token).safeTransfer(msg.sender, cashPulled);

        return (cashPulled, sharesOwed);
    }

    // forgefmt: disable-next-item
    /// @notice Processes pending withdrawals for a token in the current epoch by settling using the pool's cash
    /// balance and/or queueing withdrawals from EigenLayer.
    /// @param token The token to process withdrawals for.
    /// @param cashBalance The current cash balance for the token.
    /// @param managedBalance The current managed balance for the token.
    /// @param sharesOwed The amount of EigenLayer strategy shares owed for the `token` in the current epoch.
    function _queueOrSettlePendingWithdrawals(address token, uint256 cashBalance, uint256 managedBalance, uint256 sharesOwed) internal returns (uint256, uint256) {
        uint256 tokensOwed = getPoolTokensForStrategyShares(token, sharesOwed);
        address strategy = getStrategy(token);

        // If the pool has no cash balance, we need to queue the entire amount for withdrawal from EigenLayer.
        if (cashBalance == 0) {
            bytes32 aggregateRoot = _queueEigenLayerTokenWithdrawals(token, strategy, managedBalance, tokensOwed, sharesOwed);
            withdrawalQueue.recordQueuedEigenLayerWithdrawalsForCurrentEpoch(token, aggregateRoot);

            return (cashBalance, managedBalance - tokensOwed);
        }

        uint256 tokensAvailable = Math.min(cashBalance, tokensOwed);
        uint256 tokenDeficit = tokensOwed - tokensAvailable;

        // Pull what we can from the pool's cash balance and send it to the withdrawal queue.
        _withdrawCashAndSetManagedBalance(token, tokensAvailable, managedBalance - tokenDeficit);
        IERC20(token).safeTransfer(address(withdrawalQueue), tokensAvailable);

        // If there's a deficit, queue the remaining amount for withdrawal from EigenLayer.
        // Otherwise, mark the current epoch withdrawals as settled.
        if (tokenDeficit > 0) {
            uint256 shareDeficit = getStrategySharesForPoolTokens(token, tokenDeficit);
            bytes32 aggregateRoot = _queueEigenLayerTokenWithdrawals(token, strategy, managedBalance, tokenDeficit, shareDeficit);
            withdrawalQueue.recordQueuedEigenLayerWithdrawalsForCurrentEpoch(token, aggregateRoot);
        } else {
            withdrawalQueue.settleWithdrawalsFromPoolForCurrentEpoch(token);
        }
        return (cashBalance - tokensAvailable, managedBalance - tokenDeficit);
    }

    // forgefmt: disable-next-item
    /// @dev Deposits the given `amount` of `token` into EigenLayer via the operators
    /// that are returned from the registry.
    /// @param token The pool token to deposit.
    /// @param tokensToDeposit The amount of tokens to deposit.
    /// @param managedBalance The current managed balance of the token.
    function _depositTokenIntoEigenLayer(address token, uint256 tokensToDeposit, uint256 managedBalance) internal {
        address strategy = getStrategy(token);

        // Pull funds from the vault and update the managed balance.
        _withdrawCashAndSetManagedBalance(token, tokensToDeposit, managedBalance + tokensToDeposit);

        // Unwrap the tokens, if needed.
        if (_hasWrapper(token)) (token, tokensToDeposit) = _unwrap(token, tokensToDeposit);

        // Allocate strategy shares to selected operators.
        uint256 sharesToAllocate = IStrategy(strategy).underlyingToSharesView(tokensToDeposit);
        (uint256 sharesAllocated, IRioLRTOperatorRegistry.OperatorStrategyAllocation[] memory allocations) = operatorRegistry.allocateStrategyShares(
            strategy,
            sharesToAllocate
        );
        if (sharesAllocated < sharesToAllocate) revert INSUFFICIENT_OPERATOR_CAPACITY();

        uint256 sharesReceived;
        for (uint256 i = 0; i < allocations.length;) {
            IRioLRTOperatorRegistry.OperatorStrategyAllocation memory allocation = allocations[i];

            IERC20(token).safeTransfer(allocation.operator, allocation.tokens);
            sharesReceived += IRioLRTOperator(allocation.operator).stakeERC20(strategy, token, allocation.tokens);
            unchecked {
                ++i;
            }
        }
        if (sharesReceived != sharesAllocated) revert INCORRECT_NUMBER_OF_SHARES_RECEIVED();
        strategyShares[strategy] += sharesReceived;
    }

    /// @dev Deposits ETH into EigenLayer through the operators that are returned from the registry.
    /// @param amount The amount of ETH to deposit.
    /// @param managedBalance The current amount of ETH under management.
    function _depositETHIntoEigenLayer(uint256 amount, uint256 managedBalance) internal {
        uint256 depositCount = amount / DEPOSIT_SIZE;
        if (depositCount == 0) return; // Not enough ETH.

        // forgefmt: disable-next-item
        // Allocate ETH to selected operators.
        (uint256 depositsAllocated, IRioLRTOperatorRegistry.OperatorETHAllocation[] memory allocations) = operatorRegistry.allocateETHDeposits(depositCount);

        uint256 depositAmount = depositsAllocated * DEPOSIT_SIZE;

        // Update the vault with the new managed balance and pull funds from the vault.
        _withdrawCashAndSetManagedBalance(address(weth), depositAmount, managedBalance + depositAmount);

        // Withdraw `depositAmount` ETH to this contract.
        weth.withdraw(depositAmount);

        for (uint256 i = 0; i < allocations.length;) {
            uint256 deposits = allocations[i].deposits;

            IRioLRTOperator(allocations[i].operator).stakeETH{value: deposits * DEPOSIT_SIZE}(
                deposits, allocations[i].pubKeyBatch, allocations[i].signatureBatch
            );
            unchecked {
                ++i;
            }
        }
        strategyShares[BEACON_CHAIN_STRATEGY] += depositAmount;
    }

    // forgefmt: disable-next-item
    /// @dev Queues a withdrawal from EigenLayer through the operators that are returned from the registry.
    /// @param token The token to withdraw.
    /// @param strategy The strategy to withdraw the funds from.
    /// @param managedBalance The current managed balance of the token.
    /// @param tokensOwed The amount of tokens owed to the withdrawers.
    /// @param sharesToWithdraw The number of shares to withdraw.
    function _queueEigenLayerTokenWithdrawals(address token, address strategy, uint256 managedBalance, uint256 tokensOwed, uint256 sharesToWithdraw) internal returns (bytes32 aggregateRoot) {
        // Remove the owed shares from the pool's managed balance. At this time,
        // we consider the shares as having been withdrawn from the pool.
        _syncManagedBalance(token, managedBalance - tokensOwed);

        // Deallocate shares from selected operators.
        (, IRioLRTOperatorRegistry.OperatorStrategyDeallocation[] memory operatorDeallocations) = operatorRegistry.deallocateStrategyShares(
            strategy, sharesToWithdraw
        );

        bytes32[] memory roots = new bytes32[](operatorDeallocations.length);

        uint256 sharesWithdrawn;
        for (uint256 i = 0; i < operatorDeallocations.length;) {
            address operator = operatorDeallocations[i].operator;
            uint256 shares = operatorDeallocations[i].shares;

            sharesWithdrawn += shares;
            roots[i] = IRioLRTOperator(operator).queueWithdrawal(strategy, shares, address(withdrawalQueue));

            unchecked {
                ++i;
            }
        }
        strategyShares[strategy] -= sharesWithdrawn;
        aggregateRoot = keccak256(abi.encode(roots));
    }

    // forgefmt: disable-next-item
    /// @dev Queues an ETH withdrawal from EigenLayer through the operators that are returned from the registry.
    /// @param managedBalance The current amount of ETH under management.
    /// @param amountETH The amount of ETH to withdraw.
    function _queueEigenLayerETHWithdrawals(uint256 managedBalance, uint256 amountETH) internal returns (bytes32 aggregateRoot) {
        // Remove the tokens from the pool's managed balance. At this time,
        // we consider the ETH as having been withdrawn from the pool.
        _syncManagedBalance(address(weth), managedBalance - amountETH);

        // Deallocate ETH deposits from selected operators.
        uint256 depositCount = amountETH.divUp(DEPOSIT_SIZE);
        (, IRioLRTOperatorRegistry.OperatorETHDeallocation[] memory operatorDepositDeallocations) = operatorRegistry.deallocateETHDeposits(
            depositCount
        );
        bytes32[] memory roots = new bytes32[](operatorDepositDeallocations.length);

        uint256 shares;
        uint256 sharesToWithdraw;
        for (uint256 i = 0; i < operatorDepositDeallocations.length;) {
            address operator = operatorDepositDeallocations[i].operator;

            shares += sharesToWithdraw = operatorDepositDeallocations[i].deposits * DEPOSIT_SIZE;
            roots[i] = IRioLRTOperator(operator).queueWithdrawal(BEACON_CHAIN_STRATEGY, sharesToWithdraw, address(withdrawalQueue));

            unchecked {
                ++i;
            }
        }
        strategyShares[BEACON_CHAIN_STRATEGY] -= shares;
        aggregateRoot = keccak256(abi.encode(roots));
    }

    /// @dev Sets the rebalance delay.
    /// @param newRebalanceDelay The new rebalance delay.
    function _setRebalanceDelay(uint24 newRebalanceDelay) internal {
        rebalanceDelay = newRebalanceDelay;

        emit RebalanceDelaySet(newRebalanceDelay);
    }

    /// @dev Sets a token's EigenLayer strategy.
    /// @param token The token to set the strategy for.
    /// @param newStrategy The new strategy.
    function _setStrategy(address token, address newStrategy) internal {
        tokenStrategies[token] = newStrategy;

        emit StrategySet(token, newStrategy);
    }

    /// @dev Sets the target AUM percentage for a token.
    /// @param token The token to set the target AUM percentage for.
    /// @param newTargetAUMPercentage The new target AUM percentage.
    function _setTargetAUMPercentage(address token, uint64 newTargetAUMPercentage) internal {
        if (newTargetAUMPercentage > 1e18) revert INVALID_TARGET_AUM_PERCENTAGE();

        tokenRebalances[token].targetAUMPercentage = newTargetAUMPercentage;
        emit TargetAUMPercentageSet(token, newTargetAUMPercentage);
    }

    /// @dev Syncs the pool's managed balance for `token` to `newManagedBalance`.
    /// @param token The token to update the managed balance for.
    /// @param newManagedBalance The new managed balance of the token.
    function _syncManagedBalance(address token, uint256 newManagedBalance) internal {
        IVault.PoolBalanceOp[] memory ops = new IVault.PoolBalanceOp[](1);
        ops[0] = IVault.PoolBalanceOp(IVault.PoolBalanceOpKind.UPDATE, poolId, token, newManagedBalance);

        vault.managePoolBalance(ops);
    }

    /// @dev Deposits `amount` of `token` (aka cash) into the vault and syncs the pool's managed balance.
    /// @param token The token to deposit.
    /// @param amount The amount of tokens to deposit.
    /// @param currentManagedBalance The current managed balance of the token.
    function _depositCash(address token, uint256 amount, uint256 currentManagedBalance) internal {
        bytes32 _poolId = poolId;

        // Ensure that the tokens are added to the pool's managed balance before initiating a deposit,
        // since the deposit action will subsequently remove the tokens from this balance.
        IVault.PoolBalanceOp[] memory ops = new IVault.PoolBalanceOp[](2);
        ops[0] = IVault.PoolBalanceOp(IVault.PoolBalanceOpKind.UPDATE, _poolId, token, currentManagedBalance + amount);
        ops[1] = IVault.PoolBalanceOp(IVault.PoolBalanceOpKind.DEPOSIT, _poolId, token, amount);

        vault.managePoolBalance(ops);
    }

    /// @dev Withdraws `amount` of `token` (aka cash) from the vault and syncs the pool's managed balance.
    /// @param token The token to withdraw.
    /// @param amount The amount of tokens to withdraw.
    /// @param newManagedBalance The new managed balance of the token.
    function _withdrawCashAndSetManagedBalance(address token, uint256 amount, uint256 newManagedBalance) internal {
        bytes32 _poolId = poolId;

        // First, withdraw the specified amount of tokens, which will increase the pool's managed balance.
        // Then, sync the pool's managed balance explicitly to `newManagedBalance`.
        IVault.PoolBalanceOp[] memory ops = new IVault.PoolBalanceOp[](2);
        ops[0] = IVault.PoolBalanceOp(IVault.PoolBalanceOpKind.WITHDRAW, _poolId, token, amount);
        ops[1] = IVault.PoolBalanceOp(IVault.PoolBalanceOpKind.UPDATE, _poolId, token, newManagedBalance);

        vault.managePoolBalance(ops);
    }

    /// @dev Fallback function to receive ETH from the WETH contract.
    receive() external payable {
        if (msg.sender != address(weth)) revert SENDER_IS_NOT_WETH();
    }

    /// @dev Allows the owner to upgrade the asset manager implementation.
    /// @param newImplementation The implementation to upgrade to.
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
