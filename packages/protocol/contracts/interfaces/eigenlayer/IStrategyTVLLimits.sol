// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.23;

import {IStrategy} from 'contracts/interfaces/eigenlayer/IStrategy.sol';

interface IStrategyTVLLimits is IStrategy {
    /// @notice Sets the maximum deposits (in underlyingToken) that this strategy will hold and accept per deposit
    /// @param newMaxTotalDeposits The new maximum deposits
    /// @dev Callable only by the unpauser of this contract
    /// @dev We note that there is a potential race condition between a call to this function that lowers either or both of these limits and call(s)
    /// to `deposit`, that may result in some calls to `deposit` reverting.
    function setTVLLimits(uint256 newMaxPerDeposit, uint256 newMaxTotalDeposits) external;
}
