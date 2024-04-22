// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {ScriptBase} from 'script/base/ScriptBase.sol';
import {RioNetwork} from 'contracts/token/RioNetwork.sol';

contract DeployRioNetworkToken is ScriptBase {
    function run() public broadcast returns (RioNetwork token) {
        token = new RioNetwork(vm.envAddress('TOKEN_RECIPIENT'));
    }
}
