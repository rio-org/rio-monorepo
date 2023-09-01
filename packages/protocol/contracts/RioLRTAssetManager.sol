// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {Clone} from '@solady/utils/Clone.sol';
import {FixedPointMathLib} from '@solady/utils/FixedPointMathLib.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {IVault} from '@balancer-v2/contracts/interfaces/contracts/vault/IVault.sol';
import {IERC20} from '@balancer-v2/contracts/interfaces/contracts/solidity-utils/openzeppelin/IERC20.sol';
import {IERC20 as IOpenZeppelinERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {IRioLRTAssetManager} from './interfaces/IRioLRTAssetManager.sol';
import {IOperatorRegistry} from './interfaces/IOperatorRegistry.sol';
import {IRioLRTController} from './interfaces/IRioLRTController.sol';
import {IStrategy} from './interfaces/eigenlayer/IStrategy.sol';
import {IOperator} from './interfaces/IOperator.sol';

// TODO: Make UUPS Upgradeable
contract RioLRTAssetManager is IRioLRTAssetManager, Clone {
    using SafeERC20 for IOpenZeppelinERC20;
    using FixedPointMathLib for uint256;

    /// @notice The Balancer vault that holds the pool's cash.
    IVault public immutable vault;

    /// @notice The operator registry used for token allocation.
    IOperatorRegistry public immutable operatorRegistry;

    /// @notice A mapping of tokens to their asset management configurations.
    mapping(address token => TokenConfig config) public configs;

    /// @notice Require that the caller is the LRT controller.
    modifier onlyController() {
        if (msg.sender != controller()) revert ONLY_LRT_CONTROLLER();
        _;
    }

    /// @param _vault The Balancer vault that holds the pool's cash.
    constructor(address _vault, address _operatorRegistry) {
        vault = IVault(_vault);
        operatorRegistry = IOperatorRegistry(_operatorRegistry);
    }

    /// @notice The LRT Balancer pool ID.
    function poolId() public pure returns (bytes32) {
        return _getArgBytes32(0);
    }

    /// @notice The LRT controller.
    function controller() public pure returns (address) {
        return _getArgAddress(32);
    }

    // TODO: Update to accept `TokenConfig`
    function addToken(IERC20 tokenToAdd, uint256 tokenToAddBalance, IVault _vault, bytes32 vaultPoolId) external onlyController {}
    
    function removeToken(IERC20 tokenToRemove, uint256 tokenToRemoveBalance, IVault _vault, bytes32 vaultPoolId, address recipient) external onlyController {}

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
        (cash,,,) = vault.getPoolTokenInfo(poolId(), IERC20(token));
        managed = getAUM(token);
    }

    // TODO: This is the total managed balance (shares -> underlying).
    // We cannot use `userUnderlyingView` because the operators are technically the users.
    // Instead, we need to store the shares here and call `userUnderlyingView` with the operator
    /// addresses.
    function getAUM(address token) public view returns (uint256 aum) {
        TokenConfig memory config = configs[token];
        if (config.strategy == IStrategy(address(0))) revert INVALID_STRATEGY();

        aum = config.strategy.userUnderlyingView(address(this));
    }

    /// @notice Deposits funds into the EigenLayer through the operators that are returned from the registry.
    /// @param strategy The strategy to deposit the funds into.
    /// @param token The token to deposit.
    /// @param aum The current AUM of the token.
    /// @param amount The amount of tokens to deposit.
    function _depositIntoEigenLayer(IStrategy strategy, address token, uint256 aum, uint256 amount) internal {
        bytes32 _poolId = poolId();

        // Update the vault with the new managed balance and pull funds from the vault.
        IVault.PoolBalanceOp[] memory ops = new IVault.PoolBalanceOp[](2);
        ops[0] = IVault.PoolBalanceOp(IVault.PoolBalanceOpKind.UPDATE, _poolId, IERC20(token), aum);
        ops[1] = IVault.PoolBalanceOp(IVault.PoolBalanceOpKind.WITHDRAW, _poolId, IERC20(token), amount);

        vault.managePoolBalance(ops);

        // Allocate tokens to selected operators.
        (, IOperatorRegistry.OperatorAllocation[] memory operatorAllocations) = operatorRegistry.allocate(token, amount);

        address operator;
        uint256 allocation;
        for (uint256 i = 0; i < operatorAllocations.length;) {
            operator = operatorAllocations[i].operator;
            allocation = operatorAllocations[i].allocation;

            IOpenZeppelinERC20(token).safeTransfer(operator, allocation);
            IOperator(operator).stakeERC20(strategy, IOpenZeppelinERC20(token), allocation);

            unchecked {
                ++i;
            }
        }
    }

    /// @param amount The amount of tokens to withdraw from the EigenLayer.
    function _withdrawFromEigenLayer(address token, uint256 amount) internal {}
}
