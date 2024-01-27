// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {ERC1967Proxy} from '@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {UUPSUpgradeable} from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import {IRioLRTRewardDistributor} from 'contracts/interfaces/IRioLRTRewardDistributor.sol';
import {IRioLRTOperatorRegistry} from 'contracts/interfaces/IRioLRTOperatorRegistry.sol';
import {IRioLRTWithdrawalQueue} from 'contracts/interfaces/IRioLRTWithdrawalQueue.sol';
import {IRioLRTAssetRegistry} from 'contracts/interfaces/IRioLRTAssetRegistry.sol';
import {IRioLRTCoordinator} from 'contracts/interfaces/IRioLRTCoordinator.sol';
import {IRioLRTAVSRegistry} from 'contracts/interfaces/IRioLRTAVSRegistry.sol';
import {IRioLRTDepositPool} from 'contracts/interfaces/IRioLRTDepositPool.sol';
import {IRioLRTIssuer} from 'contracts/interfaces/IRioLRTIssuer.sol';
import {IRioLRT} from 'contracts/interfaces/IRioLRT.sol';

contract RioLRTIssuer is IRioLRTIssuer, OwnableUpgradeable, UUPSUpgradeable {
    /// @notice The liquid restaking token (LRT) implementation.
    address public immutable tokenImpl;

    /// @notice The LRT coordinator implementation.
    address public immutable coordinatorImpl;

    /// @notice The LRT asset registry implementation.
    address public immutable assetRegistryImpl;

    /// @notice The LRT operator registry implementation.
    address public immutable operatorRegistryImpl;

    /// @notice The LRT AVS registry implementation.
    address public immutable avsRegistryImpl;

    /// @notice The LRT deposit pool implementation.
    address public immutable depositPoolImpl;

    /// @notice The LRT withdrawal queue implementation.
    address public immutable withdrawalQueueImpl;

    /// @notice The LRT reward distributor implementation.
    address public immutable rewardDistributorImpl;

    /// @notice Returns whether the provided token was issued by this factory.
    mapping(address => bool) public isTokenFromFactory;

    /// @param tokenImpl_ The liquid restaking token (LRT) implementation.
    /// @param coordinatorImpl_ The LRT coordinator implementation.
    /// @param assetRegistryImpl_ The LRT asset registry implementation.
    /// @param operatorRegistryImpl_ The LRT operator registry implementation.
    /// @param avsRegistryImpl_ The LRT AVS registry implementation.
    /// @param depositPoolImpl_ The LRT deposit pool implementation.
    /// @param withdrawalQueueImpl_ The LRT withdrawal queue implementation.
    /// @param rewardDistributorImpl_ The LRT reward distributor implementation.
    constructor(
        address tokenImpl_,
        address coordinatorImpl_,
        address assetRegistryImpl_,
        address operatorRegistryImpl_,
        address avsRegistryImpl_,
        address depositPoolImpl_,
        address withdrawalQueueImpl_,
        address rewardDistributorImpl_
    ) {
        _disableInitializers();

        tokenImpl = tokenImpl_;
        coordinatorImpl = coordinatorImpl_;
        assetRegistryImpl = assetRegistryImpl_;
        operatorRegistryImpl = operatorRegistryImpl_;
        avsRegistryImpl = avsRegistryImpl_;
        depositPoolImpl = depositPoolImpl_;
        withdrawalQueueImpl = withdrawalQueueImpl_;
        rewardDistributorImpl = rewardDistributorImpl_;
    }

    /// @notice Initializes the contract.
    /// @param initialOwner The initial owner of the contract.
    function initialize(address initialOwner) external initializer {
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
    }

    // forgefmt: disable-next-item
    /// @notice Issues a new liquid restaking token (LRT).
    /// @param name The name of the token.
    /// @param symbol The symbol of the token.
    /// @param config The token configuration.
    function issueLRT(string calldata name, string calldata symbol, LRTConfig calldata config) external onlyOwner returns (LRTDeployment memory d) {
        // Deploy the liquid restaking token (LRT).
        d.token = address(new ERC1967Proxy(tokenImpl, ''));

        // Deploy the supporting contracts using the LRT address as the salt.
        bytes32 salt = bytes32(uint256(uint160(d.token)) << 96);

        d.coordinator = address(new ERC1967Proxy{salt: salt}(coordinatorImpl, ''));
        d.assetRegistry = address(new ERC1967Proxy{salt: salt}(assetRegistryImpl, ''));
        d.operatorRegistry = address(new ERC1967Proxy{salt: salt}(operatorRegistryImpl, ''));
        d.avsRegistry = address(new ERC1967Proxy{salt: salt}(avsRegistryImpl, ''));
        d.depositPool = address(new ERC1967Proxy{salt: salt}(depositPoolImpl, ''));
        d.withdrawalQueue = address(new ERC1967Proxy{salt: salt}(withdrawalQueueImpl, ''));
        d.rewardDistributor = address(new ERC1967Proxy{salt: salt}(rewardDistributorImpl, ''));

        address initialOwner = msg.sender;

        // Initialize all supporting contracts.
        IRioLRT(d.token).initialize(initialOwner, name, symbol, d.coordinator);
        IRioLRTCoordinator(d.coordinator).initialize(initialOwner, d.token, d.assetRegistry, d.operatorRegistry, d.depositPool, d.withdrawalQueue);
        IRioLRTAssetRegistry(d.assetRegistry).initialize(initialOwner, d.coordinator, config.priceFeedDecimals, config.assets);
        IRioLRTOperatorRegistry(d.operatorRegistry).initialize(initialOwner, d.coordinator, d.assetRegistry, d.avsRegistry, d.depositPool, d.rewardDistributor);
        IRioLRTAVSRegistry(d.avsRegistry).initialize(initialOwner);
        IRioLRTDepositPool(d.depositPool).initialize(initialOwner, d.assetRegistry, d.operatorRegistry, d.coordinator);
        IRioLRTWithdrawalQueue(d.withdrawalQueue).initialize(initialOwner, d.token, d.coordinator);
        IRioLRTRewardDistributor(d.rewardDistributor).initialize(initialOwner, config.treasury, config.operatorRewardPool, d.depositPool);

        isTokenFromFactory[d.token] = true;
        emit LiquidRestakingTokenIssued(name, symbol, config, d);
    }

    /// @dev Allows the owner to upgrade the LRT issuer implementation.
    /// @param newImplementation The implementation to upgrade to.
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
