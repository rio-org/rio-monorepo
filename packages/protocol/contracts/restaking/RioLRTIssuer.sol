// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {CREATE3} from '@solady/utils/CREATE3.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {ERC1967Proxy} from '@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {UUPSUpgradeable} from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import {ContractType, ETH_ADDRESS, MIN_SACRIFICIAL_DEPOSIT} from 'contracts/utils/Constants.sol';
import {IRioLRTRewardDistributor} from 'contracts/interfaces/IRioLRTRewardDistributor.sol';
import {IRioLRTOperatorRegistry} from 'contracts/interfaces/IRioLRTOperatorRegistry.sol';
import {IRioLRTWithdrawalQueue} from 'contracts/interfaces/IRioLRTWithdrawalQueue.sol';
import {IRioLRTAssetRegistry} from 'contracts/interfaces/IRioLRTAssetRegistry.sol';
import {IRioLRTCoordinator} from 'contracts/interfaces/IRioLRTCoordinator.sol';
import {IRioLRTAVSRegistry} from 'contracts/interfaces/IRioLRTAVSRegistry.sol';
import {IRioLRTDepositPool} from 'contracts/interfaces/IRioLRTDepositPool.sol';
import {LRTAddressCalculator} from 'contracts/utils/LRTAddressCalculator.sol';
import {IRioLRTIssuer} from 'contracts/interfaces/IRioLRTIssuer.sol';
import {IRioLRT} from 'contracts/interfaces/IRioLRT.sol';

contract RioLRTIssuer is IRioLRTIssuer, OwnableUpgradeable, UUPSUpgradeable {
    using LRTAddressCalculator for address;
    using SafeERC20 for IERC20;

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
    function issueLRT(string calldata name, string calldata symbol, LRTConfig calldata config) external payable onlyOwner returns (LRTDeployment memory d) {
        // Deploy the liquid restaking token (LRT).
        d.token = address(new ERC1967Proxy(tokenImpl, ''));

        // Deploy the supporting contracts using the LRT address as the salt.
        d.coordinator = CREATE3.deploy(
            d.token.computeSalt(ContractType.Coordinator),
            abi.encodePacked(type(ERC1967Proxy).creationCode, abi.encode(coordinatorImpl, '')),
            0
        );
        d.assetRegistry = CREATE3.deploy(
            d.token.computeSalt(ContractType.AssetRegistry),
            abi.encodePacked(type(ERC1967Proxy).creationCode, abi.encode(assetRegistryImpl, '')),
            0
        );
        d.operatorRegistry = CREATE3.deploy(
            d.token.computeSalt(ContractType.OperatorRegistry),
            abi.encodePacked(type(ERC1967Proxy).creationCode, abi.encode(operatorRegistryImpl, '')),
            0
        );
        d.avsRegistry = CREATE3.deploy(
            d.token.computeSalt(ContractType.AVSRegistry),
            abi.encodePacked(type(ERC1967Proxy).creationCode, abi.encode(avsRegistryImpl, '')),
            0
        );
        d.depositPool = CREATE3.deploy(
            d.token.computeSalt(ContractType.DepositPool),
            abi.encodePacked(type(ERC1967Proxy).creationCode, abi.encode(depositPoolImpl, '')),
            0
        );
        d.withdrawalQueue = CREATE3.deploy(
            d.token.computeSalt(ContractType.WithdrawalQueue),
            abi.encodePacked(type(ERC1967Proxy).creationCode, abi.encode(withdrawalQueueImpl, '')),
            0
        );
        d.rewardDistributor = CREATE3.deploy(
            d.token.computeSalt(ContractType.RewardDistributor),
            abi.encodePacked(type(ERC1967Proxy).creationCode, abi.encode(rewardDistributorImpl, '')),
            0
        );

        address initialOwner = msg.sender;

        // Initialize all supporting contracts.
        IRioLRT(d.token).initialize(initialOwner, name, symbol);
        IRioLRTCoordinator(d.coordinator).initialize(initialOwner, d.token);
        IRioLRTAssetRegistry(d.assetRegistry).initialize(initialOwner, d.token, config.priceFeedDecimals, config.assets);
        IRioLRTOperatorRegistry(d.operatorRegistry).initialize(initialOwner, d.token);
        IRioLRTAVSRegistry(d.avsRegistry).initialize(initialOwner, d.token);
        IRioLRTDepositPool(d.depositPool).initialize(initialOwner, d.token);
        IRioLRTWithdrawalQueue(d.withdrawalQueue).initialize(initialOwner, d.token);
        IRioLRTRewardDistributor(d.rewardDistributor).initialize(initialOwner, d.token, config.treasury, config.operatorRewardPool);

        isTokenFromFactory[d.token] = true;
        emit LiquidRestakingTokenIssued(name, symbol, config, d);

        // Make a sacrificial deposit to prevent inflation attacks.
        _deposit(
            IRioLRTCoordinator(d.coordinator),
            config.deposit.asset,
            config.deposit.amount
        );
    }

    /// @dev Makes a sacrificial deposit to prevent inflation attacks.
    /// @param coordinator The LRT coordinator.
    /// @param asset The asset to deposit.
    /// @param amount The amount to deposit.
    function _deposit(IRioLRTCoordinator coordinator, address asset, uint256 amount) internal {
        if (amount < MIN_SACRIFICIAL_DEPOSIT) revert INSUFFICIENT_SACRIFICIAL_DEPOSIT();
        if (asset == ETH_ADDRESS) {
            if (amount != msg.value) revert INVALID_ETH_PROVIDED();
            coordinator.depositETH{value: amount}();
            return;
        }

        IERC20(asset).safeTransferFrom(msg.sender, address(this), amount);
        IERC20(asset).approve(address(coordinator), amount);

        coordinator.deposit(asset, amount);
    }

    /// @dev Allows the owner to upgrade the LRT issuer implementation.
    /// @param newImplementation The implementation to upgrade to.
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
