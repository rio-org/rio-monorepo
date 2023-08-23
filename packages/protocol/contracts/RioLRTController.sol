// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {Clone} from '@solady/utils/Clone.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {IERC20 as IOpenZeppelinERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {IERC20} from '@balancer-v2/contracts/interfaces/contracts/solidity-utils/openzeppelin/IERC20.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {IVault} from '@balancer-v2/contracts/interfaces/contracts/vault/IVault.sol';
import {IBasePoolAuthentication} from './interfaces/IBasePoolAuthentication.sol';
import {IManagedPoolSettings} from './interfaces/IManagedPoolSettings.sol';
import {IRioLRTAssetManager} from './interfaces/IRioLRTAssetManager.sol';
import {IRioLRTController} from './interfaces/IRioLRTController.sol';

contract RioLRTController is IRioLRTController, Clone, OwnableUpgradeable {
    using SafeERC20 for IOpenZeppelinERC20;

    /// @notice The minimum weight change duration.
    uint256 public constant MIN_WEIGHT_CHANGE_DURATION = 3 days;

    /// @notice The maximum swap fee percentage.
    uint256 public constant MAX_SWAP_FEE_PERCENTAGE = 10e16; // 10%

    /// @notice The maximum AUM fee percentage.
    uint256 public constant MAX_AUM_FEE_PERCENTAGE = 10e16; // 10%

    /// @notice The number one, with 18 decimals.
    uint256 private constant _ONE = 1e18;

    /// @notice The pool (LRT) that's controlled by this contract.
    IManagedPoolSettings public pool;

    /// @notice The DAO-managed council that has permission to temporarily
    /// pause the LRT, enable recovery mode, and set circuit breakers.
    address public securityCouncil;

    /// @notice Require that the caller is the owner of this contract or
    /// the security council.
    modifier onlyOwnerOrSecurityCouncil() {
        if (msg.sender != owner() && msg.sender != securityCouncil) revert ONLY_OWNER_OR_SECURITY_COUNCIL();
        _;
    }

    /// @notice The contract in charge of managing the LRT's assets.
    function assetManager() public pure returns (address) {
        return _getArgAddress(0);
    }

    // forgefmt: disable-next-item
    /// @notice Initializes the controller.
    /// @param initialOwner The initial owner of the contract.
    /// @param _pool The pool (LRT) that's controlled by this contract.
    /// @param _securityCouncil The address of the DAO-managed security council.
    /// @param allowedLPs The addresses of the LPs that are allowed to join the pool.
    function initialize(address initialOwner, address _pool, address _securityCouncil, address[] calldata allowedLPs) external initializer {
        _transferOwnership(initialOwner);

        if (address(pool) != address(0) || IBasePoolAuthentication(_pool).getOwner() != address(this)) {
            revert INVALID_INITIALIZATION();
        }
        pool = IManagedPoolSettings(_pool);
        securityCouncil = _securityCouncil;

        if (allowedLPs.length != 0) {
            pool.setMustAllowlistLPs(true);

            for (uint256 i = 0; i < allowedLPs.length; ++i) {
                pool.addAllowedAddress(allowedLPs[i]);
            }
        }
    }

    /// @notice Sets the security council to a new account (`newSecurityCouncil`).
    /// @param newSecurityCouncil The new security council address.
    function setSecurityCouncil(address newSecurityCouncil) external onlyOwner {
        securityCouncil = newSecurityCouncil;

        emit SecurityCouncilChanged(newSecurityCouncil);
    }

    /// @notice Add an underlying token to the LRT.
    /// @param tokenToAdd The token to add.
    /// @param tokenToAddNormalizedWeight The normalized weight of the token to add.
    /// @param tokenToAddBalance The balance of the token to add.
    function addToken(IERC20 tokenToAdd, uint256 tokenToAddNormalizedWeight, uint256 tokenToAddBalance)
        external
        onlyOwner
    {
        address manager = assetManager();
        uint256 supply = pool.getActualSupply();
        uint256 mintAmount = (supply * tokenToAddNormalizedWeight) / (_ONE - tokenToAddNormalizedWeight);

        IOpenZeppelinERC20(address(tokenToAdd)).safeTransferFrom(msg.sender, manager, tokenToAddBalance);

        pool.addToken(tokenToAdd, manager, tokenToAddNormalizedWeight, mintAmount, owner());
        IRioLRTAssetManager(manager).addToken(tokenToAdd, tokenToAddBalance, pool.getVault(), pool.getPoolId());
    }

    /// @notice Remove an underlying token from the LRT.
    /// @param tokenToRemove The token to remove.
    function removeToken(IERC20 tokenToRemove) external onlyOwner {
        IVault vault = pool.getVault();
        bytes32 poolId = pool.getPoolId();
        uint256 supply = pool.getActualSupply();

        (uint256 tokenToRemoveBalance,,,) = vault.getPoolTokenInfo(poolId, tokenToRemove);

        (IERC20[] memory registeredTokens,,) = vault.getPoolTokens(poolId);
        uint256[] memory registeredTokensWeights = pool.getNormalizedWeights();

        // `registeredTokensWeights` does not contain the BPT, so we need to offset by one.
        uint256 tokenToRemoveNormalizedWeight;
        for (uint256 i = 1; i < registeredTokens.length; ++i) {
            if (registeredTokens[i] != tokenToRemove) {
                continue;
            }

            tokenToRemoveNormalizedWeight = registeredTokensWeights[i - 1];
            break;
        }

        uint256 burnAmount = (supply * tokenToRemoveNormalizedWeight) / _ONE;

        IRioLRTAssetManager(assetManager()).removeToken(tokenToRemove, tokenToRemoveBalance, vault, poolId, owner());
        pool.removeToken(tokenToRemove, burnAmount, owner());
    }

    /// @notice Update weights linearly from the current values to the given end weights,
    /// between the current timestamp and the current timestamp plus `duration`.
    /// @param duration The duration of the weight change.
    /// @param tokens The tokens whose weights will be updated.
    /// @param endWeights The end weights of the tokens.
    function startGradualWeightChange(uint256 duration, IERC20[] calldata tokens, uint256[] calldata endWeights)
        external
    {
        scheduleGradualWeightChange(block.timestamp, block.timestamp + duration, tokens, endWeights);
    }

    /// @notice Update weights linearly from the current values to the given end weights,
    /// between `startTime` and `endTime`. Balancer will revert if `startTime` is more than an hour in the past.
    /// @param startTime The start time of the weight change.
    /// @param endTime The end time of the weight change.
    /// @param tokens The tokens whose weights will be updated.
    /// @param endWeights The end weights of the tokens.
    function scheduleGradualWeightChange(
        uint256 startTime,
        uint256 endTime,
        IERC20[] calldata tokens,
        uint256[] calldata endWeights
    ) public onlyOwner {
        if (endTime < startTime || endTime - startTime < MIN_WEIGHT_CHANGE_DURATION) revert WEIGHT_CHANGE_TOO_FAST();

        pool.updateWeightsGradually(startTime, endTime, tokens, endWeights);
    }

    /// Start a gradual swap fee update. The minimum swap fee (0.0001%) is enforced in the pool. No
    /// minimum duration is needed.
    /// @param duration The duration of the swap fee change.
    /// @param startSwapFeePercentage The starting value for the swap fee change.
    /// @param endSwapFeePercentage The ending value for the swap fee change. If the current timestamp >= endTime,
    /// `pool.getSwapFeePercentage()` will return this value.
    function startGradualSwapFeeChange(uint256 duration, uint256 startSwapFeePercentage, uint256 endSwapFeePercentage)
        external
    {
        scheduleGradualSwapFeeChange(
            block.timestamp, block.timestamp + duration, startSwapFeePercentage, endSwapFeePercentage
        );
    }

    /// Schedule a gradual swap fee update. The minimum swap fee (0.0001%) is enforced in the pool. No
    /// minimum duration is needed. Balancer will revert if `startTime` is more than an hour in the past.
    /// @param startTime The timestamp when the swap fee change will begin.
    /// @param endTime The timestamp when the swap fee change will end (must be >= startTime).
    /// @param startSwapFeePercentage The starting value for the swap fee change.
    /// @param endSwapFeePercentage The ending value for the swap fee change. If the current timestamp >= endTime,
    /// `pool.getSwapFeePercentage()` will return this value.
    function scheduleGradualSwapFeeChange(
        uint256 startTime,
        uint256 endTime,
        uint256 startSwapFeePercentage,
        uint256 endSwapFeePercentage
    ) public onlyOwner {
        if (endTime < startTime) revert INVALID_SWAP_FEE_END_TIME();
        if (startSwapFeePercentage > MAX_SWAP_FEE_PERCENTAGE || endSwapFeePercentage > MAX_SWAP_FEE_PERCENTAGE) {
            revert SWAP_FEE_TOO_HIGH();
        }

        pool.updateSwapFeeGradually(startTime, endTime, startSwapFeePercentage, endSwapFeePercentage);
    }

    /// @notice Enable or disable trading.
    /// @param swapEnabled The new value of the swap enabled flag.
    function setSwapEnabled(bool swapEnabled) external onlyOwner {
        pool.setSwapEnabled(swapEnabled);
    }

    /// @notice Setter for the yearly percentage AUM management fee, which is payable to the pool manager.
    /// @param aumFeePercentage The new management AUM fee percentage.
    function setManagementAumFeePercentage(uint256 aumFeePercentage) external onlyOwner returns (uint256 amount) {
        if (aumFeePercentage > MAX_AUM_FEE_PERCENTAGE) revert AUM_FEE_TOO_HIGH();

        amount = pool.setManagementAumFeePercentage(aumFeePercentage);
    }

    /// @notice Set a circuit breaker for one or more tokens. The lower and upper bounds are percentages,
    /// corresponding to a relative change in the token's spot price: e.g., a lower bound of 0.8 means the
    /// breaker should prevent trades that result in the value of the token dropping 20% or more relative
    /// to the rest of the pool.
    /// @param tokens The tokens to set circuit breakers for.
    /// @param bptPrices The prices of the tokens in BPT.
    /// @param lowerBoundPercentages The lower bound percentages.
    /// @param upperBoundPercentages The upper bound percentages.
    function setCircuitBreakers(
        IERC20[] calldata tokens,
        uint256[] calldata bptPrices,
        uint256[] calldata lowerBoundPercentages,
        uint256[] calldata upperBoundPercentages
    ) external onlyOwnerOrSecurityCouncil {
        pool.setCircuitBreakers(tokens, bptPrices, lowerBoundPercentages, upperBoundPercentages);
    }
}
