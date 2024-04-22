// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {ReentrancyGuardUpgradeable} from '@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol';
import {UUPSUpgradeable} from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {Initializable} from '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import {SafeCast} from '@openzeppelin/contracts/utils/math/SafeCast.sol';
import {IRioLRTOperatorRegistry} from 'contracts/interfaces/IRioLRTOperatorRegistry.sol';
import {IRioRewardSplitter} from 'contracts/interfaces/splits/IRioRewardSplitter.sol';
import {LRTAddressCalculator} from 'contracts/utils/LRTAddressCalculator.sol';
import {ETH_ADDRESS} from 'contracts/utils/Constants.sol';
import {Asset} from 'contracts/utils/Asset.sol';

contract RioRewardSplitter is
    IRioRewardSplitter,
    Initializable,
    OwnableUpgradeable,
    UUPSUpgradeable,
    ReentrancyGuardUpgradeable
{
    using LRTAddressCalculator for address;
    using SafeCast for *;
    using Asset for *;

    /// @notice The LRT issuer that's used to read the operator registry.
    address public immutable issuer;

    /// @notice The liquid restaking token (LRT) address.
    address public token;

    /// @notice The balances available to withdraw per operator per token.
    mapping(uint8 operatorId => mapping(address tokenAddress => uint256 balance)) private balancesPerOperator;

    /// @notice The total amount of tokens this contract owns that have been "distributed" per address.
    /// @dev This is used to offset the total balance when distributing more tokens into buckets.
    mapping(address tokenAddress => uint256 balance) private distributedPerToken;

    /// @param issuer_ The LRT issuer that's used to read the operator registry.
    constructor(address issuer_) {
        _disableInitializers();
        issuer = issuer_;
    }

    /// @notice Initializes the contract.
    /// @param initialOwner The initial owner of the contract.
    /// @param token_ The address of the liquid restaking token.
    function initialize(address initialOwner, address token_) external initializer {
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
        __ReentrancyGuard_init();
        token = token_;
    }

    /// @notice Checks if the contract has a balance to distribute.
    /// @param tokenAddress The address of the token.
    modifier checkHasUndistributedBalance(address tokenAddress) {
        if (_getUndistributedBalance(tokenAddress) < 1) revert NO_UNDISTRIBUTED_BALANCE(tokenAddress);
        _;
    }

    /// @notice Checks if there are active operators.
    modifier checkHasActiveOperators() {
        if (operatorRegistry().activeOperatorCount() < 1) revert NO_ACTIVE_OPERATORS();
        _;
    }

    /// @notice Checks if the operator has a balance to withdraw.
    /// @param operatorId The ID of the operator.
    /// @param tokenAddress The address of the token.
    modifier checkOperatorHasTokenBalance(uint8 operatorId, address tokenAddress) {
        if (_getOperatorBalance(operatorId, tokenAddress) < 1) revert OPERATOR_HAS_NO_TOKENS(operatorId, tokenAddress);
        _;
    }

    /// @notice Distributes the currently held undistributed ETH to the operators' withdrawal buckets.
    function distributeETH() external nonReentrant {
        _distribute(ETH_ADDRESS);
    }

    /// @notice Distributes the currently held undistributed ERC20 to the operators' withdrawal buckets.
    /// @param tokenAddress The address of the token.
    function distributeERC20(address tokenAddress) external nonReentrant {
        _distribute(tokenAddress);
    }

    /// @notice Withdraws the operator's ETH balance from their bucket.
    /// @param operatorId The ID of the operator.
    function withdrawETH(uint8 operatorId) external nonReentrant {
        _withdraw(operatorId, ETH_ADDRESS);
    }

    /// @notice Withdraws the operator's ERC20 balance from their bucket.
    /// @param operatorId The ID of the operator.
    /// @param tokenAddress The address of the token.
    function withdrawERC20(uint8 operatorId, address tokenAddress) external nonReentrant {
        _withdraw(operatorId, tokenAddress);
    }

    /// @notice Distributes the currently held undistributed ETH to the operators' withdrawal buckets and then withdraws it.
    /// @param operatorId The ID of the operator.
    function distributeAndWithdrawETH(uint8 operatorId) external nonReentrant {
        _distribute(ETH_ADDRESS);
        _withdraw(operatorId, ETH_ADDRESS);
    }

    /// @notice Distributes the currently held undistributed ERC20 to the operators' withdrawal buckets and then withdraws it.
    /// @param operatorId The ID of the operator.
    /// @param tokenAddress The address of the token.
    function distributeAndWithdrawERC20(uint8 operatorId, address tokenAddress) external nonReentrant {
        _distribute(tokenAddress);
        _withdraw(operatorId, tokenAddress);
    }

    /// @notice Returns the total undistributed ETH balance.
    function getUndistributedETHBalance() external view returns (uint256) {
        return _getUndistributedBalance(ETH_ADDRESS);
    }

    /// @notice Returns the total of an ERC20's undistributed balance.
    /// @param tokenAddress The address of the token.
    function getUndistributedERC20Balance(address tokenAddress) external view returns (uint256) {
        return _getUndistributedBalance(tokenAddress);
    }

    /// @notice Returns the operator's share of the undistributed ETH balance.
    /// @param operatorId The ID of the operator.
    function getOperatorsUndistributedETHShare(uint8 operatorId) external view returns (uint256) {
        return _getOperatorsUndistributedShare(operatorId, ETH_ADDRESS);
    }

    /// @notice Returns the operator's share of an ERC20's undistributed balance.
    /// @param operatorId The ID of the operator.
    /// @param tokenAddress The address of the token.
    function getOperatorsUndistributedERC20Share(uint8 operatorId, address tokenAddress)
        external
        view
        returns (uint256)
    {
        return _getOperatorsUndistributedShare(operatorId, tokenAddress);
    }

    /// @notice Returns the ETH amount that the operator has available to withdraw.
    /// @param operatorId The ID of the operator.
    function getOperatorETHBalance(uint8 operatorId) external view returns (uint256) {
        return _getOperatorBalance(operatorId, ETH_ADDRESS);
    }

    /// @notice Returns the ERC20 amount that the operator has available to withdraw.
    /// @param operatorId The ID of the operator.
    /// @param tokenAddress The address of the ERC20 token.
    function getOperatorERC20Balance(uint8 operatorId, address tokenAddress) external view returns (uint256) {
        return _getOperatorBalance(operatorId, tokenAddress);
    }

    /// @notice Divides the undistributed balance of a token among the active operators and stores it in their withdrawal buckets.
    /// @param tokenAddress The address of the token to distribute.
    function _distribute(address tokenAddress)
        internal
        checkHasActiveOperators
        checkHasUndistributedBalance(tokenAddress)
    {
        // cache
        IRioLRTOperatorRegistry operatorRegistry_ = operatorRegistry();
        // The number of active operators that haven't been distributed to yet
        uint8 operators = operatorRegistry_.activeOperatorCount();
        // The amount of the token that hasn't been distributed yet
        uint256 distribution = _getUndistributedBalance(tokenAddress);

        // Loop through all active operators and distribute the token into their withdrawal buckets
        uint8 endAtID = operatorRegistry_.operatorCount();
        for (uint8 id = 1; id <= endAtID; ++id) {
            // If there's no more token to distribute or no more operators to distribute to, break
            if (distribution < 1 || operators < 1) break;
            // Skip inactive operators
            if (!operatorRegistry_.getOperatorDetails(id).active) continue;
            // Distribute the token to the operator and decrement the remaining distribution and operators
            (distribution, operators) = _distributeToOperator(id, tokenAddress, distribution, operators);
        }
    }

    /// @notice Distributes the undistributed balance of a token to an operator and stores it in their withdrawal bucket.
    /// @param operatorId The ID of the operator to distribute to.
    /// @param tokenAddress The address of the token to distribute.
    /// @param distribution The amount of the token left to distribute.
    /// @param operators The number of operators left to distribute to.
    function _distributeToOperator(uint8 operatorId, address tokenAddress, uint256 distribution, uint8 operators)
        internal
        returns (uint256, uint8)
    {
        // The amount of the token that the operator will receive
        uint256 amount = distribution / operators;
        // Store the amount in the operator's withdrawal bucket + total distribution left
        distributedPerToken[tokenAddress] += amount;
        balancesPerOperator[operatorId][tokenAddress] += amount;
        // Return the remaining distribution and operators
        return (distribution - amount, operators - 1);
    }

    /// @notice Withdraws the operator's balance from their withdrawal bucket.
    /// @param operatorId The ID of the operator.
    /// @param tokenAddress The address of the token to withdraw.
    function _withdraw(uint8 operatorId, address tokenAddress)
        internal
        checkOperatorHasTokenBalance(operatorId, tokenAddress)
    {
        // The amount of the token that the operator will receive
        uint256 amount = balancesPerOperator[operatorId][tokenAddress];
        // Reset the operator's withdrawal bucket and decrement the total distributed balance
        distributedPerToken[tokenAddress] -= amount;
        balancesPerOperator[operatorId][tokenAddress] = 0;
        // Transfer the token to the operator's earnings receiver
        tokenAddress.transferTo(_getEarningsReceiver(operatorId), amount);
    }

    /// @notice Returns the operator's earnings receiver address.
    /// @param operatorId The ID of the operator.
    function _getEarningsReceiver(uint8 operatorId) internal view returns (address) {
        return operatorRegistry().getOperatorDetails(operatorId).earningsReceiver;
    }

    /// @notice Returns the undistributed balance of a token.
    /// @param tokenAddress The address of the token.
    function _getUndistributedBalance(address tokenAddress) internal view returns (uint256) {
        return tokenAddress.getSelfBalance() - _getDistributedBalance(tokenAddress);
    }

    /// @notice Returns the operator's share of the undistributed balance of a token.
    /// @param operatorId The ID of the operator.
    /// @param tokenAddress The address of the token.
    function _getOperatorsUndistributedShare(uint8 operatorId, address tokenAddress) internal view returns (uint256) {
        // cache
        IRioLRTOperatorRegistry operatorRegistry_ = operatorRegistry();
        // If the operator isn't active, they have no share
        if (!operatorRegistry_.getOperatorDetails(operatorId).active) return 0;
        // Return the operator's share of the undistributed balance
        return _getUndistributedBalance(tokenAddress) / operatorRegistry_.activeOperatorCount();
    }

    /// @notice Returns the operator's balance of a token.
    /// @param operatorId The ID of the operator.
    /// @param tokenAddress The address of the token.
    function _getOperatorBalance(uint8 operatorId, address tokenAddress) internal view returns (uint256) {
        return balancesPerOperator[operatorId][tokenAddress];
    }

    /// @notice Returns the amount of a token that has been "distributed".
    /// @param tokenAddress The address of the token.
    function _getDistributedBalance(address tokenAddress) internal view returns (uint256) {
        return distributedPerToken[tokenAddress];
    }

    /// @notice The LRT operator registry contract.
    function operatorRegistry() internal view returns (IRioLRTOperatorRegistry) {
        return IRioLRTOperatorRegistry(issuer.getOperatorRegistry(token));
    }

    /// @dev Allows the owner to upgrade the operator split manager implementation.
    /// @param newImplementation The implementation to upgrade to.
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    receive() external payable {}
}
