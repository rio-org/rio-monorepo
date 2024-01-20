// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {ERC20Upgradeable} from '@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol';
import {ERC20VotesUpgradeable} from '@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol';
import {ERC20BurnableUpgradeable} from '@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol';
import {ERC20PermitUpgradeable} from '@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {UUPSUpgradeable} from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import {NoncesUpgradeable} from '@openzeppelin/contracts-upgradeable/utils/NoncesUpgradeable.sol';
import {IRioLRT} from 'contracts/interfaces/IRioLRT.sol';

contract RioLRT is IRioLRT, ERC20BurnableUpgradeable, ERC20PermitUpgradeable, ERC20VotesUpgradeable, OwnableUpgradeable, UUPSUpgradeable {
    /// @notice The liquid restaking token coordinator.
    address public coordinator;

    /// @notice Require that the caller is the LRT coordinator.
    modifier onlyCoordinator() {
        if (msg.sender != coordinator) revert ONLY_COORDINATOR();
        _;
    }

    /// @dev Prevent any future reinitialization.
    constructor() {
        _disableInitializers();
    }

    // forgefmt: disable-next-item
    /// @notice Initializes the contract.
    /// @param initialOwner The initial owner of the contract.
    /// @param name The name of the token.
    /// @param symbol The symbol of the token.
    /// @param coordinator_ The liquid restaking token coordinator.
    function initialize(address initialOwner, string memory name, string memory symbol, address coordinator_) external initializer {
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();

        __ERC20_init(name, symbol);
        __ERC20Permit_init(name);
        __ERC20Burnable_init();
        __ERC20Votes_init();

        coordinator = coordinator_;
    }

    /// @notice Mint `amount` tokens to the specified address.
    /// @param to The address to mint tokens to.
    /// @param amount The amount of tokens to mint.
    function mint(address to, uint256 amount) external onlyCoordinator {
        _mint(to, amount);
    }

    /// @notice Burn `amount` tokens from the `msg.sender`.
    /// @param amount The amount of tokens to burn.
    function burn(uint256 amount) public override(IRioLRT, ERC20BurnableUpgradeable) {
        super.burn(amount);
    }

    /// @notice Returns the amount of tokens in existence.
    function totalSupply() public view override(ERC20Upgradeable, IRioLRT) returns (uint256) {
        return super.totalSupply();
    }

    /// @notice Returns the remaining number of tokens that `spender` is allowed
    /// to spend on behalf of `owner`
    /// @param owner The account that owns the tokens.
    /// @param spender The account that can spend the tokens.
    /// @dev This function grants an infinite allowance to the LRT coordinator,
    /// which is an internal, trusted contract that pulls tokens on withdrawal.
    function allowance(address owner, address spender) public view override returns (uint256) {
        if (spender == coordinator) {
            return type(uint256).max;
        }
        return super.allowance(owner, spender);
    }

    /// @notice Returns the current nonce for `owner`. This value must be
    /// included whenever a signature is generated for {permit}.
    /// @param owner The account to query the nonce for.
    function nonces(address owner) public view override(ERC20PermitUpgradeable, NoncesUpgradeable) returns (uint256) {
        return super.nonces(owner);
    }

    /// @dev Transfers a `value` amount of tokens from `from` to `to`, or alternatively mints (or burns) if `from`
    /// (or `to`) is the zero address. In addition, this function moves voting power when tokens are transferred.
    /// @param from The origin address.
    /// @param to The destination address.
    /// @param value The amount of tokens to transfer.
    function _update(address from, address to, uint256 value) internal override(ERC20Upgradeable, ERC20VotesUpgradeable) {
        super._update(from, to, value);
    }

    /// @dev Allows the owner to upgrade the LRT implementation.
    /// @param newImplementation The implementation to upgrade to.
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
