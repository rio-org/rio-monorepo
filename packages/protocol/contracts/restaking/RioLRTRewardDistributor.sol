// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {UUPSUpgradeable} from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {IRioLRTRewardDistributor} from 'contracts/interfaces/IRioLRTRewardDistributor.sol';
import {IRioLRTGateway} from 'contracts/interfaces/IRioLRTGateway.sol';
import {IMilkman} from 'contracts/interfaces/misc/IMilkman.sol';
import {IWETH} from 'contracts/interfaces/misc/IWETH.sol';

contract RioLRTRewardDistributor is IRioLRTRewardDistributor, OwnableUpgradeable, UUPSUpgradeable {
    using SafeERC20 for IERC20;

    /// @notice The maximum basis points value (100%).
    uint16 public constant MAX_BPS = 10_000;

    /// @notice The contract used to exchange reward tokens for LRT.
    address public immutable milkman;

    /// @notice The wrapped ether token address.
    address public immutable weth;

    /// @dev This empty reserved space is put in place to allow future versions to
    /// add new variables without shifting down storage in the inheritance chain.
    uint64 private __gap;

    /// @notice The treasury share of the ETH validator rewards in basis points.
    uint16 public treasuryETHValidatorRewardShareBPS;

    /// @notice The operator share of the ETH validator rewards in basis points.
    uint16 public operatorETHValidatorRewardShareBPS;

    /// @notice The treasury address.
    address public treasury;

    /// @notice The operator reward pool address.
    address public operator;

    /// @notice The liquid restaking token (LRT).
    address public restakingToken;

    /// @notice The liquid restaking token gateway.
    address public gateway;

    /// @notice The required delay between swap requests and cancellations.
    uint40 public swapCancellationDelay;

    /// @notice Token exchange configurations.
    mapping(address token => TokenExchangeConfig config) public configs;

    /// @notice Swap order information for specific order contracts.
    mapping(address orderContract => SwapOrder order) public orders;

    /// @param milkman_ The contract used to exchange reward tokens for LRT.
    /// @param weth_ The wrapped ether token address.
    constructor(address milkman_, address weth_) {
        _disableInitializers();

        milkman = milkman_;
        weth = weth_;
    }

    // forgefmt: disable-next-item
    /// @notice Initializes the contract.
    /// @param initialOwner The initial owner of the contract.
    /// @param restakingToken_ The liquid restaking token address (LRT).
    /// @param gateway_ The liquid restaking token gateway.
    /// @param treasury_ The treasury address.
    /// @param operator_ The operator reward pool address.
    function initialize(address initialOwner, address restakingToken_, address gateway_, address treasury_, address operator_) external initializer {
        __UUPSUpgradeable_init();
        _transferOwnership(initialOwner);

        _setTreasuryETHValidatorRewardShareBPS(500); // 5%
        _setOperatorETHValidatorRewardShareBPS(500); // 5%

        _setSwapCancellationDelay(24 hours);

        restakingToken = restakingToken_;
        gateway = gateway_;
        treasury = treasury_;
        operator = operator_;
    }

    /// @notice Distribute ETH validator rewards by sending liquid restaking tokens to the
    /// treasury and operator reward pool and burning the remaining.
    function distributeETHValidatorRewards() external {
        IERC20 rewardToken = IERC20(restakingToken);

        uint256 balance = rewardToken.balanceOf(address(this));
        if (balance == 0) revert NO_REWARDS_TO_DISTRIBUTE();

        uint256 treasuryShare = balance * treasuryETHValidatorRewardShareBPS / MAX_BPS;
        uint256 operatorShare = balance * operatorETHValidatorRewardShareBPS / MAX_BPS;
        uint256 poolShare = balance - treasuryShare - operatorShare;

        if (treasuryShare > 0) rewardToken.transfer(treasury, treasuryShare);
        if (operatorShare > 0) rewardToken.transfer(operator, operatorShare);
        if (poolShare > 0) IRioLRTGateway(gateway).burnLRT(poolShare);

        emit ETHValidatorRewardsDistributed(treasuryShare, operatorShare, poolShare);
    }

    /// @notice Requests a swap from ETH to the liquid restaking token.
    /// @dev ETH is first wrapped to WETH.
    function requestSwapExactETHForLRT() external returns (address orderContract) {
        // Wrap ETH in this contract in preparation of the swap, if needed.
        uint256 ethBalance = address(this).balance;
        if (ethBalance > 0) {
            IWETH(weth).deposit{value: ethBalance}();
        }

        TokenExchangeConfig memory config = configs[weth];
        uint256 amountIn = IERC20(weth).balanceOf(address(this));

        if (config.priceChecker == address(0)) revert NO_PRICE_CHECKER_FOR_TOKEN();
        if (amountIn < config.minAmountIn) revert AMOUNT_IN_TOO_LOW();

        if (IERC20(weth).allowance(address(this), milkman) < amountIn) {
            IERC20(weth).safeApprove(milkman, type(uint256).max);
        }

        orderContract = IMilkman(milkman).requestSwapExactTokensForTokens(
            amountIn, weth, restakingToken, address(this), config.priceChecker, config.priceCheckerData
        );
        orders[orderContract] = SwapOrder({fromToken: weth, timestamp: uint40(block.timestamp)});

        emit SwapRequested(orderContract, weth, amountIn);
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
            amountIn, fromToken, restakingToken, address(this), priceChecker, priceCheckerData
        );
        emit SwapCancelled(orderContract, fromToken, amountIn);
    }

    /// @notice Sets the treasury's share of ETH validator rewards.
    /// @param newTreasuryETHValidatorRewardShareBPS The new treasury share in basis points.
    function setTreasuryETHValidatorRewardShareBPS(uint16 newTreasuryETHValidatorRewardShareBPS) external onlyOwner {
        _setTreasuryETHValidatorRewardShareBPS(newTreasuryETHValidatorRewardShareBPS);
    }

    /// @notice Sets the operator's share of ETH validator rewards.
    /// @param newOperatorETHValidatorRewardShareBPS The new operator share in basis points.
    function setOperatorETHValidatorRewardShareBPS(uint16 newOperatorETHValidatorRewardShareBPS) external onlyOwner {
        _setOperatorETHValidatorRewardShareBPS(newOperatorETHValidatorRewardShareBPS);
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

    /// @notice Sets the treasury's share of Ethereum validator rewards.
    /// @param newTreasuryETHValidatorRewardShareBPS The new treasury share in basis points.
    function _setTreasuryETHValidatorRewardShareBPS(uint16 newTreasuryETHValidatorRewardShareBPS) internal {
        if (newTreasuryETHValidatorRewardShareBPS + operatorETHValidatorRewardShareBPS > MAX_BPS) {
            revert TREASURY_ETH_VALIDATOR_SHARE_BPS_TOO_HIGH();
        }
        treasuryETHValidatorRewardShareBPS = newTreasuryETHValidatorRewardShareBPS;
        emit TreasuryETHValidatorRewardShareBPSSet(newTreasuryETHValidatorRewardShareBPS);
    }

    /// @notice Sets the operator's share of Ethereum validator rewards.
    /// @param newOperatorETHValidatorRewardShareBPS The new operator share in basis points.
    function _setOperatorETHValidatorRewardShareBPS(uint16 newOperatorETHValidatorRewardShareBPS) internal {
        if (newOperatorETHValidatorRewardShareBPS + treasuryETHValidatorRewardShareBPS > MAX_BPS) {
            revert OPERATOR_ETH_VALIDATOR_SHARE_BPS_TOO_HIGH();
        }
        operatorETHValidatorRewardShareBPS = newOperatorETHValidatorRewardShareBPS;
        emit OperatorETHValidatorRewardShareBPSSet(newOperatorETHValidatorRewardShareBPS);
    }

    /// @dev Sets the swap cancellation delay.
    /// @param newSwapCancellationDelay The new swap cancellation delay.
    function _setSwapCancellationDelay(uint40 newSwapCancellationDelay) internal {
        swapCancellationDelay = newSwapCancellationDelay;

        emit SwapCancellationDelaySet(newSwapCancellationDelay);
    }

    /// @notice Receives ETH and logs an event.
    receive() external payable {
        emit EtherReceived(msg.sender, msg.value);
    }

    /// @dev Allows the owner to upgrade the reward distributor implementation.
    /// @param newImplementation The implementation to upgrade to.
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
