// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {Initializable} from '@openzeppelin/contracts/proxy/utils/Initializable.sol';
import {IDelegationManager} from './interfaces/eigenlayer/IDelegationManager.sol';
import {IStrategyManager} from './interfaces/eigenlayer/IStrategyManager.sol';
import {IEigenPodManager} from './interfaces/eigenlayer/IEigenPodManager.sol';
import {IStrategy} from './interfaces/eigenlayer/IStrategy.sol';
import {IOperator} from './interfaces/IOperator.sol';

contract Operator is IOperator, Initializable {
    using SafeERC20 for IERC20;

    /// @notice The primary entry and exit-point for funds into and out of EigenLayer.
    IStrategyManager public immutable strategyManager;

    /// @notice The contract used for creating and managing EigenPods.
    IEigenPodManager public immutable eigenPodManager;

    /// @notice The primary delegation contract for EigenLayer.
    IDelegationManager public immutable delegationManager;

    /// @notice The address that verifies staker delegation signatures and control forced undelegations.
    address public immutable delegationApprover;

    /// @notice The address of the operator registry.
    address public immutable operatorRegistry;

    /// @notice Require that the caller is the operator registry.
    modifier onlyOperatorRegistry() {
        if (msg.sender != operatorRegistry) revert ONLY_OPERATOR_REGISTRY();
        _;
    }

    /// @param _strategyManager The primary entry and exit-point for funds into and out of EigenLayer.
    /// @param _eigenPodManager The contract used for creating and managing EigenPods.
    /// @param _delegationManager The primary delegation contract for EigenLayer.
    /// @param _delegationApprover Address to verify staker delegation signatures and control forced undelegations.
    /// @param _operatorRegistry The address of the operator registry.
    constructor(
        address _strategyManager,
        address _eigenPodManager,
        address _delegationManager,
        address _delegationApprover,
        address _operatorRegistry
    ) initializer {
        strategyManager = IStrategyManager(_strategyManager);
        eigenPodManager = IEigenPodManager(_eigenPodManager);
        delegationManager = IDelegationManager(_delegationManager);

        delegationApprover = _delegationApprover;
        operatorRegistry = _operatorRegistry;
    }

    /// @notice Initializes the contract by registering the operator with EigenLayer.
    /// @param initialEarningsReceiver The initial reward address of the operator.
    /// @param initialMetadataURI The initial metadata URI.
    function initialize(address initialEarningsReceiver, string calldata initialMetadataURI) external initializer {
        delegationManager.registerAsOperator(
            IDelegationManager.OperatorDetails(initialEarningsReceiver, delegationApprover, 0), initialMetadataURI
        );
        eigenPodManager.createPod();
    }

    /// @notice Sets the operator's earnings receiver.
    /// @param newEarningsReceiver The new earnings receiver.
    function setEarningsReceiver(address newEarningsReceiver) external onlyOperatorRegistry {
        IDelegationManager.OperatorDetails memory details = delegationManager.operatorDetails(address(this));
        details.earningsReceiver = newEarningsReceiver;

        delegationManager.modifyOperatorDetails(details);
    }

    /// @notice Sets the operator's metadata URI.
    /// @param newMetadataURI The new metadata URI.
    function setMetadataURI(string calldata newMetadataURI) external onlyOperatorRegistry {
        delegationManager.updateOperatorMetadataURI(newMetadataURI);
    }

    // TODO:
    // - Restrict staking and withdrawal functions to the LRT asset manager.
    // - Add a batch deposit function.

    /// @notice Approve EigenLayer to spend an ERC20 token, then stake it into an EigenLayer strategy.
    /// @param strategy The strategy to stake the tokens into.
    /// @param token The token to stake.
    /// @param amount The amount of tokens to stake.
    function stakeERC20(IStrategy strategy, IERC20 token, uint256 amount) external returns (uint256 shares) {
        if (token.allowance(address(this), address(strategyManager)) < amount) {
            token.forceApprove(address(strategyManager), type(uint256).max);
        }
        shares = strategyManager.depositIntoStrategy(strategy, token, amount);
    }

    function stakeETH(bytes[] calldata pubkeys, bytes[] calldata signatures, bytes32[] calldata depositDataRoots) external payable {
        if (msg.value % 32 ether != 0) revert ETH_VALUE_NOT_MULTIPLE_OF_32();

        uint256 validators = msg.value / 32;
        for (uint256 i = 0; i < validators;) {
            eigenPodManager.stake{value: msg.value}(pubkeys[i], signatures[i], depositDataRoots[i]);

            unchecked {
                ++i;
            }
        }
    }

    function queueWithdrawal() external {}

    function completeQueuedWithdrawal() external {}

    function completeQueuedWithdrawals() external {}
}
