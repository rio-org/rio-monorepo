// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {ERC20} from '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import {ERC20Permit} from '@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol';
import {ERC20Votes} from '@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol';
import {Nonces} from '@openzeppelin/contracts/utils/Nonces.sol';

contract RioToken is ERC20, ERC20Permit, ERC20Votes {
    /// @param to The address to mint the initial supply to.
    constructor(address to) ERC20('Rio Network Token', 'RN') ERC20Permit('Rio Network Token') {
        _mint(to, 1_000_000_000 * 10 ** decimals());
    }

    /// @notice Clock used for flagging checkpoints, overriden to implement timestamp based
    /// checkpoints (and voting).
    function clock() public view override returns (uint48) {
        return uint48(block.timestamp);
    }

    /// @notice Machine-readable description of the clock as specified in EIP-6372.
    function CLOCK_MODE() public pure override returns (string memory) {
        return 'mode=timestamp';
    }

    /// @notice Returns the current nonce for `owner`. This value must be
    /// included whenever a signature is generated for {permit}.
    /// @param owner The account to query the nonce for.
    function nonces(address owner) public view override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }

    /// @dev Transfers a `value` amount of tokens from `from` to `to`, or alternatively mints (or burns) if `from`
    /// (or `to`) is the zero address. In addition, this function moves voting power when tokens are transferred.
    /// @param from The origin address.
    /// @param to The destination address.
    /// @param value The amount of tokens to transfer.
    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Votes) {
        super._update(from, to, value);
    }
}
