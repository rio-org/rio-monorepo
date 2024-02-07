// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {ScriptBase} from 'script/base/ScriptBase.sol';
import {IRioLRTOperatorRegistry} from 'contracts/interfaces/IRioLRTOperatorRegistry.sol';

contract AddOperatorsGoerli is ScriptBase {
    function run() public broadcast {
        IRioLRTOperatorRegistry registry = IRioLRTOperatorRegistry(vm.envAddress('OPERATOR_REGISTRY'));

        // Hashkey Cloud
        registry.addOperator(
            IRioLRTOperatorRegistry.OperatorConfig({
                operator: 0xABD434AA01eE1A6d3E4a569B871E7e63E64F166c,
                initialManager: 0xABD434AA01eE1A6d3E4a569B871E7e63E64F166c,
                initialEarningsReceiver: 0xABD434AA01eE1A6d3E4a569B871E7e63E64F166c,
                initialMetadataURI: 'https://ipfs.io/ipfs/QmWqD1eD7wBLmHiaRcLfMUo9VzAW2fWWkjjH3JDNDScoLM',
                strategyShareCaps: new IRioLRTOperatorRegistry.StrategyShareCap[](0),
                validatorCap: 0
            })
        );

        // Figment
        registry.addOperator(
            IRioLRTOperatorRegistry.OperatorConfig({
                operator: 0x2E426a68CcD7Fd13dE48730969665dD353c0D3Ca,
                initialManager: 0xeB9c8e3671F9A09BbDfE799E0Cd63143AFe70884,
                initialEarningsReceiver: 0xeB9c8e3671F9A09BbDfE799E0Cd63143AFe70884,
                initialMetadataURI: 'https://ipfs.io/ipfs/bafkreidwabgzahpkyhrl4rvomtjkpiny5zxphdm3bqsk66lvxivpk5iygq',
                strategyShareCaps: new IRioLRTOperatorRegistry.StrategyShareCap[](0),
                validatorCap: 0
            })
        );

        // Chorus One
        registry.addOperator(
            IRioLRTOperatorRegistry.OperatorConfig({
                operator: 0x3795F23a3839Acba4502308134187a39C6Bfc426,
                initialManager: 0x935812FF96A700714a839217c5c2028D17E53e2b,
                initialEarningsReceiver: 0x935812FF96A700714a839217c5c2028D17E53e2b,
                initialMetadataURI: 'https://black-imperial-bobolink-192.mypinata.cloud/ipfs/QmS3anQp7wgWh2u5LWNDy7LvUiGakfx23fP1uDX1czLajZ',
                strategyShareCaps: new IRioLRTOperatorRegistry.StrategyShareCap[](0),
                validatorCap: 0
            })
        );

        // Kiln
        registry.addOperator(
            IRioLRTOperatorRegistry.OperatorConfig({
                operator: 0x117c8633Fc7e6846571A7Ac5b604282f8C88E0A3,
                initialManager: 0x117c8633Fc7e6846571A7Ac5b604282f8C88E0A3,
                initialEarningsReceiver: 0x117c8633Fc7e6846571A7Ac5b604282f8C88E0A3,
                initialMetadataURI: 'https://ipfs.io/ipfs/QmRrbUKTYe3mdMHgtDLSgSTjYQYopmtTd3ksjMKeVgxqvf',
                strategyShareCaps: new IRioLRTOperatorRegistry.StrategyShareCap[](0),
                validatorCap: 0
            })
        );

        // Black Sand
        registry.addOperator(
            IRioLRTOperatorRegistry.OperatorConfig({
                operator: 0x40278096225BfC925b88deDf9301e6E5bf501014,
                initialManager: 0x2540909F97AaeDf2a1d8B282E966c16bC13bB0E2,
                initialEarningsReceiver: 0x2540909F97AaeDf2a1d8B282E966c16bC13bB0E2,
                initialMetadataURI: 'https://ipfs.io/ipfs/bafkreiguyoslucbkrxiawkekuuqkunqxgtklkgxudoe5timgncgctulyne',
                strategyShareCaps: new IRioLRTOperatorRegistry.StrategyShareCap[](0),
                validatorCap: 0
            })
        );
    }
}
