// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {CREATE3} from '@solady/utils/CREATE3.sol';
import {ContractType} from 'contracts/utils/Constants.sol';

/// @title LRT supporting contract address calculator.
library LRTAddressCalculator {
    /// @notice Calculates the address of the LRT coordinator.
    /// @param issuer The address of the LRT issuer.
    /// @param token The LRT contract address.
    function getCoordinator(address issuer, address token) internal pure returns (address) {
        return getContractAddress(issuer, token, ContractType.Coordinator);
    }

    /// @notice Calculates the address of the LRT asset registry.
    /// @param issuer The address of the LRT issuer.
    /// @param token The LRT contract address.
    function getAssetRegistry(address issuer, address token) internal pure returns (address) {
        return getContractAddress(issuer, token, ContractType.AssetRegistry);
    }

    /// @notice Calculates the address of the LRT operator registry.
    /// @param issuer The address of the LRT issuer.
    /// @param token The LRT contract address.
    function getOperatorRegistry(address issuer, address token) internal pure returns (address) {
        return getContractAddress(issuer, token, ContractType.OperatorRegistry);
    }

    /// @notice Calculates the address of the LRT AVS registry.
    /// @param issuer The address of the LRT issuer.
    /// @param token The LRT contract address.
    function getAVSRegistry(address issuer, address token) internal pure returns (address) {
        return getContractAddress(issuer, token, ContractType.AVSRegistry);
    }

    /// @notice Calculates the address of the LRT deposit pool.
    /// @param issuer The address of the LRT issuer.
    /// @param token The LRT contract address.
    function getDepositPool(address issuer, address token) internal pure returns (address) {
        return getContractAddress(issuer, token, ContractType.DepositPool);
    }

    /// @notice Calculates the address of the LRT withdrawal queue.
    /// @param issuer The address of the LRT issuer.
    /// @param token The LRT contract address.
    function getWithdrawalQueue(address issuer, address token) internal pure returns (address) {
        return getContractAddress(issuer, token, ContractType.WithdrawalQueue);
    }

    /// @notice Calculates the address of the LRT reward distributor.
    /// @param issuer The address of the LRT issuer.
    /// @param token The LRT contract address.
    function getRewardDistributor(address issuer, address token) internal pure returns (address) {
        return getContractAddress(issuer, token, ContractType.RewardDistributor);
    }

    /// @notice Calculates the address of an operator delegator.
    /// @param operatorRegistry The operator registry address.
    /// @param operatorId The operator's ID.
    function getOperatorDelegatorAddress(address operatorRegistry, uint8 operatorId) internal pure returns (address) {
        return CREATE3.getDeployed(computeOperatorSalt(operatorId), operatorRegistry);
    }

    // forgefmt: disable-next-item
    /// @notice Calculates the address of a deployed contract using CREATE3,
    /// based on a computed salt (token & contract type), and the deployer's address.
    /// @param issuer The LRT issuer contract address.
    /// @param token The LRT contract address.
    /// @param contractType The type of supporting contract.
    function getContractAddress(address issuer, address token, ContractType contractType) internal pure returns (address) {
        return CREATE3.getDeployed(computeSalt(token, contractType), issuer);
    }

    /// @notice Computes the salt for a supporting contract using the token
    /// address and contract type.
    /// @param token The token address.
    /// @param contractType The contract type.
    function computeSalt(address token, ContractType contractType) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(token)) << 96 | uint8(contractType));
    }

    /// @notice Computes the salt for an operator delegator, which is the
    /// operator ID converted to `bytes32`.
    /// @param operatorId The operator's ID.
    function computeOperatorSalt(uint8 operatorId) internal pure returns (bytes32) {
        return bytes32(uint256(operatorId));
    }
}
