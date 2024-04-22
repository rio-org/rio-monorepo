// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {UUPSUpgradeable} from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {IRioLRTRewardDistributor} from 'contracts/interfaces/IRioLRTRewardDistributor.sol';
import {RioLRTCore} from 'contracts/restaking/base/RioLRTCore.sol';
import {Asset} from 'contracts/utils/Asset.sol';

contract RioLRTRewardDistributor is IRioLRTRewardDistributor, OwnableUpgradeable, UUPSUpgradeable, RioLRTCore {
    using Asset for address;

    /// @notice The maximum basis points value (100%).
    uint16 public constant MAX_BPS = 10_000;

    /// @notice The treasury address.
    address public treasury;

    /// @notice The operator reward pool address.
    address public operatorRewardPool;

    /// @notice The treasury share of the ETH validator rewards in basis points.
    uint16 public treasuryETHValidatorRewardShareBPS;

    /// @notice The operator share of the ETH validator rewards in basis points.
    uint16 public operatorETHValidatorRewardShareBPS;

    /// @param issuer_ The LRT issuer that's authorized to deploy this contract.
    constructor(address issuer_) RioLRTCore(issuer_) {}

    // forgefmt: disable-next-item
    /// @notice Initializes the contract.
    /// @param initialOwner The initial owner of the contract.
    /// @param token_ The address of the liquid restaking token.
    /// @param treasury_ The treasury address.
    /// @param operatorRewardPool_ The operator reward pool address.
    function initialize(address initialOwner, address token_, address treasury_, address operatorRewardPool_) external initializer {
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
        __RioLRTCore_init(token_);

        treasury = treasury_;
        operatorRewardPool = operatorRewardPool_;

        _setTreasuryETHValidatorRewardShareBPS(500); // 5%
        _setOperatorETHValidatorRewardShareBPS(500); // 5%
    }

    /// @notice Distributes ETH validator rewards held in this contract to the treasury, operator pool,
    /// and deposit pool.
    /// @dev All recipients are trusted internal contracts that require no reentrancy protection.
    function distributeETHValidatorRewards() external {
        uint256 amount = address(this).balance;
        if (amount == 0) revert NO_ETH_VALIDATOR_REWARDS_TO_DISTRIBUTE();

        uint256 treasuryShare = amount * treasuryETHValidatorRewardShareBPS / MAX_BPS;
        uint256 operatorShare = amount * operatorETHValidatorRewardShareBPS / MAX_BPS;
        uint256 poolShare = amount - treasuryShare - operatorShare;

        if (treasuryShare > 0) treasury.transferETH(treasuryShare);
        if (operatorShare > 0) operatorRewardPool.transferETH(operatorShare);
        if (poolShare > 0) address(depositPool()).transferETH(poolShare);

        emit ETHValidatorRewardsDistributed(treasuryShare, operatorShare, poolShare);
    }

    /// @notice Sets the treasury and operator's share of ETH validator rewards.
    /// @param newTreasuryETHValidatorRewardShareBPS The new treasury share in basis points.
    /// @param newOperatorETHValidatorRewardShareBPS The new operator share in basis points.
    function setTreasuryAndOperatorETHValidatorRewardShareBPS(
        uint16 newTreasuryETHValidatorRewardShareBPS,
        uint16 newOperatorETHValidatorRewardShareBPS
    ) external onlyOwner {
        if (newTreasuryETHValidatorRewardShareBPS + newOperatorETHValidatorRewardShareBPS > MAX_BPS) {
            revert ETH_VALIDATOR_SHARE_BPS_TOO_HIGH();
        }
        _setTreasuryETHValidatorRewardShareBPS(newTreasuryETHValidatorRewardShareBPS);
        _setOperatorETHValidatorRewardShareBPS(newOperatorETHValidatorRewardShareBPS);
    }

    /// @notice Sets the treasury's share of ETH validator rewards.
    /// @param newTreasuryETHValidatorRewardShareBPS The new treasury share in basis points.
    function setTreasuryETHValidatorRewardShareBPS(uint16 newTreasuryETHValidatorRewardShareBPS) external onlyOwner {
        if (newTreasuryETHValidatorRewardShareBPS + operatorETHValidatorRewardShareBPS > MAX_BPS) {
            revert TREASURY_ETH_VALIDATOR_SHARE_BPS_TOO_HIGH();
        }
        _setTreasuryETHValidatorRewardShareBPS(newTreasuryETHValidatorRewardShareBPS);
    }

    /// @notice Sets the operator's share of ETH validator rewards.
    /// @param newOperatorETHValidatorRewardShareBPS The new operator share in basis points.
    function setOperatorETHValidatorRewardShareBPS(uint16 newOperatorETHValidatorRewardShareBPS) external onlyOwner {
        if (newOperatorETHValidatorRewardShareBPS + treasuryETHValidatorRewardShareBPS > MAX_BPS) {
            revert OPERATOR_ETH_VALIDATOR_SHARE_BPS_TOO_HIGH();
        }
        _setOperatorETHValidatorRewardShareBPS(newOperatorETHValidatorRewardShareBPS);
    }

    /// @notice Sets the treasury's share of Ethereum validator rewards.
    /// @param newTreasuryETHValidatorRewardShareBPS The new treasury share in basis points.
    function _setTreasuryETHValidatorRewardShareBPS(uint16 newTreasuryETHValidatorRewardShareBPS) internal {
        treasuryETHValidatorRewardShareBPS = newTreasuryETHValidatorRewardShareBPS;
        emit TreasuryETHValidatorRewardShareBPSSet(newTreasuryETHValidatorRewardShareBPS);
    }

    /// @notice Sets the operator's share of Ethereum validator rewards.
    /// @param newOperatorETHValidatorRewardShareBPS The new operator share in basis points.
    function _setOperatorETHValidatorRewardShareBPS(uint16 newOperatorETHValidatorRewardShareBPS) internal {
        operatorETHValidatorRewardShareBPS = newOperatorETHValidatorRewardShareBPS;
        emit OperatorETHValidatorRewardShareBPSSet(newOperatorETHValidatorRewardShareBPS);
    }

    /// @notice Receives ETH for distribution.
    receive() external payable {}

    /// @dev Allows the owner to upgrade the reward distributor implementation.
    /// @param newImplementation The implementation to upgrade to.
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
