// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {Governor} from '@openzeppelin/contracts/governance/Governor.sol';
import {GovernorSettings} from '@openzeppelin/contracts/governance/extensions/GovernorSettings.sol';
import {GovernorCountingSimple} from '@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol';
import {GovernorVotes} from '@openzeppelin/contracts/governance/extensions/GovernorVotes.sol';
import {GovernorVotesQuorumFraction} from '@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol';
import {GovernorTimelockControl} from '@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol';
import {TimelockController} from '@openzeppelin/contracts/governance/TimelockController.sol';
import {IGovernor} from '@openzeppelin/contracts/governance/IGovernor.sol';
import {IVotes} from '@openzeppelin/contracts/governance/utils/IVotes.sol';

contract RioGovernor is Governor, GovernorSettings, GovernorCountingSimple, GovernorVotes, GovernorVotesQuorumFraction, GovernorTimelockControl {
    constructor(IVotes _token, TimelockController _timelock)
        Governor('RioGovernor')
        GovernorSettings(14_400, /* 2 days */ 21_600, /* 3 days */ 1_000_000e18 /* 0.1% */ )
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(1 /* 1% */ )
        GovernorTimelockControl(_timelock)
    {}

    // The following functions are overrides required by Solidity.

    function votingDelay() public view override(IGovernor, GovernorSettings) returns (uint256) {
        return super.votingDelay();
    }

    function votingPeriod() public view override(IGovernor, GovernorSettings) returns (uint256) {
        return super.votingPeriod();
    }

    function quorum(uint256 blockNumber) public view override(IGovernor, GovernorVotesQuorumFraction) returns (uint256) {
        return super.quorum(blockNumber);
    }

    function state(uint256 proposalId) public view override(Governor, GovernorTimelockControl) returns (ProposalState) {
        return super.state(proposalId);
    }

    function propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description)
        public
        override(Governor, IGovernor)
        returns (uint256)
    {
        return super.propose(targets, values, calldatas, description);
    }

    function proposalThreshold() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.proposalThreshold();
    }

    function _execute(uint256 proposalId, address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
        internal
        override(Governor, GovernorTimelockControl)
    {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
        internal
        override(Governor, GovernorTimelockControl)
        returns (uint256)
    {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor() internal view override(Governor, GovernorTimelockControl) returns (address) {
        return super._executor();
    }

    function supportsInterface(bytes4 interfaceId) public view override(Governor, GovernorTimelockControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
