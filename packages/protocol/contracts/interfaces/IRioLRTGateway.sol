// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

interface IRioLRTGateway {
    /// @notice Balancer weighted pool join types.
    enum JoinKind {
        INIT,
        EXACT_TOKENS_IN_FOR_BPT_OUT,
        TOKEN_IN_FOR_EXACT_BPT_OUT,
        ALL_TOKENS_IN_FOR_EXACT_BPT_OUT
    }

    /// @notice Balancer weighted pool exit types.
    enum ExitKind {
        EXACT_BPT_IN_FOR_ONE_TOKEN_OUT,
        EXACT_BPT_IN_FOR_TOKENS_OUT,
        BPT_IN_FOR_EXACT_TOKENS_OUT
    }

    /// @notice The parameters required to initialize the pool.
    struct InitializeParams {
        address[] tokensIn;
        uint256[] amountsIn;
        address[] strategies;
        uint64[] targetAUMPercentages;
    }

    /// @notice The parameters required to join with exact token amounts.
    struct JoinTokensExactInParams {
        address[] tokensIn;
        uint256[] amountsIn;
        bool[] requiresWrap;
        uint256 minAmountOut;
    }

    /// @notice The parameters required to join with a single input token and
    /// an exact output amount.
    struct JoinTokenExactOutParams {
        address tokenIn;
        uint256 maxAmountIn;
        bool requiresWrap;
        uint256 amountOut;
    }

    /// @notice The parameters required to join with all input tokens and
    /// an exact output amount.
    struct JoinAllTokensExactOutParams {
        address[] tokensIn;
        uint256[] maxAmountsIn;
        bool[] requiresWrap;
        uint256 amountOut;
    }

    /// @notice The parameters required to exit an exact LRT amount for a
    /// single output token.
    struct ExitTokenExactInParams {
        address tokenOut;
        uint256 minAmountOut;
        bool requiresUnwrap;
        uint256 amountIn;
    }

    /// @notice The parameters required to exit an exact LRT amount for all
    /// output tokens.
    struct ExitAllTokensExactInParams {
        address[] tokensOut;
        uint256[] minAmountsOut;
        bool[] requiresUnwrap;
        uint256 amountIn;
    }

    /// @notice The parameters required to exit with an exact output amount
    /// for each token, specifying the maximum LRT amount to exit.
    struct ExitTokensExactOutParams {
        address[] tokensOut;
        uint256[] amountsOut;
        bool[] requiresUnwrap;
        uint256 maxAmountIn;
    }

    /// @notice The parameters required to join the underlying pool with a single token.
    struct JoinPoolInput {
        address[] poolTokensInWithBPT;
        uint256[] poolTokenAmountsInWithBPT;
        uint256 poolTokenIndex;
        address poolTokenIn;
        uint256 poolTokenAmountIn;
    }

    /// @notice The parameters required to join the underlying pool with one or more tokens.
    struct JoinPoolInputs {
        address[] poolTokensInWithBPT;
        uint256[] poolTokenAmountsInWithBPT;
        address[] poolTokensIn;
        uint256[] poolTokenAmountsIn;
    }

    /// @notice The parameters required to exit the underlying pool to a single token.
    struct ExitPoolInput {
        address[] poolTokensOutWithBPT;
        uint256[] poolTokenAmountsOutWithBPT;
        uint256 poolTokenIndex;
        address poolTokenOut;
        uint256 poolTokenAmountOut;
    }

    /// @notice The parameters required to exit the underlying pool to one or more tokens.
    struct ExitPoolInputs {
        address[] poolTokensOutWithBPT;
        uint256[] poolTokenAmountsOutWithBPT;
        address[] poolTokensOut;
        uint256[] poolTokenAmountsOut;
    }

    /// @notice Thrown when the provided input does not match the expected length.
    error INPUT_LENGTH_MISMATCH();

    /// @notice Thrown when the output token amount is below the minimum.
    error EXIT_BELOW_MIN();

    /// @notice Thrown when the input token amount is above the maximum.
    error EXIT_ABOVE_MAX();

    /// @notice Thrown when the provided token is not in the pool.
    error INVALID_TOKEN();

    /// @notice Thrown when the pool token doesn't match the underlying token and
    /// the token does not have a wrapper.
    error WRAPPER_MISSING();

    /// @notice Thrown when attempting to remove a token with a weight that is above the minimum.
    error TOKEN_WEIGHT_TOO_HIGH_FOR_REMOVAL();

    /// @notice Thrown when the ETH sender is not the Balancer Vault contract or the WETH contract.
    error ONLY_VAULT_OR_WETH();

    /// @notice Thrown when an ETH transfer fails.
    error ETH_TRANSFER_FAILED();

    /// @notice Emitted when the security daemon's wallet is updated by the owner or the security council.
    /// @param newSecurityDaemon The new security daemon wallet address.
    event SecurityDaemonChanged(address newSecurityDaemon);

    /// @notice Emitted when a token is added to the pool.
    /// @param token The token that was added.
    /// @param amountAdded The amount of tokens that were added.
    event TokenAdded(address indexed token, uint256 amountAdded);

    /// @notice Emitted when a token is removed from the pool.
    /// @param token The token that was removed.
    /// @param amountRemoved The amount of tokens that were removed.
    event TokenRemoved(address indexed token, uint256 amountRemoved);

    /// @notice Emitted when a user joins the pool with the exact amounts of the provided
    /// tokens, and mints an estimated but unknown (computed at run time) amount of LRT.
    /// @param user The user who joined the pool.
    /// @param tokensIn The tokens that were deposited.
    /// @param amountsIn The amounts of tokens that were deposited.
    /// @param amountOut The amount of LRT minted.
    event JoinedTokensExactIn(address indexed user, address[] tokensIn, uint256[] amountsIn, uint256 amountOut);

    /// @notice Emitted when a user joins the pool with an estimated but unknown (computed at run time)
    /// amount of a single token, and mints an exact amount of LRT.
    /// @param user The user who joined the pool.
    /// @param tokenIn The token that was deposited.
    /// @param amountIn The amount of the token that was deposited.
    /// @param amountOut The amount of LRT minted.
    event JoinedTokenExactOut(address indexed user, address tokenIn, uint256 amountIn, uint256 amountOut);

    /// @notice Emitted when a user joins the pool with an estimated but unknown (computed at run time)
    /// amount of each token, and mints an exact amount of LRT.
    /// @param user The user who joined the pool.
    /// @param tokensIn The tokens that were deposited.
    /// @param amountsIn The amounts of tokens that were deposited.
    /// @param amountOut The amount of LRT minted.
    event JoinedAllTokensExactOut(address indexed user, address[] tokensIn, uint256[] amountsIn, uint256 amountOut);

    /// @notice Emitted when a user requests an exit to an estimated but unknown (computed at run time)
    /// amount of a single token, and burns an exact amount of LRT.
    /// @param user The user who requested the exit.
    /// @param tokenOut The token that was requested.
    /// @param amountOut The amount of the token that was exited immediately.
    /// @param sharesOwed The amount of EigenLayer shares owed to the user.
    /// @param amountIn The amount of LRT burned.
    event RequestedExitTokenExactIn(
        address indexed user, address tokenOut, uint256 amountOut, uint256 sharesOwed, uint256 amountIn
    );

    /// @notice Emitted when a user requests an exit to an estimated but unknown (computed at run time)
    /// amount of each token, and burns an exact amount of LRT.
    /// @param user The user who requested the exit.
    /// @param tokensOut The tokens that were requested.
    /// @param amountsOut The amounts of tokens that were exited immediately.
    /// @param sharesOwed The amount of EigenLayer shares owed to the user.
    /// @param amountIn The amount of LRT burned.
    event RequestedExitAllTokensExactIn(
        address indexed user, address[] tokensOut, uint256[] amountsOut, uint256[] sharesOwed, uint256 amountIn
    );

    /// @notice Emitted when a user requests an exit to an exact amount of each token, and burns an estimated but
    /// unknown (computed at run time) amount of LRT.
    /// @param user The user who requested the exit.
    /// @param tokensOut The tokens that were requested.
    /// @param amountsOut The amounts of tokens that were exited immediately.
    /// @param sharesOwed The amount of EigenLayer shares owed to the user.
    /// @param amountIn The amount of LRT burned.
    event RequestedExitTokensExactOut(
        address indexed user, address[] tokensOut, uint256[] amountsOut, uint256[] sharesOwed, uint256 amountIn
    );

    /// @notice The underlying Balancer pool ID.
    function poolId() external view returns (bytes32);

    /// @notice The security daemon's wallet, which is controlled by the security council and owner.
    /// The security daemon is responsible for removal of duplicate or invalid validator keys.
    function securityDaemon() external view returns (address);

    /// @notice Initializes the liquid restaking token gateway.
    /// @param initialOwner The initial owner of the contract.
    /// @param poolId The underlying Balancer pool ID.
    /// @param restakingToken The liquid restaking token (LRT).
    /// @param assetManager The contract in charge of managing the LRT's assets.
    /// @param withdrawalQueue The contract used to queue and process withdrawals.
    /// @param securityCouncil The address of the DAO-managed security council.
    /// @param allowedLPs The addresses of the LPs that are allowed to join the pool.
    /// @param params The parameters required to initialize the pool.
    function initialize(
        address initialOwner,
        bytes32 poolId,
        address restakingToken,
        address assetManager,
        address withdrawalQueue,
        address securityCouncil,
        address[] calldata allowedLPs,
        InitializeParams calldata params
    ) external returns (uint256);

    /// @notice Joins the pool with the exact amounts of the provided tokens,
    /// and mints an estimated but unknown (computed at run time) amount of LRT.
    /// @param params The parameters required to join with exact token amounts.
    function joinTokensExactIn(JoinTokensExactInParams calldata params) external payable returns (uint256 amountOut);

    /// @notice Joins the pool with an estimated but unknown (computed at run time)
    /// amount of a single token, and mints an exact amount of LRT.
    /// @param params The parameters required to join with a single input token and
    /// an exact output amount.
    function joinTokenExactOut(JoinTokenExactOutParams calldata params) external payable returns (uint256 amountOut);

    /// @notice Joins the pool with an estimated but unknown (computed at run time)
    /// amount of each token, and mints an exact amount of LRT.
    /// @param params The parameters required to join with all input tokens and
    /// an exact output amount.
    function joinAllTokensExactOut(JoinAllTokensExactOutParams calldata params)
        external
        payable
        returns (uint256 amountOut);

    /// @notice Requests an exit to an estimated but unknown (computed at run time)
    /// amount of a single token, and burns an exact amount of LRT.
    /// @param params The parameters required to exit to a single output token
    /// with an exact amount of LRT.
    function requestExitTokenExactIn(ExitTokenExactInParams calldata params) external returns (uint256 amountIn);

    /// @notice Requests an exit to an estimated but unknown (computed at run time)
    /// amount of each token, and burns an exact amount of LRT.
    /// @param params The parameters required to exit to all output tokens
    /// with an exact amount of LRT.
    function requestExitAllTokensExactIn(ExitAllTokensExactInParams calldata params)
        external
        returns (uint256 amountIn);

    /// @notice Requests an exit to an exact amount of each token, and burns an estimated but
    /// unknown (computed at run time) amount of LRT.
    /// @param params The parameters required to exit to an exact amount of all output tokens
    /// with an amount of LRT.
    function requestExitTokensExactOut(ExitTokensExactOutParams calldata params) external returns (uint256 amountIn);

    /// @notice Burns the given amount of LRT from the `msg.sender` and an equal amount
    /// of BPT from this contract.
    /// @param amount The amount of LRT to burn.
    function burnLRT(uint256 amount) external;
}
