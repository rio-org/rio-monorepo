// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

/// @dev Interface for the TemporarilyPausable helper.
interface ITemporarilyPausable {
    /// @dev Emitted every time the pause state changes by `_setPaused`.
    event PausedStateChanged(bool paused);

    /// @dev Returns the current paused state.
    function getPausedState()
        external
        view
        returns (bool paused, uint256 pauseWindowEndTime, uint256 bufferPeriodEndTime);
}
