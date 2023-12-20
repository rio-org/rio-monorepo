// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {UUPSUpgradeable} from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {IBasePoolAuthentication} from 'contracts/interfaces/balancer/IBasePoolAuthentication.sol';
import {IPoolController} from 'contracts/interfaces/misc/IPoolController.sol';
import {IManagedPool} from 'contracts/interfaces/balancer/IManagedPool.sol';

abstract contract PoolController is IPoolController, OwnableUpgradeable, UUPSUpgradeable {
    /// @notice The minimum acceptable weight for a token in the pool. We need this due to limitations
    /// in the implementation of the power function, as these ratios are often exponents.
    uint256 public constant MIN_WEIGHT = 0.01e18;

    /// @notice The minimum weight change duration.
    uint256 public constant MIN_WEIGHT_CHANGE_DURATION = 3 days;

    /// @notice The maximum swap fee percentage.
    uint256 public constant MAX_SWAP_FEE_PERCENTAGE = 10e16; // 10%

    /// @notice The maximum AUM fee percentage.
    uint256 public constant MAX_AUM_FEE_PERCENTAGE = 10e16; // 10%

    /// @notice The pool that's controlled by this contract.
    IManagedPool public pool;

    /// @notice The DAO-managed council that has permission to temporarily
    /// pause the LRT, enable recovery mode, and set circuit breakers.
    address public securityCouncil;

    /// @notice Require that the caller is the owner of this contract or
    /// the security council.
    modifier onlyOwnerOrSecurityCouncil() {
        if (msg.sender != owner() && msg.sender != securityCouncil) revert ONLY_OWNER_OR_SECURITY_COUNCIL();
        _;
    }

    // forgefmt: disable-next-item
    /// @notice Initializes the pool controller.
    /// @param initialOwner The initial owner of the contract.
    /// @param pool_ The pool that's controlled by this contract.
    /// @param securityCouncil_ The address of the DAO-managed security council.
    /// @param allowedLPs The addresses of the LPs that are allowed to join the pool.
    function _initializePoolController(address initialOwner, address pool_, address securityCouncil_, address[] calldata allowedLPs) internal onlyInitializing {
        if (IBasePoolAuthentication(pool_).getOwner() != address(this)) revert INVALID_INITIALIZATION();
        
        __UUPSUpgradeable_init();
        _transferOwnership(initialOwner);

        pool = IManagedPool(pool_);
        securityCouncil = securityCouncil_;

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

    /// @notice Update weights linearly from the current values to the given end weights,
    /// between the current timestamp and the current timestamp plus `duration`.
    /// @param duration The duration of the weight change.
    /// @param tokens The tokens whose weights will be updated.
    /// @param endWeights The end weights of the tokens.
    function startGradualWeightChange(uint256 duration, address[] calldata tokens, uint256[] calldata endWeights)
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
        address[] calldata tokens,
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
        address[] calldata tokens,
        uint256[] calldata bptPrices,
        uint256[] calldata lowerBoundPercentages,
        uint256[] calldata upperBoundPercentages
    ) external onlyOwnerOrSecurityCouncil {
        pool.setCircuitBreakers(tokens, bptPrices, lowerBoundPercentages, upperBoundPercentages);
    }

    /// @dev Allows the owner to upgrade the implementation.
    /// @param newImplementation The implementation to upgrade to.
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
