// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {IERC20 as IOpenZeppelinERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {IERC20} from '@balancer-v2/contracts/interfaces/contracts/solidity-utils/openzeppelin/IERC20.sol';
import {IBalancerQueries} from '@balancer-v2/contracts/interfaces/contracts/standalone-utils/IBalancerQueries.sol';
import {ERC20PermitUpgradeable} from '@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {UUPSUpgradeable} from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {IVault} from '@balancer-v2/contracts/interfaces/contracts/vault/IVault.sol';
import {IAsset} from '@balancer-v2/contracts/interfaces/contracts/vault/IAsset.sol';
import {IRioLRTWithdrawalQueue} from 'contracts/interfaces/IRioLRTWithdrawalQueue.sol';
import {IRioLRTAssetManager} from 'contracts/interfaces/IRioLRTAssetManager.sol';
import {IRioLRT} from 'contracts/interfaces/IRioLRT.sol';
import {Balancer} from 'contracts/utils/Balancer.sol';
import {Array} from 'contracts/utils/Array.sol';

contract RioLRT is IRioLRT, ERC20PermitUpgradeable, OwnableUpgradeable, UUPSUpgradeable {
    using SafeERC20 for IOpenZeppelinERC20;
    using Balancer for bytes32;
    using Array for *;

    /// @notice The Balancer vault that holds the pool's cash.
    IVault public immutable vault;

    /// @notice The Balancer queries contract.
    IBalancerQueries public immutable balancerQueries;

    /// @notice The contract in charge of managing the LRT's assets.
    IRioLRTAssetManager public assetManager;

    /// @notice The contract used to queue and process withdrawals.
    IRioLRTWithdrawalQueue public withdrawalQueue;

    /// @notice The LRT Balancer pool ID.
    bytes32 public poolId;

    /// @param _vault The Balancer vault that holds the pool's cash.
    /// @param _balancerQueries The Balancer queries contract.
    constructor(address _vault, address _balancerQueries) initializer {
        vault = IVault(_vault);
        balancerQueries = IBalancerQueries(_balancerQueries);
    }

    // forgefmt: disable-next-item
    /// @notice Initializes the liquid restaking token.
    /// @param initialOwner The initial owner of the contract.
    /// @param name The name of the token.
    /// @param symbol The symbol of the token.
    /// @param _poolId The LRT Balancer pool ID.
    /// @param _assetManager The contract in charge of managing the LRT's assets.
    /// @param _withdrawalQueue The contract used to queue and process withdrawals.
    /// @param params The parameters required to initialize the pool.
    function initialize(address initialOwner, string calldata name, string calldata symbol, bytes32 _poolId, address _assetManager, address _withdrawalQueue, InitializeParams calldata params) external initializer returns (uint256) {
        __UUPSUpgradeable_init();
        __ERC20_init(name, symbol);
        __ERC20Permit_init(name);

        poolId = _poolId;
        assetManager = IRioLRTAssetManager(_assetManager);
        withdrawalQueue = IRioLRTWithdrawalQueue(_withdrawalQueue);

        _transferOwnership(initialOwner);
        return _initialize(params, initialOwner);
    }

    /// @notice Joins the pool with the exact amounts of the provided tokens,
    /// and mints an estimated but unknown (computed at run time) amount of LRT.
    /// @param params The parameters required to join with exact token amounts.
    function joinTokensExactIn(JoinTokensExactInParams calldata params) external returns (uint256 amountOut) {
        // Pull exact token amounts from the user.
        _pullManyTokens(params.tokensIn, params.amountsIn);

        // Join the underlying pool.
        bytes memory userData = abi.encode(JoinKind.EXACT_TOKENS_IN_FOR_BPT_OUT, params.amountsIn, params.minAmountOut);
        amountOut = _join(params.tokensIn.prepend(poolId.toPoolAddress()), params.amountsIn.prepend(0), userData);

        // Mint LRT to the user.
        _mint(msg.sender, amountOut);
    }

    /// @notice Joins the pool with an estimated but unknown (computed at run time)
    /// amount of a single token, and mints an exact amount of LRT.
    /// @param params The parameters required to join with a single input token and
    /// an exact output amount.
    function joinTokenExactOut(JoinTokenExactOutParams calldata params) external returns (uint256 amountOut) {
        // Pull the maximum token amount from the user.
        _pullToken(params.tokenIn, params.maxAmountIn);

        (IERC20[] memory tokens,,) = vault.getPoolTokens(poolId);
        uint256 tokenIndex = _findTokenIndex(tokens, IERC20(params.tokenIn));

        uint256[] memory maxAmountsIn = new uint256[](tokens.length);
        maxAmountsIn[tokenIndex] = params.maxAmountIn;

        // Join the underlying pool.
        bytes memory userData = abi.encode(
            JoinKind.TOKEN_IN_FOR_EXACT_BPT_OUT, params.amountOut, tokenIndex - 1
        );
        amountOut = _join(_asAddressArray(tokens), maxAmountsIn, userData);

        // Mint LRT to the user.
        _mint(msg.sender, amountOut);

        // Refund any remaining tokens.
        uint256 remainingTokens = IOpenZeppelinERC20(params.tokenIn).balanceOf(address(this));
        if (remainingTokens > 0) {
            IOpenZeppelinERC20(params.tokenIn).safeTransfer(msg.sender, remainingTokens);
        }
    }

    /// @notice Joins the pool with an estimated but unknown (computed at run time)
    /// amount of each token, and mints an exact amount of LRT.
    /// @param params The parameters required to join with all input tokens and
    /// an exact output amount.
    function joinAllTokensExactOut(JoinAllTokensExactOutParams calldata params) external returns (uint256 amountOut) {
        // Pull the maximum token amounts from the user.
        _pullManyTokens(params.tokensIn, params.maxAmountsIn);

        // Join the underlying pool.
        bytes memory userData = abi.encode(JoinKind.ALL_TOKENS_IN_FOR_EXACT_BPT_OUT, params.amountOut);
        amountOut = _join(params.tokensIn.prepend(poolId.toPoolAddress()), params.maxAmountsIn.prepend(0), userData);

        // Mint LRT to the user.
        _mint(msg.sender, amountOut);

        // Refund any remaining tokens.
        IOpenZeppelinERC20 token;
        for (uint256 i = 0; i < params.tokensIn.length; i++) {
            token = IOpenZeppelinERC20(params.tokensIn[i]);
            uint256 remainingTokens = token.balanceOf(address(this));
            if (remainingTokens > 0) {
                token.safeTransfer(msg.sender, remainingTokens);
            }
        }
    }

    /// @notice Queues an exit to an estimated but unknown (computed at run time)
    /// amount of a single token, and burns an exact amount of LRT.
    /// @param params The parameters required to exit to a single output token
    /// with an exact amount of LRT.
    function queueExitTokenExactIn(QueueExitTokenExactInParams calldata params) external returns (uint256 amountIn) {
        // Burn the user's LRT.
        _burn(msg.sender, params.amountIn);

        (IERC20[] memory tokens,,) = vault.getPoolTokens(poolId);
        uint256 tokenIndex = _findTokenIndex(tokens, IERC20(params.tokenOut));

        uint256[] memory minAmountsOut = new uint256[](tokens.length);
        minAmountsOut[tokenIndex] = params.minAmountOut;

        // Simulate exit from the underlying pool and queue the withdrawal(s).
        bytes memory userData = abi.encode(
            ExitKind.EXACT_BPT_IN_FOR_ONE_TOKEN_OUT, params.amountIn, tokenIndex - 1
        );
        uint256[] memory amountsOut;
        address[] memory tokensOut = _asAddressArray(tokens);
        (amountIn, amountsOut) = _queryExit(tokensOut, minAmountsOut, userData);

        withdrawalQueue.queueWithdrawals(msg.sender, tokensOut, amountsOut);   
    }

    /// @notice Queues an exit to an estimated but unknown (computed at run time)
    /// amount of each token, and burns an exact amount of LRT.
    /// @param params The parameters required to exit to all output tokens
    /// with an exact amount of LRT.
    function queueExitAllTokensExactIn(QueueExitAllTokensExactInParams calldata params) external returns (uint256 amountIn) {
        // Burn the user's LRT.
        _burn(msg.sender, params.amountIn);

        // Simulate exit from the underlying pool.
        bytes memory userData = abi.encode(ExitKind.EXACT_BPT_IN_FOR_TOKENS_OUT, params.amountIn);

        uint256[] memory amountsOut;
        address[] memory tokensOut = params.tokensOut.prepend(poolId.toPoolAddress());
        (amountIn, amountsOut) = _queryExit(tokensOut, params.minAmountsOut.prepend(0), userData);

        withdrawalQueue.queueWithdrawals(msg.sender, tokensOut, amountsOut);
    }

    /// @notice Queues an exit to an exact amount of each token, and burns an estimated but
    /// unknown (computed at run time) amount of LRT.
    /// @param params The parameters required to exit to an exact amount of all output tokens
    /// with an amount of LRT.
    function queueExitTokensExactOut(QueueExitTokensExactOutParams calldata params) external {
        // Simulate exit from the underlying pool.
        bytes memory userData = abi.encode(ExitKind.BPT_IN_FOR_EXACT_TOKENS_OUT, params.amountsOut, params.maxAmountIn);
        (uint256 amountIn,) = _queryExit(params.tokensOut.prepend(poolId.toPoolAddress()), params.amountsOut.prepend(0), userData);

        // Burn the user's LRT.
        _burn(msg.sender, amountIn);

        withdrawalQueue.queueWithdrawals(msg.sender, params.tokensOut, params.amountsOut);
    }

    // forgefmt: disable-next-item
    /// @dev Join the Balancer pool with the given assets and amounts, and return the amount of BPT received.
    /// @param assets The assets to join with.
    /// @param maxAmountsIn The maximum amounts of each asset to join with.
    /// @param userData The encoded join pool user data.
    function _join(address[] memory assets, uint256[] memory maxAmountsIn, bytes memory userData) internal returns (uint256) {
        bytes32 _poolId = poolId;
        address pool = _poolId.toPoolAddress();
        uint256 balanceBefore = _getBPTBalance(pool);

        IVault.JoinPoolRequest memory request = IVault.JoinPoolRequest({
            assets: _asIAssetArray(assets),
            maxAmountsIn: maxAmountsIn,
            fromInternalBalance: false,
            userData: userData
        });
        vault.joinPool(_poolId, address(this), address(this), request);

        return _getBPTBalance(pool) - balanceBefore;
    }

    /// @dev Build the Balancer exit pool request and calculate the amount of BPT burned
    /// as well as the output amounts.
    /// @param assets The assets to exit to.
    /// @param minAmountsOut The minimum amounts of each asset to exit to.
    /// @param userData The encoded exit pool user data.
    function _queryExit(address[] memory assets, uint256[] memory minAmountsOut, bytes memory userData)
        internal
        returns (uint256 amountIn, uint256[] memory amountsOut)
    {
        IVault.ExitPoolRequest memory request = IVault.ExitPoolRequest({
            assets: _asIAssetArray(assets),
            minAmountsOut: minAmountsOut,
            toInternalBalance: false,
            userData: userData
        });
        (amountIn, amountsOut) = balancerQueries.queryExit(poolId, address(this), address(this), request);
        for (uint256 i = 0; i < amountsOut.length; ++i) {
            if (amountsOut[i] < minAmountsOut[i]) revert EXIT_BELOW_MIN();
        }
    }

    /// @dev Initializes the Balancer pool with the given assets and amounts.
    /// @param params The parameters required to initialize the pool.
    /// @param recipient The recipient of the LRT.
    function _initialize(InitializeParams calldata params, address recipient) internal returns (uint256 amountOut) {
        // Allow the vault to spend the provided tokens.
        for (uint256 i = 0; i < params.tokensIn.length; ++i) {
            IOpenZeppelinERC20(params.tokensIn[i]).safeApprove(address(vault), type(uint256).max);
        }

        bytes memory userData = abi.encode(JoinKind.INIT, params.amountsIn);
        amountOut = _join(
            params.tokensIn.prepend(poolId.toPoolAddress()), params.amountsIn.prepend(type(uint256).max), userData
        );

        // Mint LRT to the provided `recipient`.
        _mint(recipient, amountOut);
    }

    /// @dev Pulls the exact amounts of the given tokens from the `msg.sender`.
    /// @param tokens The tokens to pull.
    /// @param amounts The amounts of each token to pull.
    function _pullManyTokens(address[] calldata tokens, uint256[] calldata amounts) internal {
        uint256 tokenCount = tokens.length;
        if (tokenCount != amounts.length) revert INPUT_LENGTH_MISMATCH();
        for (uint256 i = 0; i < tokenCount; ++i) {
            _pullToken(tokens[i], amounts[i]);
        }
    }

    /// @dev Pulls the exact amount of the given token from the `msg.sender`.
    /// @param token The token to pull.
    /// @param amount The amount of the token to pull.
    function _pullToken(address token, uint256 amount) internal {
        if (amount == 0) return;
        IOpenZeppelinERC20(token).safeTransferFrom(msg.sender, address(this), amount);
    }

    /// @dev Returns the BPT balance of this contract for the given pool.
    /// @param pool The pool to check.
    function _getBPTBalance(address pool) internal view returns (uint256) {
        return IOpenZeppelinERC20(pool).balanceOf(address(this));
    }

    /// @dev Returns the index of the given token in the given array. This function expects
    /// BPT at index 0, so it begins the search at index 1.
    /// @param tokens The array of tokens to search.
    /// @param token The token to search for.
    function _findTokenIndex(IERC20[] memory tokens, IERC20 token) internal pure returns (uint256) {
        uint256 tokensLength = tokens.length;
        for (uint256 i = 1; i < tokensLength; ++i) {
            if (tokens[i] == token) {
                return i;
            }
        }
        revert INVALID_TOKEN();
    }

    /// @dev Converts an array of addresses to an array of IAssets.
    /// @param tokens The array of addresses to convert.
    function _asIAssetArray(address[] memory tokens) internal pure returns (IAsset[] memory assets) {
        assembly {
            assets := tokens
        }
    }

    /// @dev Converts an array of IERC20 tokens to an array of addresses.
    /// @param tokens The array of IERC20 tokens to convert.
    function _asAddressArray(IERC20[] memory tokens) internal pure returns (address[] memory addrs) {
        assembly {
            addrs := tokens
        }
    }

    /// @dev Allows the owner to upgrade the LRT implementation.
    /// @param newImplementation The implementation to upgrade to.
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
