// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {Initializable} from '@openzeppelin/contracts/proxy/utils/Initializable.sol';
import {IDelegationManager} from 'contracts/interfaces/eigenlayer/IDelegationManager.sol';
import {IStrategyManager} from 'contracts/interfaces/eigenlayer/IStrategyManager.sol';
import {IEigenPodManager} from 'contracts/interfaces/eigenlayer/IEigenPodManager.sol';
import {ISlasher} from 'contracts/interfaces/eigenlayer/ISlasher.sol';
import {IStrategy} from 'contracts/interfaces/eigenlayer/IStrategy.sol';
import {IRioLRTOperator} from 'contracts/interfaces/IRioLRTOperator.sol';
import {Array} from 'contracts/utils/Array.sol';

contract RioLRTOperator is IRioLRTOperator, Initializable {
    using SafeERC20 for IERC20;
    using Array for *;

    /// @notice The primary entry and exit-point for funds into and out of EigenLayer.
    IStrategyManager public immutable strategyManager;

    /// @notice The contract used for creating and managing EigenPods.
    IEigenPodManager public immutable eigenPodManager;

    /// @notice The primary delegation contract for EigenLayer.
    IDelegationManager public immutable delegationManager;

    /// @notice The primary 'slashing' contract for EigenLayer.
    ISlasher public immutable slasher;

    /// @notice The address that verifies staker delegation signatures and control forced undelegations.
    address public immutable delegationApprover;

    /// @notice The address of the LRT operator registry.
    address public operatorRegistry;

    /// @notice The LRT asset manager.
    address public assetManager;

    /// @notice Require that the caller is the LRT's operator registry.
    modifier onlyOperatorRegistry() {
        if (msg.sender != operatorRegistry) revert ONLY_OPERATOR_REGISTRY();
        _;
    }

    /// @notice Require that the caller is the LRT's asset manager.
    modifier onlyAssetManager() {
        if (msg.sender != assetManager) revert ONLY_ASSET_MANAGER();
        _;
    }

    /// @param _strategyManager The primary entry and exit-point for funds into and out of EigenLayer.
    /// @param _eigenPodManager The contract used for creating and managing EigenPods.
    /// @param _delegationManager The primary delegation contract for EigenLayer.
    /// @param _slasher The primary 'slashing' contract for EigenLayer.
    /// @param _delegationApprover Address to verify staker delegation signatures and control forced undelegations.
    constructor(
        address _strategyManager,
        address _eigenPodManager,
        address _delegationManager,
        address _slasher,
        address _delegationApprover
    ) initializer {
        strategyManager = IStrategyManager(_strategyManager);
        eigenPodManager = IEigenPodManager(_eigenPodManager);
        delegationManager = IDelegationManager(_delegationManager);
        slasher = ISlasher(_slasher);

        delegationApprover = _delegationApprover;
    }

    /// @notice Initializes the contract by registering the operator with EigenLayer.
    /// @param _assetManager The LRT asset manager.
    /// @param initialEarningsReceiver The initial reward address of the operator.
    /// @param initialMetadataURI The initial metadata URI.
    function initialize(address _assetManager, address initialEarningsReceiver, string calldata initialMetadataURI) external initializer {
        operatorRegistry = msg.sender;
        assetManager = _assetManager;
        
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

    /// @notice Gives the `contractAddress` permission to slash this operator.
    /// @param contractAddress The address of the contract to give permission to.
    function optIntoSlashing(address contractAddress) external onlyOperatorRegistry {
        slasher.optIntoSlashing(contractAddress);
    }

    /// @notice Approve EigenLayer to spend an ERC20 token, then stake it into an EigenLayer strategy.
    /// @param strategy The strategy to stake the tokens into.
    /// @param token The token to stake.
    /// @param amount The amount of tokens to stake.
    function stakeERC20(IStrategy strategy, IERC20 token, uint256 amount) external onlyAssetManager returns (uint256 shares) {
        if (token.allowance(address(this), address(strategyManager)) < amount) {
            token.forceApprove(address(strategyManager), type(uint256).max);
        }
        shares = strategyManager.depositIntoStrategy(strategy, token, amount);
    }

    /// Stake ETH via the operator's EigenPod, using the provided validator information.
    /// @param pubkeys The validator public keys.
    /// @param signatures The validator signatures.
    /// @param depositDataRoots The deposit data roots.
    function stakeETH(bytes[] calldata pubkeys, bytes[] calldata signatures, bytes32[] calldata depositDataRoots) external payable onlyAssetManager {
        if (msg.value % 32 ether != 0) revert ETH_VALUE_NOT_MULTIPLE_OF_32();

        uint256 validators = msg.value / 32 ether;
        for (uint256 i = 0; i < validators;) {
            eigenPodManager.stake{value: msg.value}(pubkeys[i], signatures[i], depositDataRoots[i]);

            unchecked {
                ++i;
            }
        }
    }

    /// @notice Queue a withdrawal of the given amount of `shares` to the `withdrawer` from the provided `strategy`.
    /// @param strategy The strategy to withdraw from.
    /// @param shares The amount of shares to withdraw.
    /// @param withdrawer The address who has permission to complete the withdrawal.
    function queueWithdrawal(IStrategy strategy, uint256 shares, address withdrawer) external onlyAssetManager returns (bytes32 root) {
        uint256 strategyIndex = _getStrategyIndex(strategy);
        root = strategyManager.queueWithdrawal(
            strategyIndex.toArray(),
            strategy.toArray(),
            shares.toArray(),
            withdrawer,
            false
        );
    }

    /// @dev Return the strategy index for the given strategy instance.
    /// @param strategy The strategy instance.
    function _getStrategyIndex(IStrategy strategy) internal view returns (uint256) {
        uint256 strategyCount = strategyManager.stakerStrategyListLength(address(this));
        for (uint256 i = 0; i < strategyCount; ) {
            if (strategyManager.stakerStrategyList(address(this), i) == strategy) {
                return i;
            }
            unchecked {
                ++i;
            }
        }
        revert INVALID_STRATEGY();
    }
}
