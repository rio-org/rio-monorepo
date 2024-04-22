// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {RioDeployer} from 'test/utils/RioDeployer.sol';
import {OwnableUpgradeable} from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import {IRioLRTAVSRegistry} from 'contracts/interfaces/IRioLRTAVSRegistry.sol';
import {EmptyContract} from 'test/utils/EmptyContract.sol';

contract RioLRTAVSRegistryTest is RioDeployer {
    TestLRTDeployment public reETH;

    address public slashingContract;
    address public registryContract;

    function setUp() public {
        deployRio();

        (reETH,) = issueRestakedETH();

        slashingContract = address(new EmptyContract());
        registryContract = address(new EmptyContract());
    }

    function test_addAVSNonOwnerReverts() public {
        vm.prank(address(42));
        vm.expectRevert(abi.encodeWithSelector(OwnableUpgradeable.OwnableUnauthorizedAccount.selector, address(42)));
        reETH.avsRegistry.addAVS('Fake AVS', slashingContract, registryContract);
    }

    function test_addAVSInvalidNameReverts() public {
        vm.expectRevert(abi.encodeWithSelector(IRioLRTAVSRegistry.INVALID_NAME.selector));
        reETH.avsRegistry.addAVS('', slashingContract, registryContract);
    }

    function test_addAVSInvalidSlashingContractReverts() public {
        vm.expectRevert(abi.encodeWithSelector(IRioLRTAVSRegistry.INVALID_SLASHING_CONTRACT.selector));
        reETH.avsRegistry.addAVS('Test AVS', address(1), registryContract);
    }

    function test_addAVSInvalidRegistryContractReverts() public {
        vm.expectRevert(abi.encodeWithSelector(IRioLRTAVSRegistry.INVALID_REGISTRY_CONTRACT.selector));
        reETH.avsRegistry.addAVS('Test AVS', slashingContract, address(2));
    }

    function test_addAVSDuplicateSlashingContractReverts() public {
        reETH.avsRegistry.addAVS('Test AVS', slashingContract, registryContract);

        assertTrue(reETH.avsRegistry.isActiveSlashingContract(slashingContract));
        assertTrue(reETH.avsRegistry.isActiveRegistryContract(registryContract));

        address anotherRegistryContract = address(new EmptyContract());

        vm.expectRevert(abi.encodeWithSelector(IRioLRTAVSRegistry.SLASHING_CONTRACT_ALREADY_ACTIVE.selector));
        reETH.avsRegistry.addAVS('Test AVS 2', slashingContract, anotherRegistryContract);
    }

    function test_addAVSDuplicateRegistryContractReverts() public {
        reETH.avsRegistry.addAVS('Test AVS', slashingContract, registryContract);

        assertTrue(reETH.avsRegistry.isActiveSlashingContract(slashingContract));
        assertTrue(reETH.avsRegistry.isActiveRegistryContract(registryContract));

        address anotherSlashingContract = address(new EmptyContract());

        vm.expectRevert(abi.encodeWithSelector(IRioLRTAVSRegistry.REGISTRY_CONTRACT_ALREADY_ACTIVE.selector));
        reETH.avsRegistry.addAVS('Test AVS 2', anotherSlashingContract, registryContract);
    }

    function test_addAVS() public {
        uint128 avsId = reETH.avsRegistry.addAVS('Test AVS', slashingContract, registryContract);
        assertEq(reETH.avsRegistry.avsCount(), 1);
        assertEq(reETH.avsRegistry.activeAVSCount(), 1);

        assertEq(reETH.avsRegistry.getAVS(avsId).name, 'Test AVS');
        assertEq(reETH.avsRegistry.getAVS(avsId).slashingContract, slashingContract);
        assertEq(reETH.avsRegistry.getAVS(avsId).registryContract, registryContract);

        assertTrue(reETH.avsRegistry.isActiveSlashingContract(slashingContract));
        assertTrue(reETH.avsRegistry.isActiveRegistryContract(registryContract));

        reETH.avsRegistry.addAVS('Test AVS 2', address(new EmptyContract()), address(new EmptyContract()));
        assertEq(reETH.avsRegistry.avsCount(), 2);
        assertEq(reETH.avsRegistry.activeAVSCount(), 2);
    }

    function test_activateAVSNonOwnerReverts() public {
        vm.prank(address(42));
        vm.expectRevert(abi.encodeWithSelector(OwnableUpgradeable.OwnableUnauthorizedAccount.selector, address(42)));
        reETH.avsRegistry.activateAVS(1);
    }

    function test_activateAVSNotRegisteredReverts() public {
        vm.expectRevert(abi.encodeWithSelector(IRioLRTAVSRegistry.AVS_NOT_REGISTERED.selector));
        reETH.avsRegistry.activateAVS(1);
    }

    function test_activateAVSAlreadyActiveReverts() public {
        uint128 avsId = reETH.avsRegistry.addAVS('Test AVS', slashingContract, registryContract);

        vm.expectRevert(abi.encodeWithSelector(IRioLRTAVSRegistry.AVS_ALREADY_ACTIVE.selector));
        reETH.avsRegistry.activateAVS(avsId);
    }

    function test_activateAVSDuplicateSlashingContractReverts() public {
        uint128 avsId = reETH.avsRegistry.addAVS('Test AVS', slashingContract, registryContract);
        reETH.avsRegistry.deactivateAVS(avsId);

        reETH.avsRegistry.addAVS('Test AVS 2', slashingContract, address(new EmptyContract()));

        vm.expectRevert(abi.encodeWithSelector(IRioLRTAVSRegistry.SLASHING_CONTRACT_ALREADY_ACTIVE.selector));
        reETH.avsRegistry.activateAVS(avsId);
    }

    function test_activateAVSDuplicateRegistryContractReverts() public {
        uint128 avsId = reETH.avsRegistry.addAVS('Test AVS', slashingContract, registryContract);
        reETH.avsRegistry.deactivateAVS(avsId);

        reETH.avsRegistry.addAVS('Test AVS 2', address(new EmptyContract()), registryContract);

        vm.expectRevert(abi.encodeWithSelector(IRioLRTAVSRegistry.REGISTRY_CONTRACT_ALREADY_ACTIVE.selector));
        reETH.avsRegistry.activateAVS(avsId);
    }

    function test_activateAVS() public {
        uint128 avsId = reETH.avsRegistry.addAVS('Test AVS', slashingContract, registryContract);
        reETH.avsRegistry.deactivateAVS(avsId);

        assertEq(reETH.avsRegistry.activeAVSCount(), 0);
        assertFalse(reETH.avsRegistry.getAVS(avsId).active);

        reETH.avsRegistry.activateAVS(avsId);

        assertEq(reETH.avsRegistry.activeAVSCount(), 1);
        assertTrue(reETH.avsRegistry.getAVS(avsId).active);
    }

    function test_deactivateAVSNonOwnerReverts() public {
        vm.prank(address(42));
        vm.expectRevert(abi.encodeWithSelector(OwnableUpgradeable.OwnableUnauthorizedAccount.selector, address(42)));
        reETH.avsRegistry.deactivateAVS(1);
    }

    function test_deactivateAVSNotRegisteredReverts() public {
        vm.expectRevert(abi.encodeWithSelector(IRioLRTAVSRegistry.AVS_NOT_REGISTERED.selector));
        reETH.avsRegistry.deactivateAVS(1);
    }

    function test_deactivateAVSAlreadyInactiveReverts() public {
        uint128 avsId = reETH.avsRegistry.addAVS('Test AVS', slashingContract, registryContract);
        reETH.avsRegistry.deactivateAVS(avsId);

        vm.expectRevert(abi.encodeWithSelector(IRioLRTAVSRegistry.AVS_ALREADY_INACTIVE.selector));
        reETH.avsRegistry.deactivateAVS(avsId);
    }

    function test_deactivateAVS() public {
        uint128 avsId = reETH.avsRegistry.addAVS('Test AVS', slashingContract, registryContract);

        assertEq(reETH.avsRegistry.activeAVSCount(), 1);
        assertTrue(reETH.avsRegistry.getAVS(avsId).active);

        reETH.avsRegistry.deactivateAVS(avsId);

        assertEq(reETH.avsRegistry.activeAVSCount(), 0);
        assertFalse(reETH.avsRegistry.getAVS(avsId).active);
    }
}
