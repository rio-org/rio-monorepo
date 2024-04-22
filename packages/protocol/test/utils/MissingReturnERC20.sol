// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

contract MissingReturnERC20 {
    event Approval(address indexed src, address indexed guy, uint256 wad);
    event Transfer(address indexed src, address indexed dst, uint256 wad);

    uint8 public constant decimals = 18;

    string public name;
    string public symbol;

    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor(string memory name_, string memory symbol_) {
        name = name_;
        symbol = symbol_;

        totalSupply = 1_000_000 * 10 ** decimals;
        balanceOf[msg.sender] = totalSupply;

        emit Transfer(address(0), msg.sender, totalSupply);
    }

    function transfer(address dst, uint256 wad) external {
        transferFrom(msg.sender, dst, wad);
    }

    function transferFrom(address src, address dst, uint256 wad) public {
        require(balanceOf[src] >= wad, 'insufficient-balance');
        if (src != msg.sender && allowance[src][msg.sender] != type(uint256).max) {
            require(allowance[src][msg.sender] >= wad, 'insufficient-allowance');
            allowance[src][msg.sender] -= wad;
        }
        balanceOf[src] -= wad;
        balanceOf[dst] += wad;

        emit Transfer(src, dst, wad);
    }

    function approve(address usr, uint256 wad) external {
        allowance[msg.sender][usr] = wad;
        emit Approval(msg.sender, usr, wad);
    }
}
