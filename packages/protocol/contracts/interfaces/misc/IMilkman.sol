// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

interface IMilkman {
    /// @notice Asynchronously swap an exact amount of tokenIn for a market-determined amount of tokenOut.
    /// @dev Swaps are usually completed in ~2 minutes.
    /// @param amountIn The number of tokens to sell.
    /// @param fromToken The token that the user wishes to sell.
    /// @param toToken The token that the user wishes to receive.
    /// @param to Who should receive the tokens.
    /// @param priceChecker A contract that verifies an order (mainly its minOut and fee) before Milkman signs it.
    /// @param priceCheckerData Data that gets passed to the price checker.
    /// @return orderContract Returns the address of the order contract that was created to execute the swap.
    function requestSwapExactTokensForTokens(
        uint256 amountIn,
        address fromToken,
        address toToken,
        address to,
        address priceChecker,
        bytes calldata priceCheckerData
    ) external returns (address orderContract);

    /// @notice Cancel a requested swap, sending the tokens back to the order creator.
    /// @dev `msg.sender` must be the original order creator. The other parameters are required to verify that this is the case (kind of like a merkle proof).
    function cancelSwap(
        uint256 amountIn,
        address fromToken,
        address toToken,
        address to,
        address priceChecker,
        bytes calldata priceCheckerData
    ) external;
}
