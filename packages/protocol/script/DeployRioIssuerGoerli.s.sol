// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {DeployRioIssuerBase} from 'script/DeployRioIssuerBase.s.sol';

contract DeployRioIssuerGoerli is DeployRioIssuerBase {
    // EigenLayer
    address public constant STRATEGY_MANAGER_ADDRESS = 0x8676bb5f792ED407a237234Fe422aC6ed3540055;
    address public constant EIGEN_POD_MANAGER_ADDRESS = 0xa286b84C96aF280a49Fe1F40B9627C2A2827df41;
    address public constant DELEGATION_MANAGER_ADDRESS = 0x1b7b8F6b258f95Cf9596EabB9aa18B62940Eb0a8;

    constructor()
        DeployRioIssuerBase(STRATEGY_MANAGER_ADDRESS, EIGEN_POD_MANAGER_ADDRESS, DELEGATION_MANAGER_ADDRESS)
    {}
}
