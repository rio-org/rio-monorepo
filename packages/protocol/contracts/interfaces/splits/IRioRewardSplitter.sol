// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

interface IRioRewardSplitter {
    /// @notice Thrown when the initializer is not the LRT issuer.
    error ONLY_ISSUER();

    /// @notice Thrown when there are no undistributed tokens.
    /// @param tokenAddress The address of the token.
    error NO_UNDISTRIBUTED_BALANCE(address tokenAddress);

    /// @notice Thrown when there are no active operators.
    error NO_ACTIVE_OPERATORS();

    /// @notice Thrown when the caller is not the operator's earnings receiver.
    error IS_NOT_OPERATOR_EARNINGS_RECEIVER();

    /// @notice Thrown when the operator has no tokens to withdraw.
    /// @param operatorId The ID of the operator.
    /// @param tokenAddress The address of the token.
    error OPERATOR_HAS_NO_TOKENS(uint8 operatorId, address tokenAddress);

    /// @notice Initializes the contract.
    /// @param initialOwner The initial owner of the contract.
    /// @param token_ The address of the liquid restaking token.
    function initialize(address initialOwner, address token_) external;

    /// @notice Distributes the currently held undistributed ETH to the operators' withdrawal buckets.
    function distributeETH() external;

    /// @notice Distributes the currently held undistributed ERC20 to the operators' withdrawal buckets.
    /// @param tokenAddress The address of the token.
    function distributeERC20(address tokenAddress) external;

    /// @notice Withdraws the operator's ETH balance from their bucket.
    /// @param operatorId The ID of the operator.
    function withdrawETH(uint8 operatorId) external;

    /// @notice Withdraws the operator's ERC20 balance from their bucket.
    /// @param operatorId The ID of the operator.
    /// @param tokenAddress The address of the token.
    function withdrawERC20(uint8 operatorId, address tokenAddress) external;

    /// @notice Distributes the currently held undistributed ETH to the operators' withdrawal buckets and then withdraws it.
    /// @param operatorId The ID of the operator.
    function distributeAndWithdrawETH(uint8 operatorId) external;

    /// @notice Distributes the currently held undistributed ERC20 to the operators' withdrawal buckets and then withdraws it.
    /// @param operatorId The ID of the operator.
    /// @param tokenAddress The address of the token.
    function distributeAndWithdrawERC20(uint8 operatorId, address tokenAddress) external;

    /// @notice Returns the total undistributed ETH balance.
    function getUndistributedETHBalance() external view returns (uint256);

    /// @notice Returns the total of an ERC20's undistributed balance.
    /// @param tokenAddress The address of the token.
    function getUndistributedERC20Balance(address tokenAddress) external view returns (uint256);

    /// @notice Returns the operator's share of the undistributed ETH balance.
    /// @param operatorId The ID of the operator.
    function getOperatorsUndistributedETHShare(uint8 operatorId) external view returns (uint256);

    /// @notice Returns the operator's share of an ERC20's undistributed balance.
    /// @param operatorId The ID of the operator.
    /// @param tokenAddress The address of the token.
    function getOperatorsUndistributedERC20Share(uint8 operatorId, address tokenAddress)
        external
        view
        returns (uint256);

    /// @notice Returns the ETH amount that the operator has available to withdraw.
    /// @param operatorId The ID of the operator.
    function getOperatorETHBalance(uint8 operatorId) external view returns (uint256);

    /// @notice Returns the ERC20 amount that the operator has available to withdraw.
    /// @param operatorId The ID of the operator.
    /// @param tokenAddress The address of the ERC20 token.
    function getOperatorERC20Balance(uint8 operatorId, address tokenAddress) external view returns (uint256);
}
