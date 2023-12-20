// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {FixedPointMathLib} from '@solady/utils/FixedPointMathLib.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {IStrategy} from 'contracts/interfaces/eigenlayer/IStrategy.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {IBalancerQueries} from 'contracts/interfaces/balancer/IBalancerQueries.sol';
import {IRioLRTWithdrawalQueue} from 'contracts/interfaces/IRioLRTWithdrawalQueue.sol';
import {IRioLRTAssetManager} from 'contracts/interfaces/IRioLRTAssetManager.sol';
import {WrappedTokenHandler} from 'contracts/wrapping/WrappedTokenHandler.sol';
import {IBurnableBPT} from 'contracts/interfaces/balancer/IBurnableBPT.sol';
import {SafeCast} from '@openzeppelin/contracts/utils/math/SafeCast.sol';
import {IRioLRTGateway} from 'contracts/interfaces/IRioLRTGateway.sol';
import {PoolController} from 'contracts/utils/PoolController.sol';
import {IVault} from 'contracts/interfaces/balancer/IVault.sol';
import {IWETH} from 'contracts/interfaces/misc/IWETH.sol';
import {IRioLRT} from 'contracts/interfaces/IRioLRT.sol';
import {Balancer} from 'contracts/utils/Balancer.sol';
import {Array} from 'contracts/utils/Array.sol';

contract RioLRTGateway is IRioLRTGateway, WrappedTokenHandler, PoolController {
    using FixedPointMathLib for uint256;
    using SafeERC20 for IERC20;
    using Balancer for bytes32;
    using Array for *;

    /// @notice The wrapped ether token address.
    address public immutable weth;

    /// @notice The Balancer vault that holds the pool's cash.
    IVault public immutable vault;

    /// @notice The Balancer queries contract.
    IBalancerQueries public immutable balancerQueries;

    /// @notice The contract in charge of managing the LRT's assets.
    IRioLRTAssetManager public assetManager;

    /// @notice The contract used to queue and process withdrawals.
    IRioLRTWithdrawalQueue public withdrawalQueue;

    /// @notice The liquid restaking token (LRT).
    IRioLRT public restakingToken;

    /// @notice The underlying Balancer pool ID.
    bytes32 public poolId;

    /// @notice The security daemon's wallet, which is controlled by the security council and owner.
    /// The security daemon is responsible for removal of duplicate or invalid validator keys.
    address public securityDaemon;

    // forgefmt: disable-next-item
    /// @param tokenWrapperFactory_ The contract that deploys token wrappers.
    /// @param weth_ The wrapped ether token address.
    /// @param vault_ The Balancer vault that holds the pool's cash.
    /// @param balancerQueries_ The Balancer queries contract.
    constructor(address tokenWrapperFactory_, address weth_, address vault_, address balancerQueries_) WrappedTokenHandler(tokenWrapperFactory_) {
        _disableInitializers();

        weth = weth_;
        vault = IVault(vault_);
        balancerQueries = IBalancerQueries(balancerQueries_);
    }

    // forgefmt: disable-next-item
    /// @notice Initializes the liquid restaking token manager.
    /// @param initialOwner The initial owner of the contract.
    /// @param poolId_ The underlying Balancer pool ID.
    /// @param restakingToken_ The liquid restaking token (LRT).
    /// @param assetManager_ The contract in charge of managing the LRT's assets.
    /// @param withdrawalQueue_ The contract used to queue and process withdrawals.
    /// @param securityCouncil The address of the DAO-managed security council.
    /// @param allowedLPs The addresses of the LPs that are allowed to join the pool.
    /// @param params The parameters required to initialize the pool.
    function initialize(
        address initialOwner,
        bytes32 poolId_,
        address restakingToken_,
        address assetManager_,
        address withdrawalQueue_,
        address securityCouncil,
        address[] calldata allowedLPs,
        InitializeParams calldata params
    ) external initializer returns (uint256) {
        super._initializePoolController(initialOwner, poolId_.toPoolAddress(), securityCouncil, allowedLPs);

        poolId = poolId_;
        restakingToken = IRioLRT(restakingToken_);
        assetManager = IRioLRTAssetManager(assetManager_);
        withdrawalQueue = IRioLRTWithdrawalQueue(withdrawalQueue_);

        return _initialize(params, initialOwner);
    }

    // forgefmt: disable-next-item
    /// @notice Joins the pool with the exact amounts of the provided tokens,
    /// and mints an estimated but unknown (computed at run time) amount of LRT.
    /// @param params The parameters required to join with exact token amounts.
    function joinTokensExactIn(JoinTokensExactInParams calldata params) external payable returns (uint256 amountOut) {
        _ensureInputLengthMatch(params.tokensIn.length, params.amountsIn.length, params.requiresWrap.length);
        _pullTokens(params.tokensIn, params.amountsIn);

        // Join the underlying pool.
        JoinPoolInputs memory inputs = _prepareJoinPoolInputs(
            params.tokensIn, params.amountsIn, params.requiresWrap, poolId.toPoolAddress(), 0
        );
        bytes memory userData = abi.encode(JoinKind.EXACT_TOKENS_IN_FOR_BPT_OUT, inputs.poolTokenAmountsIn, params.minAmountOut);
        amountOut = _join(inputs.poolTokensInWithBPT, inputs.poolTokenAmountsInWithBPT, userData);

        // Mint LRT to the user.
        restakingToken.mint(msg.sender, amountOut);

        // Return excess ETH to the caller, if overfunded.
        _calculateAndRefundExcess(address(0), false);

        // Emit the event with the tokens that were pulled from the user, not the internal wrapped tokens.
        emit JoinedTokensExactIn(msg.sender, params.tokensIn, params.amountsIn, amountOut);
    }

    // forgefmt: disable-next-item
    /// @notice Joins the pool with an estimated but unknown (computed at run time)
    /// amount of a single token, and mints an exact amount of LRT.
    /// @param params The parameters required to join with a single input token and
    /// an exact output amount.
    function joinTokenExactOut(JoinTokenExactOutParams calldata params) external payable returns (uint256 amountOut) {
        // Pull the maximum token amount from the user.
        _pullToken(params.tokenIn, params.maxAmountIn);

        // Join the underlying pool.
        JoinPoolInput memory input = _prepareJoinPoolInput(
            params.tokenIn, params.maxAmountIn, params.requiresWrap
        );
        bytes memory userData = abi.encode(JoinKind.TOKEN_IN_FOR_EXACT_BPT_OUT, params.amountOut, input.poolTokenIndex - 1);
        amountOut = _join(input.poolTokensInWithBPT, input.poolTokenAmountsInWithBPT, userData);

        // Mint LRT to the user.
        restakingToken.mint(msg.sender, amountOut);

        // Calculate the actual amount in and return excess funds to the caller.
        uint256 amountIn = params.maxAmountIn - _calculateAndRefundExcess(input.poolTokenIn, params.requiresWrap);

        emit JoinedTokenExactOut(msg.sender, params.tokenIn, amountIn, amountOut);
    }

    // forgefmt: disable-next-item
    /// @notice Joins the pool with an estimated but unknown (computed at run time)
    /// amount of each token, and mints an exact amount of LRT.
    /// @param params The parameters required to join with all input tokens and
    /// an exact output amount.
    function joinAllTokensExactOut(JoinAllTokensExactOutParams calldata params) external payable returns (uint256 amountOut) {
        _ensureInputLengthMatch(params.tokensIn.length, params.maxAmountsIn.length, params.requiresWrap.length);
        _pullTokens(params.tokensIn, params.maxAmountsIn);

        // Join the underlying pool.
        JoinPoolInputs memory inputs = _prepareJoinPoolInputs(
            params.tokensIn, params.maxAmountsIn, params.requiresWrap, poolId.toPoolAddress(), 0
        );
        bytes memory userData = abi.encode(JoinKind.ALL_TOKENS_IN_FOR_EXACT_BPT_OUT, params.amountOut);
        amountOut = _join(inputs.poolTokensInWithBPT, inputs.poolTokenAmountsInWithBPT, userData);

        // Mint LRT to the user.
        restakingToken.mint(msg.sender, amountOut);

        // Calculate the actual amounts in and return excess funds to the caller.
        uint256[] memory amountsIn = params.maxAmountsIn;
        for (uint256 i = 0; i < inputs.poolTokensIn.length; ++i) {
            amountsIn[i] -= _calculateAndRefundExcess(inputs.poolTokensIn[i], params.requiresWrap[i]);
        }

        emit JoinedAllTokensExactOut(msg.sender, params.tokensIn, amountsIn, amountOut);
    }

    // forgefmt: disable-next-item
    /// @notice Requests an exit to an estimated but unknown (computed at run time)
    /// amount of a single token, and burns an exact amount of LRT.
    /// @param params The parameters required to exit to a single output token
    /// with an exact amount of LRT.
    function requestExitTokenExactIn(ExitTokenExactInParams calldata params) external returns (uint256 amountIn) {
        // Simulate exit from the underlying pool and queue the withdrawal(s).
        bytes32 _poolId = poolId;
        ExitPoolInput memory input = _prepareExitPoolInput(
            _poolId, params.tokenOut, params.minAmountOut, params.requiresUnwrap
        );
        bytes memory userData = abi.encode(ExitKind.EXACT_BPT_IN_FOR_ONE_TOKEN_OUT, params.amountIn, input.poolTokenIndex - 1);

        uint256[] memory amountsOut;
        (amountIn, amountsOut) = _queryExit(input.poolTokensOutWithBPT, input.poolTokenAmountsOutWithBPT, userData);
        if (amountsOut[input.poolTokenIndex] < input.poolTokenAmountOut) revert EXIT_BELOW_MIN();

        // Burn the user's LRT and the underlying BPT.
        _burn(msg.sender, params.amountIn, IBurnableBPT(_poolId.toPoolAddress()));

        // Send available cash to the user and queue the remainder as 'owed shares'.
        (uint256 cash, uint256 shares) = _processTokenWithdrawal(
            msg.sender, input.poolTokenOut, amountsOut[input.poolTokenIndex], params.requiresUnwrap
        );

        emit RequestedExitTokenExactIn(msg.sender, params.tokenOut, cash, shares, amountIn);
    }

    // forgefmt: disable-next-item
    /// @notice Requests an exit to an estimated but unknown (computed at run time)
    /// amount of each token, and burns an exact amount of LRT.
    /// @param params The parameters required to exit to all output tokens
    /// with an exact amount of LRT.
    function requestExitAllTokensExactIn(ExitAllTokensExactInParams calldata params) external returns (uint256 amountIn) {
        address pool = poolId.toPoolAddress();
        ExitPoolInputs memory inputs = _prepareExitPoolInputs(
            params.tokensOut, params.minAmountsOut, params.requiresUnwrap, pool, 0
        );
        bytes memory userData = abi.encode(ExitKind.EXACT_BPT_IN_FOR_TOKENS_OUT, params.amountIn);

        // Simulate exit from the underlying pool.
        uint256[] memory actualAmountsOutWithBPT;
        uint256[] memory amountsOut = new uint256[](params.tokensOut.length);
        (amountIn, actualAmountsOutWithBPT) = _queryExit(inputs.poolTokensOutWithBPT, inputs.poolTokenAmountsOutWithBPT, userData);
        for (uint256 i = 1; i < actualAmountsOutWithBPT.length; ++i) {
            if (actualAmountsOutWithBPT[i] < inputs.poolTokenAmountsOutWithBPT[i]) revert EXIT_BELOW_MIN();
            amountsOut[i - 1] = actualAmountsOutWithBPT[i];
        }

        // Burn the user's LRT and the underlying BPT.
        _burn(msg.sender, params.amountIn, IBurnableBPT(pool));

        // Send available cash to the user and queue the remainder as 'owed shares'.
        (uint256[] memory cash, uint256[] memory shares) = _processTokenWithdrawals(
            msg.sender, inputs.poolTokensOut, amountsOut, params.requiresUnwrap
        );

        emit RequestedExitAllTokensExactIn(msg.sender, params.tokensOut, cash, shares, amountIn);
    }

    // forgefmt: disable-next-item
    /// @notice Requests an exit to an exact amount of each token, and burns an estimated but
    /// unknown (computed at run time) amount of LRT.
    /// @param params The parameters required to exit to an exact amount of all output tokens
    /// with an amount of LRT.
    function requestExitTokensExactOut(ExitTokensExactOutParams calldata params) external returns (uint256 amountIn) {
        address pool = poolId.toPoolAddress();

        // Simulate exit from the underlying pool.
        ExitPoolInputs memory inputs = _prepareExitPoolInputs(
            params.tokensOut, params.amountsOut, params.requiresUnwrap, pool, 0
        );
        bytes memory userData = abi.encode(ExitKind.BPT_IN_FOR_EXACT_TOKENS_OUT, inputs.poolTokenAmountsOut, params.maxAmountIn);
        (amountIn,) = _queryExit(inputs.poolTokensOutWithBPT, inputs.poolTokenAmountsOutWithBPT, userData);
        if (amountIn > params.maxAmountIn) revert EXIT_ABOVE_MAX();

        // Burn the user's LRT and the underlying BPT.
        _burn(msg.sender, amountIn, IBurnableBPT(pool));

        // Send available cash to the user and queue the remainder as 'owed shares'.
        (uint256[] memory cash, uint256[] memory shares) = _processTokenWithdrawals(
            msg.sender, inputs.poolTokensOut, inputs.poolTokenAmountsOut, params.requiresUnwrap
        );

        emit RequestedExitTokensExactOut(msg.sender, params.tokensOut, cash, shares, amountIn);
    }

    /// @notice Add an underlying token to the LRT.
    /// @param token The token to add.
    /// @param amount The amount of the token to add.
    /// @param weight The normalized weight of the token to add.
    /// @param strategy The token's EigenLayer strategy contract.
    /// @param targetAUMPercentage The target AUM percentage for the token.
    function addToken(address token, uint256 amount, uint256 weight, address strategy, uint64 targetAUMPercentage)
        external
        onlyOwner
    {
        // Ensure the token has a wrapper, if needed.
        if (strategy.code.length > 0 && token != IStrategy(strategy).underlyingToken() && !_hasWrapper(token)) {
            revert WRAPPER_MISSING();
        }

        // Setup the wrapper, if needed.
        if (_hasWrapper(token)) _setup(token);

        // Allow the Balancer vault to pull the token.
        IERC20(token).safeApprove(address(vault), type(uint256).max);

        // Set the asset management information.
        assetManager.setStrategy(token, strategy);
        assetManager.setTargetAUMPercentage(token, targetAUMPercentage);

        // Forward the token to the asset manager for deposit.
        IERC20(token).safeTransferFrom(msg.sender, address(assetManager), amount);

        // Determine the mint amount, add the token to the underlying pool, make the initial deposit,
        // and set the token's configuration.
        uint256 supply = pool.getActualSupply();
        uint256 amountToMint = supply.mulDiv(weight, FixedPointMathLib.WAD - weight);

        pool.addToken(token, address(assetManager), weight, amountToMint, msg.sender);
        assetManager.enableManagementAndDeposit(token, amount);

        emit TokenAdded(token, amount);
    }

    /// @notice Remove an underlying token from the LRT.
    /// @param token The token to remove.
    function removeToken(address token) external onlyOwner {
        // Revoke the Balancer vault's ability to pull the token.
        IERC20(token).safeApprove(address(vault), 0);

        // Teardown the wrapper, if needed.
        if (_hasWrapper(token)) _teardown(token);

        // Remove the asset management information.
        assetManager.setStrategy(token, address(0));
        assetManager.setTargetAUMPercentage(token, 0);

        bytes32 _poolId = poolId;
        (address[] memory tokens,,) = vault.getPoolTokens(_poolId);
        uint256[] memory weights = pool.getNormalizedWeights();

        // `weights` does not contain the BPT, so we need to offset by one.
        uint256 weight;
        for (uint256 i = 1; i < tokens.length; ++i) {
            if (tokens[i] != token) {
                continue;
            }
            weight = weights[i - 1];
            break;
        }
        if (weight > MIN_WEIGHT) revert TOKEN_WEIGHT_TOO_HIGH_FOR_REMOVAL();

        // Process the final withdrawal, if needed, and remove the token from the pool.
        // Rather than burning BPT, we leave it to the owner to exchange any remaining
        // about for supported tokens and donate them to the pool. The amount should be minimal
        // due to the near-zero weight.
        (uint256 remainingBalance,,,) = vault.getPoolTokenInfo(_poolId, token);
        if (remainingBalance > 0) {
            assetManager.withdrawRemainingBalance(token, remainingBalance, msg.sender);
        }
        pool.removeToken(token, 0, address(0));

        emit TokenRemoved(token, remainingBalance);
    }

    /// @notice Sets the security daemon's wallet to a new account (`newSecurityDaemon`).
    /// @param newSecurityDaemon The new security daemon wallet address.
    function setSecurityDaemon(address newSecurityDaemon) external onlyOwnerOrSecurityCouncil {
        securityDaemon = newSecurityDaemon;

        emit SecurityDaemonChanged(newSecurityDaemon);
    }

    /// @notice Burns the given amount of LRT from the `msg.sender` and an equal amount
    /// of BPT from this contract.
    /// @param amount The amount of LRT to burn.
    function burnLRT(uint256 amount) external {
        _burn(msg.sender, amount, IBurnableBPT(poolId.toPoolAddress()));
    }

    // forgefmt: disable-next-item
    /// @dev Join the Balancer pool with the given assets and amounts, and return the amount of BPT received.
    /// @param assets The assets to join with.
    /// @param maxAmountsIn The maximum amounts of each asset to join with.
    /// @param userData The encoded join pool user data.
    function _join(address[] memory assets, uint256[] memory maxAmountsIn, bytes memory userData) internal returns (uint256) {
        bytes32 _poolId = poolId;

        IERC20 pool = IERC20(_poolId.toPoolAddress());
        uint256 balanceBefore = pool.balanceOf(address(this));

        IVault.JoinPoolRequest memory request = IVault.JoinPoolRequest({
            assets: assets,
            maxAmountsIn: maxAmountsIn,
            fromInternalBalance: false,
            userData: userData
        });
        vault.joinPool{ value: msg.value }(_poolId, address(this), address(this), request);

        return pool.balanceOf(address(this)) - balanceBefore;
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
            assets: assets,
            minAmountsOut: minAmountsOut,
            toInternalBalance: false,
            userData: userData
        });
        (amountIn, amountsOut) = balancerQueries.queryExit(poolId, address(this), address(this), request);
    }

    /// @dev Initializes the Balancer pool with the given assets and amounts.
    /// @param params The parameters required to initialize the pool.
    /// @param recipient The recipient of the LRT.
    function _initialize(InitializeParams calldata params, address recipient) internal returns (uint256 amountOut) {
        for (uint256 i = 0; i < params.tokensIn.length; ++i) {
            address token = params.tokensIn[i];
            uint256 amount = params.amountsIn[i];
            address strategy = params.strategies[i];
            uint64 targetAUMPercentage = params.targetAUMPercentages[i];

            // Allow the Balancer vault to pull the token.
            IERC20(token).safeApprove(address(vault), type(uint256).max);

            // Setup the wrapper, if needed.
            if (_hasWrapper(token)) _setup(token);

            // Set the asset management information.
            assetManager.setStrategy(token, strategy);
            assetManager.setTargetAUMPercentage(token, targetAUMPercentage);

            emit TokenAdded(token, amount);
        }

        bytes memory userData = abi.encode(JoinKind.INIT, params.amountsIn);
        amountOut = _join(
            params.tokensIn.prepend(poolId.toPoolAddress()), params.amountsIn.prepend(type(uint256).max), userData
        );

        // Mint LRT to the provided `recipient`.
        restakingToken.mint(recipient, amountOut);
    }

    // forgefmt: disable-next-item
    /// @dev Prepares the input for a single token join.
    /// @param tokenIn The input token.
    /// @param amountIn The amount of the input token.
    /// @param requiresWrap Whether the input token requires wrapping.
    function _prepareJoinPoolInput(address tokenIn, uint256 amountIn, bool requiresWrap) internal returns (JoinPoolInput memory) {
        // Wrap the input token, if needed.
        if (requiresWrap && tokenIn != address(0)) {
            (tokenIn, amountIn) = _wrap(tokenIn, amountIn);
        }

        (address[] memory tokens,,) = vault.getPoolTokens(poolId);
        uint256 tokenIndex = _findTokenIndex(tokens, tokenIn);

        // Used to overwrite WETH with ETH, which can be handled natively by Balancer.
        tokens[tokenIndex] = tokenIn;

        uint256[] memory maxAmountsIn = new uint256[](tokens.length);
        maxAmountsIn[tokenIndex] = amountIn;

        return JoinPoolInput(tokens, maxAmountsIn, tokenIndex, tokenIn, amountIn);
    }

    /// @dev Prepends the BPT to the given tokens and amounts, and wraps the tokens, if needed,
    /// returning the new tokens and amounts required to join the underlying pool.
    /// @param tokensIn The raw input tokens, which may require wrapping.
    /// @param amountsIn The amounts of each token.
    /// @param requiresWrap Whether each token requires wrapping.
    /// @param bpt The BPT contract address.
    /// @param amountBPT The amount of BPT to prepend.
    function _prepareJoinPoolInputs(
        address[] memory tokensIn,
        uint256[] memory amountsIn,
        bool[] memory requiresWrap,
        address bpt,
        uint256 amountBPT
    ) internal returns (JoinPoolInputs memory) {
        address[] memory tokensInWithBPT = new address[](tokensIn.length + 1);
        uint256[] memory amountsInWithBPT = new uint256[](amountsIn.length + 1);

        // Prepend the BPT.
        tokensInWithBPT[0] = bpt;
        amountsInWithBPT[0] = amountBPT;

        for (uint256 i = 0; i < tokensIn.length; ++i) {
            // Wrap the tokens, if needed.
            // `address(0)` indicates ETH, which is wrapped automatically by Balancer.
            if (requiresWrap[i] && tokensIn[i] != address(0)) {
                (tokensIn[i], amountsIn[i]) = _wrap(tokensIn[i], amountsIn[i]);
            }
            tokensInWithBPT[i + 1] = tokensIn[i];
            amountsInWithBPT[i + 1] = amountsIn[i];
        }
        return JoinPoolInputs(tokensInWithBPT, amountsInWithBPT, tokensIn, amountsIn);
    }

    // forgefmt: disable-next-item
    /// @dev Prepares the input for a single token exit.
    /// @param poolId_ The underlying Balancer pool ID.
    /// @param tokenOut The output token.
    /// @param amountOut The amount of the output token.
    /// @param requiresUnwrap Whether the output token requires unwrapping.
    function _prepareExitPoolInput(bytes32 poolId_, address tokenOut, uint256 amountOut, bool requiresUnwrap) internal view returns (ExitPoolInput memory) {
        // Preview the amount of wrapped tokens to exit, if needed.
        if (requiresUnwrap && tokenOut != address(0)) {
            (tokenOut, amountOut) = _previewWrap(tokenOut, amountOut);
        }

        (address[] memory tokens,,) = vault.getPoolTokens(poolId_);
        uint256 tokenIndex = _findTokenIndex(tokens, tokenOut);

        // Used to overwrite WETH with ETH, which can be handled natively by Balancer.
        tokens[tokenIndex] = tokenOut;

        uint256[] memory minAmountsOut = new uint256[](tokens.length);
        minAmountsOut[tokenIndex] = amountOut;

        return ExitPoolInput(tokens, minAmountsOut, tokenIndex, tokenOut, amountOut);
    }

    /// @dev Prepends the BPT to the given tokens and amounts, and calculates the wrapped
    /// token amounts that will be used to exit the underlying pool, if needed, returning
    /// the tokens and amounts required.
    /// @param tokensOut The raw output tokens, which may require unwrapping.
    /// @param amountsOut The amounts of each token.
    /// @param requiresUnwrap Whether each token requires unwrapping later on.
    /// @param bpt The BPT contract address.
    /// @param amountBPT The amount of BPT to prepend.
    function _prepareExitPoolInputs(
        address[] memory tokensOut,
        uint256[] memory amountsOut,
        bool[] memory requiresUnwrap,
        address bpt,
        uint256 amountBPT
    ) internal view returns (ExitPoolInputs memory) {
        address[] memory tokensOutWithBPT = new address[](tokensOut.length + 1);
        uint256[] memory amountsOutWithBPT = new uint256[](amountsOut.length + 1);

        // Prepend the BPT.
        tokensOutWithBPT[0] = bpt;
        amountsOutWithBPT[0] = amountBPT;

        for (uint256 i = 0; i < tokensOut.length; ++i) {
            // Determine the amount of wrapped tokens to exit, if needed.
            // `address(0)` indicates ETH, which is handled automatically by Balancer.
            if (requiresUnwrap[i] && tokensOut[i] != address(0)) {
                (tokensOut[i], amountsOut[i]) = _previewWrap(tokensOut[i], amountsOut[i]);
            }
            tokensOutWithBPT[i + 1] = tokensOut[i];
            amountsOutWithBPT[i + 1] = amountsOut[i];
        }
        return ExitPoolInputs(tokensOutWithBPT, amountsOutWithBPT, tokensOut, amountsOut);
    }

    // forgefmt: disable-next-item
    /// @notice Processes withdrawal requests for a list of tokens and amounts.
    /// @param withdrawer The account requesting the withdrawal.
    /// @param token The token to withdraw.
    /// @param amountOut The amount to be withdrawn.
    /// @param requiresUnwrap Whether each token requires unwrapping.
    function _processTokenWithdrawal(address withdrawer, address token, uint256 amountOut, bool requiresUnwrap) internal returns (uint256 cash, uint256 shares) {
        if (amountOut == 0) return (0, 0);

        address poolToken = token == address(0) ? weth : token;
        (cash, shares) = assetManager.pullCashAndCalculateShareDebt(poolToken, amountOut);
        if (shares > 0) {
            withdrawalQueue.queueWithdrawal(withdrawer, poolToken, SafeCast.toUint112(shares));
        }
        if (cash > 0) {
            if (token == address(0)) {
                IWETH(weth).withdraw(cash);
            } else if (requiresUnwrap) {
                (token, cash) = _unwrap(token, cash);
            }
            _sendAsset(token, withdrawer, cash);
        }
    }

    /// @notice Processes withdrawal requests for a list of tokens and amounts.
    /// @param withdrawer The account requesting the withdrawal.
    /// @param tokens The list of token addresses for withdrawal.
    /// @param amountsOut The amounts to be withdrawn for each token.
    /// @param requiresUnwrap Whether each token requires unwrapping.
    function _processTokenWithdrawals(
        address withdrawer,
        address[] memory tokens,
        uint256[] memory amountsOut,
        bool[] memory requiresUnwrap
    ) internal returns (uint256[] memory cash, uint256[] memory shares) {
        uint256 length = tokens.length;

        cash = new uint256[](length);
        shares = new uint256[](length);
        for (uint256 i = 0; i < length; ++i) {
            (cash[i], shares[i]) = _processTokenWithdrawal(withdrawer, tokens[i], amountsOut[i], requiresUnwrap[i]);
        }
    }

    /// @dev Burns the given amount of LRT from the provided address and an
    /// equal amount of BPT from this contract.
    /// @param from The address to burn LRT from.
    /// @param amount The amount of LRT to burn.
    /// @param bpt The BPT contract to burn from.
    function _burn(address from, uint256 amount, IBurnableBPT bpt) internal {
        restakingToken.burn(from, amount);
        bpt.burn(amount);
    }

    /// @dev Pulls the exact amount of the given token from the `msg.sender`.
    /// @param token The token to pull.
    /// @param amount The amount of the token to pull.
    function _pullToken(address token, uint256 amount) internal {
        if (amount == 0 || token == address(0)) {
            return;
        }
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
    }

    /// @dev Pulls the exact amounts of the given tokens from the `msg.sender`.
    /// @param tokens The tokens to pull.
    /// @param amounts The amounts of each token to pull.
    function _pullTokens(address[] calldata tokens, uint256[] calldata amounts) internal {
        uint256 tokenCount = tokens.length;
        for (uint256 i = 0; i < tokenCount; ++i) {
            _pullToken(tokens[i], amounts[i]);
        }
    }

    /// @dev Calculates the excess amount of the given asset in this contract and
    /// sends it to the caller, returning the amount of excess.
    /// @param asset The asset to calculate the excess of (`address(0)` for ETH).
    /// @param requiresUnwrap Whether the asset requires unwrapping.
    function _calculateAndRefundExcess(address asset, bool requiresUnwrap) internal returns (uint256 excess) {
        excess = _getAssetBalance(asset);
        if (excess > 0) {
            if (asset != address(0) && requiresUnwrap) {
                (asset, excess) = _unwrap(asset, excess);
            }
            _sendAsset(asset, msg.sender, excess);
        }
    }

    /// @dev Returns the balance of the given asset in this contract.
    /// @param asset The asset to check the balance of (`address(0)` for ETH`).
    function _getAssetBalance(address asset) internal view returns (uint256) {
        if (asset == address(0)) {
            return address(this).balance;
        }
        return IERC20(asset).balanceOf(address(this));
    }

    /// @dev Sends the given amount of the given asset to the given address.
    /// @param asset The asset to send (`address(0)` for ETH).
    /// @param to The address to send the asset to.
    /// @param amount The amount of the asset to send.
    function _sendAsset(address asset, address to, uint256 amount) internal {
        if (asset == address(0)) {
            (bool success,) = to.call{value: amount, gas: 10_000}('');
            if (!success) {
                revert ETH_TRANSFER_FAILED();
            }
            return;
        }
        IERC20(asset).safeTransfer(to, amount);
    }

    /// @dev Returns the index of the given token in the given array. This function expects
    /// BPT at index 0, so it begins the search at index 1.
    /// @param tokens The array of tokens to search.
    /// @param token The token to search for.
    function _findTokenIndex(address[] memory tokens, address token) internal view returns (uint256) {
        // ETH is always treated as WETH for comparisons in the pool.
        if (token == address(0)) token = weth;

        uint256 tokensLength = tokens.length;
        for (uint256 i = 1; i < tokensLength; ++i) {
            if (tokens[i] == token) {
                return i;
            }
        }
        revert INVALID_TOKEN();
    }

    /// @dev Ensures that the provided input lengths match.
    /// @param a The first input length.
    /// @param b The second input length.
    /// @param c The third input length.
    function _ensureInputLengthMatch(uint256 a, uint256 b, uint256 c) internal pure {
        if (a != b || a != c) revert INPUT_LENGTH_MISMATCH();
    }

    /// @dev Function to receive ETH from the Balancer Vault or WETH.
    receive() external payable {
        if (msg.sender != address(vault) && msg.sender != weth) revert ONLY_VAULT_OR_WETH();
    }
}
