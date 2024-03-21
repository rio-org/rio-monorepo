// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {Script} from 'forge-std/Script.sol';

contract ScriptBase is Script {
    /// @dev The label for the deployer's private key.
    string private constant DEPLOYER_PRIVATE_KEY_LABEL = 'DEPLOYER_PRIVATE_KEY';

    /// @dev The label for the EigenLayer Strategy Manager address.
    string private constant STRATEGY_MANAGER_LABEL = 'STRATEGY_MANAGER';

    /// @dev The label for the EigenLayer Eigen Pod Manager address.
    string private constant EIGEN_POD_MANAGER_LABEL = 'EIGEN_POD_MANAGER';

    /// @dev The label for the EigenLayer Delegation Manager address.
    string private constant DELEGATION_MANAGER_LABEL = 'DELEGATION_MANAGER';

    /// @dev EigenLayer addresses by chain ID and label.
    mapping(uint256 => mapping(string => address)) public EIGENLAYER_ADDRESSES;

    /// @dev The deployer's private key.
    uint256 public deployerKey = vm.envUint(DEPLOYER_PRIVATE_KEY_LABEL);

    /// @dev The deployer's address.
    address public deployer = vm.addr(deployerKey);

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
        EIGENLAYER_ADDRESSES[1][STRATEGY_MANAGER_LABEL] = 0x858646372CC42E1A627fcE94aa7A7033e7CF075A;
        EIGENLAYER_ADDRESSES[1][EIGEN_POD_MANAGER_LABEL] = 0x91E677b07F7AF907ec9a428aafA9fc14a0d3A338;
        EIGENLAYER_ADDRESSES[1][DELEGATION_MANAGER_LABEL] = 0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A;

        // Goerli
        EIGENLAYER_ADDRESSES[5][STRATEGY_MANAGER_LABEL] = 0x8676bb5f792ED407a237234Fe422aC6ed3540055;
        EIGENLAYER_ADDRESSES[5][EIGEN_POD_MANAGER_LABEL] = 0xa286b84C96aF280a49Fe1F40B9627C2A2827df41;
        EIGENLAYER_ADDRESSES[5][DELEGATION_MANAGER_LABEL] = 0x1b7b8F6b258f95Cf9596EabB9aa18B62940Eb0a8;

        // Populate EigenLayer addresses for the current chain ID.
        strategyManager = EIGENLAYER_ADDRESSES[block.chainid][STRATEGY_MANAGER_LABEL];
        eigenPodManager = EIGENLAYER_ADDRESSES[block.chainid][EIGEN_POD_MANAGER_LABEL];
        delegationManager = EIGENLAYER_ADDRESSES[block.chainid][DELEGATION_MANAGER_LABEL];
    }
}
