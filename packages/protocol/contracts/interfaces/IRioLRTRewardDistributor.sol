// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

interface IRioLRTRewardDistributor {
    /// @notice Thrown when there are no ETH validator rewards to distribute.
    error NO_ETH_VALIDATOR_REWARDS_TO_DISTRIBUTE();

    /// @notice Thrown when the ETH validator reward share is too high.
    error ETH_VALIDATOR_SHARE_BPS_TOO_HIGH();

    /// @notice Thrown when the treasury ETH validator reward share is too high.
    error TREASURY_ETH_VALIDATOR_SHARE_BPS_TOO_HIGH();

    /// @notice Thrown when the operator ETH validator reward share is too high.
    error OPERATOR_ETH_VALIDATOR_SHARE_BPS_TOO_HIGH();

    /// @notice Emitted when ETH validator rewards are distributed.
    /// @param treasuryShare The amount of rewards sent to the treasury.
    /// @param operatorShare The amount of rewards sent to the operator.
    /// @param poolShare The amount of rewards burned to realize the pool's gain.
    event ETHValidatorRewardsDistributed(uint256 treasuryShare, uint256 operatorShare, uint256 poolShare);

    /// @notice Emitted when the treasury's share of Ethereum validator rewards is updated.
    /// @param newTreasuryETHValidatorRewardShareBPS The new treasury share in basis points.
    event TreasuryETHValidatorRewardShareBPSSet(uint16 newTreasuryETHValidatorRewardShareBPS);

    /// @notice Emitted when the operator's share of Ethereum validator rewards is updated.
    /// @param newOperatorETHValidatorRewardShareBPS The new operator share.
    event OperatorETHValidatorRewardShareBPSSet(uint16 newOperatorETHValidatorRewardShareBPS);

    /// @notice Initializes the contract.
    /// @param initialOwner The initial owner of the contract.
    /// @param treasury The treasury address.
    /// @param operatorRewardPool The operator reward pool address.
    /// @param depositPool The contract that holds funds awaiting deposit into EigenLayer.
    function initialize(address initialOwner, address treasury, address operatorRewardPool, address depositPool)
        external;
}
