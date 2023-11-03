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
import {IRioLRT} from 'contracts/interfaces/IRioLRT.sol';
import {Array} from 'contracts/utils/Array.sol';

contract RioLRT is IRioLRT, ERC20PermitUpgradeable, OwnableUpgradeable, UUPSUpgradeable {
    using SafeERC20 for IOpenZeppelinERC20;
    using Array for *;

    /// @notice The Balancer vault that holds the pool's cash.
    IVault public immutable vault;

    /// @notice The Balancer queries contract.
    IBalancerQueries public immutable balancerQueries;

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
    /// @param _name The name of the token.
    /// @param _symbol The symbol of the token.
    /// @param _poolId The LRT Balancer pool ID.
    function initialize(string calldata _name, string calldata _symbol, bytes32 _poolId) external initializer {
        __UUPSUpgradeable_init();
        __ERC20_init(_name, _symbol);
        __ERC20Permit_init(_name);

        poolId = _poolId;
    }

    /// @notice Joins the pool with the exact amounts of the provided tokens,
    /// and mints an estimated but unknown (computed at run time) amount of LRT.
    /// @param params The parameters required to join with exact token amounts.
    function joinTokensExactIn(JoinTokensExactInParams calldata params) external returns (uint256 amountOut) {
        // Pull exact token amounts from the user.
        _pullManyTokens(params.tokensIn, params.amountsIn);

        // Join the underlying pool.
        bytes memory userData = abi.encode(JoinKind.EXACT_TOKENS_IN_FOR_BPT_OUT, params.amountsIn, params.minAmountOut);
        amountOut = _join(params.tokensIn, params.amountsIn, userData);

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

        // Join the underlying pool.
        (IERC20[] memory tokens,,) = vault.getPoolTokens(poolId);
        bytes memory userData = abi.encode(
            JoinKind.TOKEN_IN_FOR_EXACT_BPT_OUT, params.amountOut, _findTokenIndex(tokens, IERC20(params.tokenIn))
        );
        amountOut = _join(params.tokenIn.toArray(), params.maxAmountIn.toArray(), userData);

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
        amountOut = _join(params.tokensIn, params.maxAmountsIn, userData);

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

    /// @dev Join the Balancer pool with the given assets and amounts, and return the amount of BPT received.
    /// @param assets The assets to join with.
    /// @param maxAmountsIn The maximum amounts of each asset to join with.
    /// @param userData The encoded join pool user data.
    function _join(address[] memory assets, uint256[] memory maxAmountsIn, bytes memory userData)
        internal
        returns (uint256)
    {
        address pool = _getPoolAddress(poolId);
        uint256 balanceBefore = _getBPTBalance(pool);

        IVault.JoinPoolRequest memory request = IVault.JoinPoolRequest({
            assets: _asIAssetArray(assets),
            maxAmountsIn: maxAmountsIn,
            fromInternalBalance: false,
            userData: userData
        });
        vault.joinPool(poolId, address(this), address(this), request);

        return _getBPTBalance(pool) - balanceBefore;
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
        IOpenZeppelinERC20(token).safeTransferFrom(msg.sender, address(this), amount);
    }

    /// @dev Returns the BPT balance of this contract for the given pool.
    /// @param pool The pool to check.
    function _getBPTBalance(address pool) internal view returns (uint256) {
        return IOpenZeppelinERC20(pool).balanceOf(address(this));
    }

    /// @dev Returns the index of the given token in the given array.
    /// @param tokens The array of tokens to search.
    /// @param token The token to search for.
    function _findTokenIndex(IERC20[] memory tokens, IERC20 token) internal pure returns (uint256) {
        uint256 tokensLength = tokens.length;
        for (uint256 i = 0; i < tokensLength; ++i) {
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

    /// @dev Returns the address of a Pool's contract.
    /// @param _poolId The ID of the pool.
    function _getPoolAddress(bytes32 _poolId) internal pure returns (address) {
        // 12 byte logical shift left to remove the nonce and specialization setting. We don't need to mask,
        // since the logical shift already sets the upper bits to zero.
        return address(uint160(uint256(_poolId) >> (12 * 8)));
    }

    /// @dev Allows the owner to upgrade the LRT implementation.
    /// @param newImplementation The implementation to upgrade to.
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
