// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {Script} from 'forge-std/Script.sol';

contract ScriptBase is Script {
    /// @dev The label for the deployer's private key.
    string private constant DEPLOYER_PRIVATE_KEY_LABEL = 'DEPLOYER_PRIVATE_KEY';

    /// @dev The label for the Ethereum POS deposit contract.
    string private constant ETH_POS_LABEL = 'ETH_POS_LABEL';

    /// @dev The label for the EigenLayer Strategy Manager address.
    string private constant STRATEGY_MANAGER_LABEL = 'STRATEGY_MANAGER';

    /// @dev The label for the EigenLayer Eigen Pod Manager address.
    string private constant EIGEN_POD_MANAGER_LABEL = 'EIGEN_POD_MANAGER';

    /// @dev The label for the EigenLayer Delegation Manager address.
    string private constant DELEGATION_MANAGER_LABEL = 'DELEGATION_MANAGER';

    /// @dev Addresses by chain ID and label.
    mapping(uint256 => mapping(string => address)) public ADDRESSES;

    /// @dev The deployer's private key.
    uint256 public deployerKey = vm.envUint(DEPLOYER_PRIVATE_KEY_LABEL);

    /// @dev The deployer's address.
    address public deployer = vm.addr(deployerKey);

    /// @dev The Ethereum POS deposit contract address.
    address public ethPOS;

    /// @dev The EigenLayer strategy manager address.
    address public strategyManager;

    /// @dev The EigenLayer Eigen Pod Manager address.
    address public eigenPodManager;

    /// @dev The EigenLayer Delegation Manager address.
    address public delegationManager;

    /// @dev A modifier that wraps a function with start and stop broadcast calls.
    modifier broadcast() {
        vm.startBroadcast(deployerKey);
        _;
        vm.stopBroadcast();
    }

    /// @dev Populates EigenLayer addresses.
    constructor() {
        // Mainnet
        ADDRESSES[1][ETH_POS_LABEL] = 0x00000000219ab540356cBB839Cbe05303d7705Fa;
        ADDRESSES[1][STRATEGY_MANAGER_LABEL] = 0x858646372CC42E1A627fcE94aa7A7033e7CF075A;
        ADDRESSES[1][EIGEN_POD_MANAGER_LABEL] = 0x91E677b07F7AF907ec9a428aafA9fc14a0d3A338;
        ADDRESSES[1][DELEGATION_MANAGER_LABEL] = 0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A;

        // Holesky
        ADDRESSES[17000][ETH_POS_LABEL] = 0x4242424242424242424242424242424242424242;
        ADDRESSES[17000][STRATEGY_MANAGER_LABEL] = 0xdfB5f6CE42aAA7830E94ECFCcAd411beF4d4D5b6;
        ADDRESSES[17000][EIGEN_POD_MANAGER_LABEL] = 0x30770d7E3e71112d7A6b7259542D1f680a70e315;
        ADDRESSES[17000][DELEGATION_MANAGER_LABEL] = 0xA44151489861Fe9e3055d95adC98FbD462B948e7;

        // Goerli
        ADDRESSES[5][ETH_POS_LABEL] = 0xff50ed3d0ec03aC01D4C79aAd74928BFF48a7b2b;
        ADDRESSES[5][STRATEGY_MANAGER_LABEL] = 0x8676bb5f792ED407a237234Fe422aC6ed3540055;
        ADDRESSES[5][EIGEN_POD_MANAGER_LABEL] = 0xa286b84C96aF280a49Fe1F40B9627C2A2827df41;
        ADDRESSES[5][DELEGATION_MANAGER_LABEL] = 0x1b7b8F6b258f95Cf9596EabB9aa18B62940Eb0a8;

        // Populate EigenLayer addresses for the current chain ID.
        ethPOS = ADDRESSES[block.chainid][ETH_POS_LABEL];
        strategyManager = ADDRESSES[block.chainid][STRATEGY_MANAGER_LABEL];
        eigenPodManager = ADDRESSES[block.chainid][EIGEN_POD_MANAGER_LABEL];
        delegationManager = ADDRESSES[block.chainid][DELEGATION_MANAGER_LABEL];
    }
}
