// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {IETHPOSDeposit} from 'contracts/interfaces/ethereum/IETHPOSDeposit.sol';

interface IRioLRTCoordinator {
    /// @notice Thrown when attempting an action on an unsupported asset.
    /// @param asset The address of the asset.
    error ASSET_NOT_SUPPORTED(address asset);

    /// @notice Thrown when attempting to deposit an amount of zero.
    error AMOUNT_MUST_BE_GREATER_THAN_ZERO();

    /// @notice Thrown when attempting to deposit an amount that would exceed the deposit cap.
    /// @param asset The address of the asset.
    /// @param depositCap The asset's deposit cap.
    error DEPOSIT_CAP_REACHED(address asset, uint256 depositCap);

    /// @notice Thrown when attempting to request a withdrawal for an amount that would exceed the
    /// total share value available.
    error INSUFFICIENT_SHARES_FOR_WITHDRAWAL();

    /// @notice Thrown when the `msg.sender` is a contract.
    error CALLER_MUST_BE_EOA();

    /// @notice Thrown when the ETH pseudo-address is passed to the ERC20 rebalance function.
    error INVALID_TOKEN_ADDRESS();

    /// @notice Thrown when the guardian signer is invalid.
    error INVALID_GUARDIAN_SIGNATURE();

    /// @notice Thrown when the guardian deposit root is stale.
    error STALE_DEPOSIT_ROOT();

    /// @notice Thrown when attempting rebalance before the rebalance delay has elapsed.
    error REBALANCE_DELAY_NOT_MET();

    /// @notice Thrown when attempting to set the rebalance delay to a value greater than the maximum.
    error REBALANCE_DELAY_TOO_LONG();

    /// @notice Thrown when attempting to rebalance an asset that does not need to be rebalanced.
    error NO_REBALANCE_NEEDED();

    /// @notice Thrown when attempting to pause the coordinator due to forceful undelegation
    /// when no operator has forcefully undelegated.
    error NO_OPERATOR_UNDELEGATED();

    /// @notice Emitted when a user deposits an asset into Rio.
    /// @param user The address of the user.
    /// @param asset The address of the asset.
    /// @param amountIn The amount of the asset deposited.
    /// @param amountOut The amount of restaking tokens minted.
    event Deposited(address indexed user, address indexed asset, uint256 amountIn, uint256 amountOut);

    /// @notice Emitted when both withdrawals and deposits succeed during a rebalance, or
    /// when withdrawals succeed and a deposit was not needed.
    /// @param asset The address of the asset.
    event Rebalanced(address indexed asset);

    /// @notice Emitted when withdrawals succeed, but deposits fail or were unable to be attempted
    /// during an asset rebalance.
    /// @param asset The address of the asset.
    event PartiallyRebalanced(address indexed asset);

    /// @notice Emitted when the rebalance delay is set.
    /// @param newRebalanceDelay The new rebalance delay.
    event RebalanceDelaySet(uint24 newRebalanceDelay);

    /// @notice Emitted when the guardian signer is set.
    /// @param newGuardianSigner The address of the new guardian signer.
    event GuardianSignerSet(address newGuardianSigner);

    /// @dev Initializes the contract.
    /// @param initialOwner The owner of the contract.
    /// @param token The address of the liquid restaking token.
    function initialize(address initialOwner, address token) external;

    /// @notice Returns the EIP-712 typehash for `DepositRoot` message.
    function DEPOSIT_ROOT_TYPEHASH() external view returns (bytes32);

    /// @notice The Ethereum POS deposit contract address.
    function ethPOS() external view returns (IETHPOSDeposit);

    /// @notice Returns the total value of all underlying assets in the unit of account.
    function getTVL() external view returns (uint256);

    /// @notice Converts an amount of restaking tokens to its equivalent value in the unit of account.
    /// The unit of account is the price feed's quote asset.
    /// @param amount The amount of restaking tokens to convert.
    function convertToUnitOfAccountFromRestakingTokens(uint256 amount) external view returns (uint256);

    /// @notice Converts the unit of account value to its equivalent in restaking tokens. The unit of
    /// account is the price feed's quote asset.
    /// @param value The restaking token's value in the unit of account.
    function convertFromUnitOfAccountToRestakingTokens(uint256 value) external view returns (uint256);

    /// @notice Converts an asset amount to its equivalent value in restaking tokens.
    /// @param asset The address of the asset to convert.
    /// @param amount The amount of the asset to convert.
    function convertFromAssetToRestakingTokens(address asset, uint256 amount) external view returns (uint256);

    /// @notice Converts an amount of restaking tokens to the equivalent in the asset.
    /// @param asset The address of the asset to convert to.
    /// @param amount The amount of restaking tokens to convert.
    function convertToAssetFromRestakingTokens(address asset, uint256 amount) external view returns (uint256);

    /// @notice Converts an amount of restaking tokens to the equivalent in the provided
    /// asset's EigenLayer shares.
    /// @param asset The address of the asset whose EigenLayer shares to convert to.
    /// @param amount The amount of restaking tokens to convert.
    function convertToSharesFromRestakingTokens(address asset, uint256 amount) external view returns (uint256);

    /// @notice EIP-712 helper.
    /// @param structHash The hash of the struct.
    function hashTypedData(bytes32 structHash) external view returns (bytes32);

    /// @notice Deposits ERC20 tokens and mints restaking token(s) to the caller.
    /// @param asset The asset being deposited.
    /// @param amountIn The amount of the asset being deposited.
    function depositERC20(address asset, uint256 amountIn) external returns (uint256);

    /// @notice Deposits ETH and mints restaking token(s) to the caller.
    function depositETH() external payable returns (uint256);

    /// @notice Requests a withdrawal to `asset` for `amountIn` restaking tokens.
    /// @param asset The asset being withdrawn.
    /// @param amountIn The amount of restaking tokens requested for withdrawal.
    function requestWithdrawal(address asset, uint256 amountIn) external;

    /// @notice Rebalances ETH by processing outstanding withdrawals and depositing remaining
    /// ETH into EigenLayer.
    /// @param root The deposit merkle root.
    /// @param signature The guardian signature.
    /// @dev This function requires a guardian signature prior to depositing ETH into EigenLayer. If the
    /// guardian doesn't provide a signature within 24 hours, then the rebalance will be allowed without
    /// a signature, but only for withdrawals. In the future, this may be extended to allow a rebalance
    /// without a guardian signature without waiting 24 hours if withdrawals outnumber deposits.
    function rebalanceETH(bytes32 root, bytes calldata signature) external;

    /// @notice Rebalances the provided ERC20 `token` by processing outstanding withdrawals and
    /// depositing remaining tokens into EigenLayer.
    /// @param token The token to rebalance.
    function rebalanceERC20(address token) external;
}
