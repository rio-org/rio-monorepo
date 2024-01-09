// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {DeployRioIssuerBase} from 'script/DeployRioIssuerBase.s.sol';

contract DeployRioIssuerGoerli is DeployRioIssuerBase {
    // Misc
    address public constant WETH_ADDRESS = 0xdFCeA9088c8A88A76FF74892C1457C17dfeef9C1;

    // Balancer
    address public constant VAULT_ADDRESS = 0xBA12222222228d8Ba445958a75a0704d566BF2C8;
    address public constant MANAGED_POOL_FACTORY_ADDRESS = 0x429E5679675e1ed8C2dD7C15D3F7e6C8Bc48a809;
    address public constant BALANCER_QUERIES_ADDRESS = 0xE39B5e3B6D74016b2F6A9673D7d7493B6DF549d5;

    // EigenLayer
    address public constant STRATEGY_MANAGER_ADDRESS = 0x8676bb5f792ED407a237234Fe422aC6ed3540055;
    address public constant EIGEN_POD_MANAGER_ADDRESS = 0xa286b84C96aF280a49Fe1F40B9627C2A2827df41;
    address public constant DELEGATION_MANAGER_ADDRESS = 0x1b7b8F6b258f95Cf9596EabB9aa18B62940Eb0a8;
    address public constant BLS_PUBLIC_KEY_COMPENDIUM_ADDRESS = 0xc81d3963087Fe09316cd1E032457989C7aC91b19;
    address public constant SLASHER_ADDRESS = 0xD11d60b669Ecf7bE10329726043B3ac07B380C22;

    constructor()
        DeployRioIssuerBase(
            WETH_ADDRESS,
            VAULT_ADDRESS,
            MANAGED_POOL_FACTORY_ADDRESS,
            BALANCER_QUERIES_ADDRESS,
            STRATEGY_MANAGER_ADDRESS,
            EIGEN_POD_MANAGER_ADDRESS,
            DELEGATION_MANAGER_ADDRESS,
            BLS_PUBLIC_KEY_COMPENDIUM_ADDRESS,
            SLASHER_ADDRESS
        )
    {}
}
