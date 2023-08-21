// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {LibClone} from '@solady/utils/LibClone.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {UUPSUpgradeable} from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import {IWETH} from '@balancer-v2/contracts/interfaces/contracts/solidity-utils/misc/IWETH.sol';
import {IAsset} from '@balancer-v2/contracts/interfaces/contracts/vault/IAsset.sol';
import {IVault} from '@balancer-v2/contracts/interfaces/contracts/vault/IVault.sol';
import {IManagedPoolSettings} from './interfaces/IManagedPoolSettings.sol';
import {IManagedPoolFactory} from './interfaces/IManagedPoolFactory.sol';
import {IRioLRTController} from './interfaces/IRioLRTController.sol';
import {IRioLRTIssuer} from './interfaces/IRioLRTIssuer.sol';

contract RioLRTIssuer is IRioLRTIssuer, OwnableUpgradeable, UUPSUpgradeable {
    using SafeERC20 for IERC20;
    using LibClone for address;

    /// @notice The maximum swap fee percentage.
    uint256 public constant MAX_SWAP_FEE_PERCENTAGE = 10e16; // 10%

    /// @notice The maximum AUM fee percentage.
    uint256 public constant MAX_AUM_FEE_PERCENTAGE = 10e16; // 10%

    /// @notice The Balancer managed pool base factory.
    IManagedPoolFactory public immutable factory;

    /// @notice The Balancer vault contract.
    IVault public immutable vault;

    /// @notice The wrapped ether token address.
    IWETH public immutable weth;

    /// @notice The contract in charge of managing the LRT's assets.
    address public immutable assetManager;

    /// @notice The liquid restaking token controller implementation.
    address public immutable controllerImpl;

    /// @notice Returns whether the provided token was issued by this factory.
    mapping(address => bool) public isTokenFromFactory;

    // forgefmt: disable-next-item
    /// @param _factory The Balancer managed pool base factory.
    /// @param _vault The Balancer vault contract.
    /// @param _weth The wrapped ether token address.
    /// @param _assetManager The contract in charge of managing the LRT's assets.
    /// @param _controllerImpl The liquid restaking token controller implementation.
    constructor(address _factory, address _vault, address _weth, address _assetManager, address _controllerImpl) initializer {
        factory = IManagedPoolFactory(_factory);
        vault = IVault(_vault);
        weth = IWETH(_weth);
        assetManager = _assetManager;
        controllerImpl = _controllerImpl;
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
    function issueLRT(string calldata name, string calldata symbol, LRTConfig memory config) external payable onlyOwner returns (address controller, address pool) {
        if (config.amountsIn.length != config.settings.tokens.length) revert INPUT_LENGTH_MISMATCH();
        if (config.settings.swapFeePercentage > MAX_SWAP_FEE_PERCENTAGE) revert SWAP_FEE_TOO_HIGH();
        if (config.settings.managementAumFeePercentage > MAX_AUM_FEE_PERCENTAGE) revert AUM_FEE_TOO_HIGH();
        if (config.settings.mustAllowlistLPs) {
            if (config.allowedLPs.length == 0) revert NO_LPS_ALLOWLISTED();
        } else if (config.allowedLPs.length != 0) revert ALLOWLIST_DISABLED_BUT_LPS_ALLOWLISTED();

        // Disable the LP allowlist until `initialize` is called to allow this contract
        // to join the LRT pool without adding itself to the allowlist, if applicable.
        config.settings.mustAllowlistLPs = false;

        // ETH is always handled as WETH.
        if (msg.value != 0) {
            weth.deposit{ value: msg.value }();
        }

        IManagedPoolSettings.ManagedPoolParams memory creationParams = IManagedPoolSettings.ManagedPoolParams({
            name: name,
            symbol: symbol,
            assetManagers: new address[](config.amountsIn.length)
        });

        uint256 sizeWithBPT = config.amountsIn.length + 1;
        IVault.JoinPoolRequest memory joinRequest = IVault.JoinPoolRequest({
            assets: new IAsset[](sizeWithBPT),
            maxAmountsIn: new uint256[](sizeWithBPT),
            userData: abi.encode(JoinKind.INIT, config.amountsIn),
            fromInternalBalance: false
        });

        uint256 j = 1;
        for (uint256 i = 0; i < config.amountsIn.length; ++i) {
            IERC20 tokenIn = IERC20(config.settings.tokens[i]);
            uint256 amountIn = config.amountsIn[i];

            // Populate the asset managers array with the asset manager contract.
            creationParams.assetManagers[i] = assetManager;

            // Populate the asset and amount arrays, leaving the first position open for the BPT.
            joinRequest.assets[j] = IAsset(address(tokenIn));
            joinRequest.maxAmountsIn[j] = amountIn;

            // Pull tokens from the caller and enable the vault to pull them, if needed.
            if (tokenIn.allowance(address(this), address(vault)) < amountIn) {
                tokenIn.safeApprove(address(vault), type(uint256).max);
            }
            tokenIn.safeTransferFrom(msg.sender, address(this), amountIn);

            ++j;
        }

        // Deploy the pool (LRT) and the controller that will manage it.
        controller = controllerImpl.clone(abi.encodePacked(assetManager));
        pool = factory.create(creationParams, config.settings, controller, blockhash(block.number - 1));

        // Add liquidity to the pool (LRT), thereby initializing it.
        bytes32 poolId = IManagedPoolSettings(pool).getPoolId();
        vault.joinPool(poolId, address(this), msg.sender, joinRequest);

        IRioLRTController(controller).initialize(owner(), pool, config.securityCouncil, config.allowedLPs);
        isTokenFromFactory[pool] = true;

        emit LiquidRestakingTokenIssued(poolId, name, symbol, config.settings.tokens, controller);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
