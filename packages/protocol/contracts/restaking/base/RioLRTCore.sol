// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {Initializable} from '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import {IRioLRTRewardDistributor} from 'contracts/interfaces/IRioLRTRewardDistributor.sol';
import {IRioLRTOperatorDelegator} from 'contracts/interfaces/IRioLRTOperatorDelegator.sol';
import {IRioLRTOperatorRegistry} from 'contracts/interfaces/IRioLRTOperatorRegistry.sol';
import {IRioLRTWithdrawalQueue} from 'contracts/interfaces/IRioLRTWithdrawalQueue.sol';
import {IRioLRTAssetRegistry} from 'contracts/interfaces/IRioLRTAssetRegistry.sol';
import {IRioLRTAVSRegistry} from 'contracts/interfaces/IRioLRTAVSRegistry.sol';
import {IRioLRTDepositPool} from 'contracts/interfaces/IRioLRTDepositPool.sol';
import {IRioLRTCoordinator} from 'contracts/interfaces/IRioLRTCoordinator.sol';
import {LRTAddressCalculator} from 'contracts/utils/LRTAddressCalculator.sol';
import {IRioLRT} from 'contracts/interfaces/IRioLRT.sol';

/// @title Utilities inherited by all core LRT contracts.
abstract contract RioLRTCore is Initializable {
    using LRTAddressCalculator for address;

    /// @notice Thrown when the initializer is not the LRT issuer.
    error ONLY_ISSUER();

    /// @notice Thrown when the caller is not the LRT coordinator.
    error ONLY_COORDINATOR();

    /// @notice Thrown when the caller is not the LRT deposit pool.
    error ONLY_DEPOSIT_POOL();

    /// @notice Thrown when the caller is not the operator registry.
    error ONLY_OPERATOR_REGISTRY();

    /// @notice The LRT issuer that's authorized to deploy this contract.
    address public immutable issuer;

    /// @notice The liquid restaking token (LRT) address.
    IRioLRT public token;

    /// @notice Require that the caller is the coordinator.
    modifier onlyCoordinator() {
        if (msg.sender != address(coordinator())) revert ONLY_COORDINATOR();
        _;
    }

    /// @notice Require that the caller is the deposit pool.
    modifier onlyDepositPool() {
        if (msg.sender != address(depositPool())) revert ONLY_DEPOSIT_POOL();
        _;
    }

    /// @notice Require that the caller is the LRT's operator registry.
    modifier onlyOperatorRegistry() {
        if (msg.sender != address(operatorRegistry())) revert ONLY_OPERATOR_REGISTRY();
        _;
    }

    /// @dev Prevent any future reinitialization.
    /// @param issuer_ The LRT issuer that's authorized to deploy this contract.
    constructor(address issuer_) {
        _disableInitializers();

        issuer = issuer_;
    }

    /// @notice Initializes the restaking contract.
    /// @param token_ The address of the liquid restaking token.
    function __RioLRTCore_init(address token_) internal onlyInitializing {
        if (msg.sender != issuer) revert ONLY_ISSUER();

        token = IRioLRT(token_);
    }

    /// @notice Initializes the restaking contract without verifying the caller.
    /// @param token_ The address of the liquid restaking token.
    function __RioLRTCore_init_noVerify(address token_) internal onlyInitializing {
        token = IRioLRT(token_);
    }

    /// @notice The LRT coordinator contract.
    function coordinator() internal view returns (IRioLRTCoordinator) {
        return IRioLRTCoordinator(issuer.getCoordinator(address(token)));
    }

    /// @notice The LRT asset registry contract.
    function assetRegistry() internal view returns (IRioLRTAssetRegistry) {
        return IRioLRTAssetRegistry(issuer.getAssetRegistry(address(token)));
    }

    /// @notice The LRT operator registry contract.
    function operatorRegistry() internal view returns (IRioLRTOperatorRegistry) {
        return IRioLRTOperatorRegistry(issuer.getOperatorRegistry(address(token)));
    }

    /// @notice The LRT AVS registry contract.
    function avsRegistry() internal view returns (IRioLRTAVSRegistry) {
        return IRioLRTAVSRegistry(issuer.getAVSRegistry(address(token)));
    }

    /// @notice The LRT deposit pool contract.
    function depositPool() internal view returns (IRioLRTDepositPool) {
        return IRioLRTDepositPool(issuer.getDepositPool(address(token)));
    }

    /// @notice The LRT withdrawal queue contract.
    function withdrawalQueue() internal view returns (IRioLRTWithdrawalQueue) {
        return IRioLRTWithdrawalQueue(issuer.getWithdrawalQueue(address(token)));
    }

    /// @notice The LRT reward distributor contract.
    function rewardDistributor() internal view returns (IRioLRTRewardDistributor) {
        return IRioLRTRewardDistributor(issuer.getRewardDistributor(address(token)));
    }

    // forgefmt: disable-next-item
    /// @notice Calculates the address of an operator delegator.
    /// @param registry The operator registry address.
    /// @param operatorId The operator's ID.
    function operatorDelegator(IRioLRTOperatorRegistry registry, uint8 operatorId) internal pure returns (IRioLRTOperatorDelegator) {
        return IRioLRTOperatorDelegator(address(registry).getOperatorDelegatorAddress(operatorId));
    }
}
