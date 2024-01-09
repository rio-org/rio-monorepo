// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

// forgefmt: disable-next-line
import {ERC20VotesUpgradeable} from '@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20VotesUpgradeable.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {UUPSUpgradeable} from '@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol';
import {IRioLRT} from 'contracts/interfaces/IRioLRT.sol';

contract RioLRT is IRioLRT, ERC20VotesUpgradeable, OwnableUpgradeable, UUPSUpgradeable {
    /// @notice The liquid restaking token gateway.
    address public gateway;

    /// @notice Require that the caller is the LRT gateway.
    modifier onlyGateway() {
        if (msg.sender != gateway) revert ONLY_LRT_GATEWAY();
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
    /// @param gateway_ The liquid restaking token gateway.
    function initialize(address initialOwner, string memory name, string memory symbol, address gateway_) external initializer {
        __UUPSUpgradeable_init();
        __ERC20_init(name, symbol);
        __ERC20Permit_init(name);
        __ERC20Votes_init();

        _transferOwnership(initialOwner);

        gateway = gateway_;
    }

    /// @notice Mint `amount` tokens to the specified address.
    /// @param to The address to mint tokens to.
    /// @param amount The amount of tokens to mint.
    function mint(address to, uint256 amount) external override onlyGateway {
        _mint(to, amount);
    }

    /// @notice Burn `amount` tokens from the specified address.
    /// @param from The address to burn tokens from.
    /// @param amount The amount of tokens to burn.
    function burn(address from, uint256 amount) external override onlyGateway {
        _burn(from, amount);
    }

    /// @dev Allows the owner to upgrade the LRT implementation.
    /// @param newImplementation The implementation to upgrade to.
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
