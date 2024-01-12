// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {DeployRioIssuerBase} from 'script/DeployRioIssuerBase.s.sol';

contract DeployRioIssuerGoerli is DeployRioIssuerBase {
    // EigenLayer
    address public constant STRATEGY_MANAGER_ADDRESS = 0x8676bb5f792ED407a237234Fe422aC6ed3540055;
    address public constant EIGEN_POD_MANAGER_ADDRESS = 0xa286b84C96aF280a49Fe1F40B9627C2A2827df41;
    address public constant DELEGATION_MANAGER_ADDRESS = 0x1b7b8F6b258f95Cf9596EabB9aa18B62940Eb0a8;
    address public constant BLS_PUBLIC_KEY_COMPENDIUM_ADDRESS = 0xc81d3963087Fe09316cd1E032457989C7aC91b19;
    address public constant SLASHER_ADDRESS = 0xD11d60b669Ecf7bE10329726043B3ac07B380C22;

    constructor()
        DeployRioIssuerBase(
            STRATEGY_MANAGER_ADDRESS,
            EIGEN_POD_MANAGER_ADDRESS,
            DELEGATION_MANAGER_ADDRESS,
            BLS_PUBLIC_KEY_COMPENDIUM_ADDRESS,
            SLASHER_ADDRESS
        )
    {}
}
