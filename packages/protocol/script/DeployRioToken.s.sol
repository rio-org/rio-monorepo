// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {ScriptBase} from 'script/base/ScriptBase.sol';
import {RioToken} from 'contracts/token/RioToken.sol';

contract DeployRioToken is ScriptBase {
    function run() public broadcast returns (RioToken token) {
        token = new RioToken(vm.envAddress('TOKEN_RECIPIENT'));
    }
}
