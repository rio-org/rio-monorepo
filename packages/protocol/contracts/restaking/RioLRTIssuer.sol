// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {ERC1967Proxy} from '@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {UUPSUpgradeable} from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import {IRioLRTRewardDistributor} from 'contracts/interfaces/IRioLRTRewardDistributor.sol';
import {IManagedPoolFactory} from 'contracts/interfaces/balancer/IManagedPoolFactory.sol';
import {IRioLRTOperatorRegistry} from 'contracts/interfaces/IRioLRTOperatorRegistry.sol';
import {IRioLRTWithdrawalQueue} from 'contracts/interfaces/IRioLRTWithdrawalQueue.sol';
import {IRioLRTAssetManager} from 'contracts/interfaces/IRioLRTAssetManager.sol';
import {IRioLRTAVSRegistry} from 'contracts/interfaces/IRioLRTAVSRegistry.sol';
import {IManagedPool} from 'contracts/interfaces/balancer/IManagedPool.sol';
import {IRioLRTGateway} from 'contracts/interfaces/IRioLRTGateway.sol';
import {IRioLRTIssuer} from 'contracts/interfaces/IRioLRTIssuer.sol';
import {IWETH} from 'contracts/interfaces/misc/IWETH.sol';
import {IRioLRT} from 'contracts/interfaces/IRioLRT.sol';
import {Balancer} from 'contracts/utils/Balancer.sol';
import {Array} from 'contracts/utils/Array.sol';

contract RioLRTIssuer is IRioLRTIssuer, OwnableUpgradeable, UUPSUpgradeable {
    using SafeERC20 for IWETH;
    using SafeERC20 for IERC20;
    using Balancer for bytes32;
    using Array for *;

    /// @notice The maximum swap fee percentage.
    uint256 public constant MAX_SWAP_FEE_PERCENTAGE = 10e16; // 10%

    /// @notice The maximum AUM fee percentage.
    uint256 public constant MAX_AUM_FEE_PERCENTAGE = 10e16; // 10%

    /// @notice The Balancer managed pool base factory.
    IManagedPoolFactory public immutable factory;

    /// @notice The wrapped ether token contract.
    IWETH public immutable weth;

    /// @notice The liquid restaking token implementation.
    address public immutable tokenImpl;

    /// @notice The liquid restaking token gateway implementation.
    address public immutable gatewayImpl;

    /// @notice The liquid restaking token asset manager implementation.
    address public immutable assetManagerImpl;

    /// @notice The liquid restaking token reward distributor implementation.
    address public immutable rewardDistributorImpl;

    /// @notice The liquid restaking token operator registry implementation.
    address public immutable operatorRegistryImpl;

    /// The liquid restaking token withdrawal queue implementation.
    address public immutable withdrawalQueueImpl;

    /// @notice The liquid restaking token AVS registry implementation.
    address public immutable avsRegistryImpl;

    /// @notice Returns whether the provided token was issued by this factory.
    mapping(address => bool) public isTokenFromFactory;

    // forgefmt: disable-next-item
    /// @param factory_ The Balancer managed pool base factory.
    /// @param weth_ The wrapped ether token address.
    /// @param tokenImpl_ The liquid restaking token implementation.
    /// @param gatewayImpl_ The liquid restaking token gateway implementation.
    /// @param assetManagerImpl_ The liquid restaking token asset manager implementation.
    /// @param rewardDistributorImpl_ The liquid restaking token reward distributor implementation.
    /// @param operatorRegistryImpl_ The liquid restaking token operator registry implementation.
    /// @param withdrawalQueueImpl_ The liquid restaking token withdrawal queue implementation.
    /// @param avsRegistryImpl_ The liquid restaking token avs registry implementation.
    constructor(
        address factory_,
        address weth_,
        address tokenImpl_,
        address gatewayImpl_,
        address assetManagerImpl_,
        address rewardDistributorImpl_,
        address operatorRegistryImpl_,
        address withdrawalQueueImpl_,
        address avsRegistryImpl_
    ) {
        _disableInitializers();

        factory = IManagedPoolFactory(factory_);
        weth = IWETH(weth_);

        tokenImpl = tokenImpl_;
        gatewayImpl = gatewayImpl_;
        assetManagerImpl = assetManagerImpl_;
        rewardDistributorImpl = rewardDistributorImpl_;
        operatorRegistryImpl = operatorRegistryImpl_;
        withdrawalQueueImpl = withdrawalQueueImpl_;
        avsRegistryImpl = avsRegistryImpl_;
    }

    /// @notice Initializes the contract.
    /// @param initialOwner The initial owner of the contract.
    function initialize(address initialOwner) external initializer {
        __UUPSUpgradeable_init();
        _transferOwnership(initialOwner);
    }

    // forgefmt: disable-next-item
    /// @notice Issues a new liquid restaking token.
    /// @param name The name of the token.
    /// @param symbol The symbol of the token.
    /// @param config The token configuration.
    function issueLRT(string calldata name, string calldata symbol, LRTConfig calldata config) external payable onlyOwner returns (LRTDeployment memory d) {
        if (config.amountsIn.length != config.tokens.length || config.amountsIn.length != config.normalizedWeights.length) revert INPUT_LENGTH_MISMATCH();
        if (config.swapFeePercentage > MAX_SWAP_FEE_PERCENTAGE) revert SWAP_FEE_TOO_HIGH();
        if (config.managementAumFeePercentage > MAX_AUM_FEE_PERCENTAGE) revert AUM_FEE_TOO_HIGH();

        // ETH is always handled as WETH.
        if (msg.value > 0) {
            weth.deposit{ value: msg.value }();
        }

        // Deploy the liquid restaking token (LRT).
        d.token = address(new ERC1967Proxy(tokenImpl, ''));

        // Deploy the remaining contracts using the LRT address as the salt.
        {
            bytes32 salt = bytes32(uint256(uint160(d.token)) << 96);

            d.gateway = address(new ERC1967Proxy{ salt: salt }(gatewayImpl, ''));
            d.assetManager = address(new ERC1967Proxy{ salt: salt }(assetManagerImpl, ''));
            d.rewardDistributor = address(new ERC1967Proxy{ salt: salt }(rewardDistributorImpl, ''));
            d.operatorRegistry = address(new ERC1967Proxy{ salt: salt }(operatorRegistryImpl, ''));
            d.withdrawalQueue = address(new ERC1967Proxy{ salt: salt }(withdrawalQueueImpl, ''));
            d.avsRegistry = address(new ERC1967Proxy{ salt: salt }(avsRegistryImpl, ''));
        }

        // Deploy the underlying pool.
        bytes32 poolId = _deployUnderlyingPool(name, symbol, config, d);
        address initialOwner = msg.sender;

        // Initialize all supporting contracts.
        IRioLRT(d.token).initialize(initialOwner, name, symbol, d.gateway);
        IRioLRTAssetManager(d.assetManager).initialize(initialOwner, poolId, d);
        IRioLRTRewardDistributor(d.rewardDistributor).initialize(initialOwner, d.token, d.gateway, initialOwner, address(0));
        IRioLRTOperatorRegistry(d.operatorRegistry).initialize(initialOwner, poolId, d.gateway, d.rewardDistributor, d.assetManager);
        IRioLRTWithdrawalQueue(d.withdrawalQueue).initialize(initialOwner, d.gateway, d.assetManager);
        IRioLRTAVSRegistry(d.avsRegistry).initialize(initialOwner);

        // Register the LRT with the factory.
        isTokenFromFactory[d.token] = true;
        emit LiquidRestakingTokenIssued(name, symbol, poolId, config, d);

        // Pull underlying tokens into the gateway and initialize the pool.
        for (uint256 i = 0; i < config.amountsIn.length; ++i) {
            IERC20(config.tokens[i]).safeTransferFrom(initialOwner, d.gateway, config.amountsIn[i]);
        }
        IRioLRTGateway(d.gateway).initialize(
            initialOwner,
            poolId,
            d.token,
            d.assetManager,
            d.withdrawalQueue,
            config.securityCouncil,
            d.gateway.toArray(),
            IRioLRTGateway.InitializeParams({
                tokensIn: config.tokens,
                amountsIn: config.amountsIn,
                strategies: config.strategies,
                targetAUMPercentages: config.targetAUMPercentages
            })
        );

        // Refund any remaining WETH.
        uint256 remainingWETH = weth.balanceOf(address(this));
        if (remainingWETH > 0) {
            weth.safeTransfer(msg.sender, remainingWETH);
        }
    }

    /// @dev Deploy the underlying Balancer pool.
    /// @param name The name of the token.
    /// @param symbol The symbol of the token.
    /// @param config The token configuration.
    /// @param deployment The deployment addresses.
    function _deployUnderlyingPool(
        string memory name,
        string memory symbol,
        LRTConfig memory config,
        LRTDeployment memory deployment
    ) internal returns (bytes32 poolId) {
        // Use the same asset manager for all tokens.
        address[] memory assetManagers = new address[](config.amountsIn.length);
        for (uint256 i = 0; i < config.amountsIn.length; ++i) {
            assetManagers[i] = deployment.assetManager;
        }

        address pool = factory.create(
            IManagedPool.ManagedPoolParams({
                name: string.concat(name, ' Underlying BPT'),
                symbol: string.concat(symbol, '_UBPT'),
                assetManagers: assetManagers
            }),
            IManagedPool.ManagedPoolSettingsParams({
                mustAllowlistLPs: true,
                tokens: config.tokens,
                normalizedWeights: config.normalizedWeights,
                swapFeePercentage: config.swapFeePercentage,
                swapEnabledOnStart: config.swapEnabledOnStart,
                managementAumFeePercentage: config.managementAumFeePercentage,
                aumFeeId: uint256(IManagedPool.ProtocolFeeType.AUM)
            }),
            deployment.gateway,
            blockhash(block.number - 1)
        );
        poolId = IManagedPool(pool).getPoolId();
    }

    /// @dev Allows the owner to upgrade the LRT issuer implementation.
    /// @param newImplementation The implementation to upgrade to.
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
