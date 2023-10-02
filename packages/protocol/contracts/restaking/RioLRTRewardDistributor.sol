// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {UUPSUpgradeable} from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {IPaymentCoordinator} from 'contracts/interfaces/eigenlayer/IPaymentCoordinator.sol';
import {IRioLRTRewardDistributor} from 'contracts/interfaces/IRioLRTRewardDistributor.sol';
import {IBurnableBPT} from 'contracts/interfaces/balancer/IBurnableBPT.sol';
import {IMilkman} from 'contracts/interfaces/exchange/IMilkman.sol';

contract RioLRTRewardDistributor is IRioLRTRewardDistributor, OwnableUpgradeable, UUPSUpgradeable {
    using SafeERC20 for IERC20;
    
    /// @notice The maximum basis points value (100%).
    uint16 public constant MAX_BPS = 10_000;

    /// @notice The contract used to coordinate payments from AVSs to operators.
    IPaymentCoordinator public immutable paymentCoordinator;

    /// @notice The contract used to exchange reward tokens for LRT.
    IMilkman public immutable milkman;

    /// @notice The treasury share of the rewards in basis points.
    uint16 public treasuryShareBPS;

    /// @notice The operator share of the rewards in basis points.
    uint16 public operatorShareBPS;

    /// @notice The treasury address.
    address public treasury;

    /// @notice The operator reward pool address.
    address public operator;

    /// @notice The Balancer pool token (LRT).
    address public bpt;

    /// @notice The required delay between swap requests and cancellations.
    uint40 public swapCancellationDelay;

    /// @notice Token exchange configurations.
    mapping(address token => TokenExchangeConfig config) public configs;

    /// @notice Swap order information for specific order contracts.
    mapping(address orderContract => SwapOrder order) public orders;

    /// @param _paymentCoordinator The contract used to coordinate payments from AVSs to operators.
    /// @param _milkman The contract used to exchange reward tokens for LRT.
    constructor(address _paymentCoordinator, address _milkman) {
        paymentCoordinator = IPaymentCoordinator(_paymentCoordinator);
        milkman = IMilkman(_milkman);
    }

    /// @notice Initializes the contract.
    /// @param initialOwner The initial owner of the contract.
    /// @param _bpt The BPT (LRT) token address.
    /// @param _treasury The treasury address.
    /// @param _operator The operator reward pool address.
    function initialize(address initialOwner, address _bpt, address _treasury, address _operator) external initializer {
        __UUPSUpgradeable_init();
        _transferOwnership(initialOwner);

        _setTreasuryShareBPS(500); // 5%
        _setOperatorShareBPS(500); // 5%

        _setSwapCancellationDelay(24 hours);

        bpt = _bpt;
        treasury = _treasury;
        operator = _operator;
    }

    /// @notice Claim EigenLayer earnings that have been paid to this contract.
    /// @param proofs The proofs for the Merkle trees.
    /// @param rootIndexes The indexes of the Merkle trees.
    /// @param leaves The leaves of the Merkle trees.
    /// @param leafIndexes The indexes of the leaves.
    function proveAndClaimManyEarnings(
        bytes[] calldata proofs,
        uint256[] calldata rootIndexes,
        IPaymentCoordinator.MerkleLeaf[] calldata leaves,
        uint256[] calldata leafIndexes
    ) external {
        for (uint256 i = 0; i < proofs.length; ) {
            paymentCoordinator.proveAndClaimEarnings(
                proofs[i], rootIndexes[i], leaves[i], leafIndexes[i]
            );
            unchecked {
                ++i;
            }
        }
    }

    /// @notice Distribute rewards by sending BPT to the treasury and operator pool
    /// and burning the remaining BPT.
    function distributeRewards() external {
        IBurnableBPT _bpt = IBurnableBPT(bpt);

        uint256 balance = _bpt.balanceOf(address(this));
        if (balance == 0) revert NO_REWARDS_TO_DISTRIBUTE();

        uint256 treasuryShare = balance * treasuryShareBPS / MAX_BPS;
        uint256 operatorShare = balance * operatorShareBPS / MAX_BPS;
        uint256 poolShare = balance - treasuryShare - operatorShare;
        
        if (treasuryShare > 0) _bpt.transfer(treasury, treasuryShare);
        if (operatorShare > 0) _bpt.transfer(operator, operatorShare);
        if (poolShare > 0) _bpt.burn(poolShare);

        emit RewardsDistributed(treasuryShare, operatorShare);
    }

    /// @notice Requests a swap from `fromToken` to the liquid restaking token.
    /// @param fromToken The token to swap from.
    function requestSwapForLRT(address fromToken) external returns (address orderContract) {
        address _bpt = bpt;

        TokenExchangeConfig memory config = configs[fromToken];
        uint256 amountIn = IERC20(fromToken).balanceOf(address(this));

        if (fromToken == _bpt) revert INVALID_TOKEN();
        if (config.priceChecker == address(0)) revert NO_PRICE_CHECKER_FOR_TOKEN();
        if (amountIn < config.minAmountIn) revert AMOUNT_IN_TOO_LOW();

        if (IERC20(fromToken).allowance(address(this), address(milkman)) < amountIn) {
            IERC20(fromToken).safeApprove(address(milkman), type(uint256).max);
        }

        orderContract = milkman.requestSwapExactTokensForTokens(
            amountIn,
            fromToken,
            _bpt,
            address(this),
            config.priceChecker,
            config.priceCheckerData
        );
        orders[orderContract] = SwapOrder({
            fromToken: fromToken,
            timestamp: uint40(block.timestamp)
        });

        emit SwapRequested(orderContract, fromToken, amountIn);
    }

    /// @notice Cancel a requested swap, sending the tokens back to this contract. This function can only
    /// be called if the swap is still pending after the cancellation delay.
    /// @param orderContract The contract tha
    /// @param amountIn The amount in of the swap to cancel.
    /// @param fromToken The sell token of the swap to cancel.
    /// @param priceChecker A contract that verifies an order (mainly its minOut and fee) before Milkman signs it.
    /// @param priceCheckerData Data that gets passed to the price checker.
    function cancelSwap(
        address orderContract,
        uint256 amountIn,
        address fromToken,
        address priceChecker,
        bytes calldata priceCheckerData
    ) external {
        if (block.timestamp - orders[orderContract].timestamp < swapCancellationDelay) revert TOO_SOON_TO_CANCEL();

        IMilkman(orderContract).cancelSwap(
            amountIn,
            fromToken,
            bpt,
            address(this),
            priceChecker,
            priceCheckerData
        );

        emit SwapCancelled(orderContract, fromToken, amountIn);
    }

    /// @notice Sets the treasury's share of rewards.
    /// @param newTreasuryShareBPS The new treasury share in basis points.
    function setTreasuryShareBPS(uint16 newTreasuryShareBPS) external onlyOwner {
        _setTreasuryShareBPS(newTreasuryShareBPS);
    }

    /// @notice Sets the operator's share of rewards.
    /// @param newOperatorShareBPS The new operator share in basis points.
    function setOperatorShareBPS(uint16 newOperatorShareBPS) external onlyOwner {
        _setOperatorShareBPS(newOperatorShareBPS);
    }

    /// @notice Sets the swap cancellation delay.
    /// @param newSwapCancellationDelay The new swap cancellation delay.
    function setSwapCancellationDelay(uint40 newSwapCancellationDelay) external onlyOwner {
        _setSwapCancellationDelay(newSwapCancellationDelay);
    }

    /// @notice Sets the token exchange configuration for a token.
    /// @param token The token to set the configuration for.
    /// @param newConfig The new configuration.
    function setTokenExchangeConfig(address token, TokenExchangeConfig calldata newConfig) external onlyOwner {
        if (token == address(0)) revert INVALID_TOKEN();
        configs[token] = newConfig;

        emit TokenExchangeConfigSet(token, newConfig);
    }

    /// @notice Sets the treasury's share of rewards.
    /// @param newTreasuryShareBPS The new treasury share in basis points.
    function _setTreasuryShareBPS(uint16 newTreasuryShareBPS) internal {
        if (newTreasuryShareBPS + operatorShareBPS > MAX_BPS) revert TREASURY_SHARE_BPS_TOO_HIGH();

        treasuryShareBPS = newTreasuryShareBPS;
        emit TreasuryShareBPSSet(newTreasuryShareBPS);
    }

    /// @notice Sets the operator's share of rewards.
    /// @param newOperatorShareBPS The new operator share in basis points.
    function _setOperatorShareBPS(uint16 newOperatorShareBPS) internal {
        if (newOperatorShareBPS + treasuryShareBPS > MAX_BPS) revert OPERATOR_SHARE_BPS_TOO_HIGH();

        operatorShareBPS = newOperatorShareBPS;
        emit OperatorShareBPSSet(newOperatorShareBPS);
    }

    /// @dev Sets the swap cancellation delay.
    /// @param newSwapCancellationDelay The new swap cancellation delay.
    function _setSwapCancellationDelay(uint40 newSwapCancellationDelay) internal {
        swapCancellationDelay = newSwapCancellationDelay;

        emit SwapCancellationDelaySet(newSwapCancellationDelay);
    }

    /// @dev Allows the owner to upgrade the reward distributor implementation.
    /// @param newImplementation The implementation to upgrade to.
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
