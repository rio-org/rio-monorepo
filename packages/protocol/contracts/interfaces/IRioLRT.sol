// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

interface IRioLRT {
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
    }

    /// @notice The parameters required to join with exact token amounts.
    struct JoinTokensExactInParams {
        address[] tokensIn;
        uint256[] amountsIn;
        uint256 minAmountOut;
    }

    /// @notice The parameters required to join with a single input token and
    /// an exact output amount.
    struct JoinTokenExactOutParams {
        address tokenIn;
        uint256 maxAmountIn;
        uint256 amountOut;
    }

    /// @notice The parameters required to join with all input tokens and
    /// an exact output amount.
    struct JoinAllTokensExactOutParams {
        address[] tokensIn;
        uint256[] maxAmountsIn;
        uint256 amountOut;
    }

    /// @notice The parameters required to exit an exact LRT amount for a
    /// single output token.
    struct QueueExitTokenExactInParams {
        address tokenOut;
        uint256 minAmountOut;
        uint256 amountIn;
    }

    /// @notice The parameters required to exit an exact LRT amount for all
    /// output tokens.
    struct QueueExitAllTokensExactInParams {
        address[] tokensOut;
        uint256[] minAmountsOut;
        uint256 amountIn;
    }

    /// @notice The parameters required to exit with an exact output amount
    /// for each token, specifying the maximum LRT amount to exit.
    struct QueueExitTokensExactOutParams {
        address[] tokensOut;
        uint256[] amountsOut;
        uint256 maxAmountIn;
    }

    /// @notice Thrown when the provided input does not match the expected length.
    error INPUT_LENGTH_MISMATCH();

    /// @notice Thrown when the provided token is not in the pool.
    error INVALID_TOKEN();

    /// @notice The LRT Balancer pool ID.
    function poolId() external view returns (bytes32);

    // forgefmt: disable-next-item
    /// @notice Initializes the liquid restaking token.
    /// @param initialOwner The initial owner of the contract.
    /// @param name The name of the token.
    /// @param symbol The symbol of the token.
    /// @param poolId The LRT Balancer pool ID.
    /// @param params The parameters required to initialize the pool.
    function initialize(address initialOwner, string calldata name, string calldata symbol, bytes32 poolId, InitializeParams calldata params) external returns (uint256);

    /// @notice Joins the pool with the exact amounts of the provided tokens,
    /// and mints an estimated but unknown (computed at run time) amount of LRT.
    /// @param params The parameters required to join with exact token amounts.
    function joinTokensExactIn(JoinTokensExactInParams calldata params) external returns (uint256 amountOut);

    /// @notice Joins the pool with an estimated but unknown (computed at run time)
    /// amount of a single token, and mints an exact amount of LRT.
    /// @param params The parameters required to join with a single input token and
    /// an exact output amount.
    function joinTokenExactOut(JoinTokenExactOutParams calldata params) external returns (uint256 amountOut);

    /// @notice Joins the pool with an estimated but unknown (computed at run time)
    /// amount of each token, and mints an exact amount of LRT.
    /// @param params The parameters required to join with all input tokens and
    /// an exact output amount.
    function joinAllTokensExactOut(JoinAllTokensExactOutParams calldata params) external returns (uint256 amountOut);
}
