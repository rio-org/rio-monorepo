// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {FixedPointMathLib} from '@solady/utils/FixedPointMathLib.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {IVault} from '@balancer-v2/contracts/interfaces/contracts/vault/IVault.sol';
import {IERC20} from '@balancer-v2/contracts/interfaces/contracts/solidity-utils/openzeppelin/IERC20.sol';
import {IERC20 as IOpenZeppelinERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {IRioLRTOperatorRegistry} from 'contracts/interfaces/IRioLRTOperatorRegistry.sol';
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

    /// @notice The operator registry used for token allocation.
    IRioLRTOperatorRegistry public operatorRegistry;

    /// @notice A mapping of tokens to their asset management configurations.
    mapping(address token => TokenConfig config) public configs;

    /// @notice A mapping of strategies to their shares held by the LRT.
    mapping(address strategy => uint256 shares) public strategyShares;

    /// @notice Require that the caller is the LRT controller.
    modifier onlyController() {
        if (msg.sender != controller) revert ONLY_LRT_CONTROLLER();
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
    function initialize(bytes32 _poolId, address _controller, address _operatorRegistry) external {
        if (poolId != bytes32(0) || _poolId == bytes32(0)) revert INVALID_INITIALIZATION();

        poolId = _poolId;
        controller = _controller;
        operatorRegistry = IRioLRTOperatorRegistry(_operatorRegistry);
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

    function rebalance(address token) public {
        TokenConfig memory config = configs[token];

        (uint256 cash, uint256 aum) = getPoolBalances(token);
        uint256 targetAUM = (cash + aum).mulWad(config.targetAUMPercentage);
        if (targetAUM > aum) {
            // Pool is under-invested. Deposit funds to EigenLayer.
            _depositIntoEigenLayer(config.strategy, token, aum, targetAUM - aum);
        } else {
            // Pool is over-invested. Withdraw funds from EigenLayer.
            _withdrawFromEigenLayer(token, aum - targetAUM);
        }
    }

    function rebalanceAll() external {}

    /// @notice Returns cash (pool) and managed (EigenLayer) balances for a token.
    /// @param token The token to get the balances for.
    function getPoolBalances(address token) public view returns (uint256 cash, uint256 managed) {
        (cash,,,) = vault.getPoolTokenInfo(poolId, IERC20(token));
        managed = getAUM(token);
    }

    /// @notice Returns the AUM of a token.
    /// @param token The token to get the AUM for.
    function getAUM(address token) public view returns (uint256 aum) {
        TokenConfig memory config = configs[token];
        if (config.strategy == IStrategy(address(0))) revert INVALID_TOKEN();

        aum = config.strategy.sharesToUnderlyingView(strategyShares[address(config.strategy)]);
    }

    /// @notice Deposits funds into the EigenLayer through the operators that are returned from the registry.
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

    /// @param amount The amount of tokens to withdraw from the EigenLayer.
    function _withdrawFromEigenLayer(address token, uint256 amount) internal {}
}
