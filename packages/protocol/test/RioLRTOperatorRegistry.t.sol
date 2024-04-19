// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {Math} from '@openzeppelin/contracts/utils/math/Math.sol';
import {IDelegationManager} from 'contracts/interfaces/eigenlayer/IDelegationManager.sol';
import {IRioLRTOperatorDelegator} from 'contracts/interfaces/IRioLRTOperatorDelegator.sol';
import {IRioLRTOperatorRegistry} from 'contracts/interfaces/IRioLRTOperatorRegistry.sol';
import {ETH_ADDRESS, BEACON_CHAIN_STRATEGY} from 'contracts/utils/Constants.sol';
import {IEigenPod} from 'contracts/interfaces/eigenlayer/IEigenPod.sol';
import {ValidatorDetails} from 'contracts/utils/ValidatorDetails.sol';
import {RioLRTCore} from 'contracts/restaking/base/RioLRTCore.sol';
import {RioDeployer} from 'test/utils/RioDeployer.sol';
import {LibString} from '@solady/utils/LibString.sol';
import {TestUtils} from 'test/utils/TestUtils.sol';
import {Vm} from 'forge-std/Vm.sol';

contract RioLRTOperatorRegistryTest is RioDeployer {
    TestLRTDeployment public reETH;
    TestLRTDeployment public reLST;

    string public metadataURI = 'https://ipfs.io/ipfs/bafkreiaps6k6yapebk2eac2kgh47ktv2dxsajtssyi5fgnkrhyu7spivye';

    IRioLRTOperatorRegistry.StrategyShareCap[] public emptyStrategyShareCaps;
    IRioLRTOperatorRegistry.StrategyShareCap[] public defaultStrategyShareCaps;

    function setUp() public {
        deployRio();

        (reETH,) = issueRestakedETH();
        (reLST,) = issueRestakedLST();

        defaultStrategyShareCaps.push(IRioLRTOperatorRegistry.StrategyShareCap({strategy: RETH_STRATEGY, cap: 2000e18}));
        defaultStrategyShareCaps.push(
            IRioLRTOperatorRegistry.StrategyShareCap({strategy: CBETH_STRATEGY, cap: 1000e18})
        );
    }

    function testFuzz_allocateETHDeposits(uint8 operatorCount, uint8 validatorsPerOperator, uint16 depositsToAllocate)
        public
    {
        vm.assume(operatorCount > 0 && operatorCount <= 20);
        vm.assume(validatorsPerOperator > 0);
        vm.assume(depositsToAllocate > 0 && depositsToAllocate <= 100);

        // Create 10 operator delegators and fast forward to allow keys to confirm.
        addOperatorDelegators(
            reETH.operatorRegistry,
            address(reETH.rewardDistributor),
            operatorCount,
            emptyStrategyShareCaps,
            validatorsPerOperator
        );

        vm.prank(address(reETH.depositPool));
        (uint256 depositsAllocated, IRioLRTOperatorRegistry.OperatorETHAllocation[] memory allocations) =
            reETH.operatorRegistry.allocateETHDeposits(depositsToAllocate);
        assertEq(
            depositsAllocated, Math.min(uint256(depositsToAllocate), uint256(operatorCount) * validatorsPerOperator)
        );

        for (uint256 i = 0; i < allocations.length - 1; ++i) {
            assertEq(allocations[i].deposits, validatorsPerOperator);
        }
        uint256 remainingDeposits = depositsAllocated % validatorsPerOperator;
        uint256 expectedDeposits = remainingDeposits > 0 ? remainingDeposits : validatorsPerOperator;
        assertEq(allocations[allocations.length - 1].deposits, expectedDeposits);
    }

    function test_addOperatorWithoutOperatorReverts() public {
        vm.expectRevert(abi.encodeWithSelector(IRioLRTOperatorRegistry.INVALID_OPERATOR.selector));
        reETH.operatorRegistry.addOperator(
            IRioLRTOperatorRegistry.OperatorConfig({
                operator: address(0), // No operator
                initialManager: address(this),
                initialEarningsReceiver: address(this),
                initialMetadataURI: metadataURI,
                strategyShareCaps: emptyStrategyShareCaps,
                validatorCap: 100
            })
        );
    }

    function test_addOperatorWithoutManagerReverts() public {
        vm.expectRevert(abi.encodeWithSelector(IRioLRTOperatorRegistry.INVALID_MANAGER.selector));
        reETH.operatorRegistry.addOperator(
            IRioLRTOperatorRegistry.OperatorConfig({
                operator: address(1),
                initialManager: address(0), // No manager
                initialEarningsReceiver: address(this),
                initialMetadataURI: metadataURI,
                strategyShareCaps: emptyStrategyShareCaps,
                validatorCap: 100
            })
        );
    }

    function test_addOperatorWithoutEarningsReceiverReverts() public {
        vm.expectRevert(abi.encodeWithSelector(IRioLRTOperatorRegistry.INVALID_EARNINGS_RECEIVER.selector));
        reETH.operatorRegistry.addOperator(
            IRioLRTOperatorRegistry.OperatorConfig({
                operator: address(1),
                initialManager: address(this),
                initialEarningsReceiver: address(0), // No earnings receiver
                initialMetadataURI: metadataURI,
                strategyShareCaps: emptyStrategyShareCaps,
                validatorCap: 100
            })
        );
    }

    function test_addOperator() public {
        uint40 validatorCap = 100;
        address operator = address(1);

        vm.prank(operator);
        delegationManager.registerAsOperator(
            IDelegationManager.OperatorDetails({
                earningsReceiver: address(reETH.rewardDistributor),
                delegationApprover: address(0),
                stakerOptOutWindowBlocks: 0
            }),
            metadataURI
        );

        (uint8 operatorId, address delegator) = reETH.operatorRegistry.addOperator(
            IRioLRTOperatorRegistry.OperatorConfig({
                operator: operator,
                initialManager: address(this),
                initialEarningsReceiver: address(this),
                initialMetadataURI: metadataURI,
                strategyShareCaps: defaultStrategyShareCaps,
                validatorCap: validatorCap
            })
        );
        assertEq(operatorId, 1);
        assertNotEq(delegator, address(0));

        IRioLRTOperatorRegistry.OperatorPublicDetails memory operatorDetails =
            reETH.operatorRegistry.getOperatorDetails(operatorId);

        assertEq(operatorDetails.active, true);
        assertEq(operatorDetails.delegator, delegator);
        assertEq(operatorDetails.manager, address(this));
        assertEq(operatorDetails.pendingManager, address(0));
        assertEq(operatorDetails.earningsReceiver, address(this));
        assertEq(operatorDetails.validatorDetails.cap, validatorCap);

        assertEq(reETH.operatorRegistry.operatorCount(), 1);
        assertEq(reETH.operatorRegistry.activeOperatorCount(), 1);

        for (uint256 i = 0; i < defaultStrategyShareCaps.length; i++) {
            IRioLRTOperatorRegistry.OperatorShareDetails memory operatorShareDetails =
                reETH.operatorRegistry.getOperatorShareDetails(operatorId, defaultStrategyShareCaps[i].strategy);

            assertEq(operatorShareDetails.cap, defaultStrategyShareCaps[i].cap);
            assertEq(operatorShareDetails.allocation, 0);
        }
    }

    function test_activateOperator() public {
        uint8 operatorId = addOperatorDelegator(reETH.operatorRegistry, address(reETH.rewardDistributor));
        reETH.operatorRegistry.deactivateOperator(operatorId);

        reETH.operatorRegistry.activateOperator(operatorId);

        IRioLRTOperatorRegistry.OperatorPublicDetails memory operatorDetails =
            reETH.operatorRegistry.getOperatorDetails(operatorId);
        assertEq(operatorDetails.active, true);
        assertEq(reETH.operatorRegistry.activeOperatorCount(), 1);
    }

    function test_deactivateOperatorInvalidOperatorDelegatorReverts() public {
        vm.expectRevert(abi.encodeWithSelector(IRioLRTOperatorRegistry.INVALID_OPERATOR_DELEGATOR.selector));
        reETH.operatorRegistry.deactivateOperator(99);
    }

    function test_deactivateOperatorAlreadyInactiveReverts() public {
        uint8 operatorId = addOperatorDelegator(reETH.operatorRegistry, address(reETH.rewardDistributor));

        reETH.operatorRegistry.deactivateOperator(operatorId);
        vm.expectRevert(abi.encodeWithSelector(IRioLRTOperatorRegistry.OPERATOR_ALREADY_INACTIVE.selector));
        reETH.operatorRegistry.deactivateOperator(operatorId);
    }

    function test_deactivateOperator() public {
        uint8 operatorId = addOperatorDelegator(reETH.operatorRegistry, address(reETH.rewardDistributor));

        IRioLRTOperatorRegistry.OperatorPublicDetails memory operatorDetails =
            reETH.operatorRegistry.getOperatorDetails(operatorId);
        assertEq(operatorDetails.active, true);
        assertEq(reETH.operatorRegistry.activeOperatorCount(), 1);

        reETH.operatorRegistry.deactivateOperator(operatorId);

        operatorDetails = reETH.operatorRegistry.getOperatorDetails(operatorId);
        assertEq(operatorDetails.active, false);
        assertEq(reETH.operatorRegistry.activeOperatorCount(), 0);
    }

    function test_setOperatorStrategyShareCapsInvalidOperatorDelegatorReverts() public {
        vm.expectRevert(abi.encodeWithSelector(IRioLRTOperatorRegistry.INVALID_OPERATOR_DELEGATOR.selector));
        reLST.operatorRegistry.setOperatorStrategyShareCaps(99, defaultStrategyShareCaps);
    }

    function test_setOperatorStrategyShareCaps() public {
        IRioLRTOperatorRegistry.StrategyShareCap[] memory strategyShareCaps =
            new IRioLRTOperatorRegistry.StrategyShareCap[](2);
        strategyShareCaps[0] = IRioLRTOperatorRegistry.StrategyShareCap({strategy: RETH_STRATEGY, cap: 999e18});
        strategyShareCaps[1] = IRioLRTOperatorRegistry.StrategyShareCap({strategy: CBETH_STRATEGY, cap: 8181e18});

        uint8 operatorId = addOperatorDelegator(reLST.operatorRegistry, address(reLST.rewardDistributor));

        // Verify the caps are initially 0.
        for (uint256 i = 0; i < strategyShareCaps.length; i++) {
            uint256 cap = reLST.operatorRegistry.getOperatorShareDetails(operatorId, strategyShareCaps[i].strategy).cap;
            assertEq(cap, 1_000 ether /* default cap */ );
        }
        reLST.operatorRegistry.setOperatorStrategyShareCaps(operatorId, strategyShareCaps);

        // Verify the caps are set as expected.
        for (uint256 i = 0; i < strategyShareCaps.length; i++) {
            uint256 cap = reLST.operatorRegistry.getOperatorShareDetails(operatorId, strategyShareCaps[i].strategy).cap;
            assertGt(cap, 0);
            assertEq(cap, strategyShareCaps[i].cap);
        }
    }

    function test_setOperatorStrategyShareCapsQueuesOperatorExitWhenSettingCapToZeroWithAllocation() public {
        IRioLRTOperatorRegistry.StrategyShareCap[] memory zeroStrategyShareCaps =
            new IRioLRTOperatorRegistry.StrategyShareCap[](2);
        zeroStrategyShareCaps[0] = IRioLRTOperatorRegistry.StrategyShareCap({strategy: RETH_STRATEGY, cap: 0});
        zeroStrategyShareCaps[1] = IRioLRTOperatorRegistry.StrategyShareCap({strategy: CBETH_STRATEGY, cap: 0});

        uint8 operatorId = addOperatorDelegator(reLST.operatorRegistry, address(reLST.rewardDistributor));

        uint256 AMOUNT = 111e18;

        // Allocate to cbETH strategy.
        cbETH.approve(address(reLST.coordinator), type(uint256).max);
        reLST.coordinator.depositERC20(CBETH_ADDRESS, AMOUNT);

        // Push funds into EigenLayer.
        vm.prank(EOA, EOA);
        reLST.coordinator.rebalanceERC20(CBETH_ADDRESS);

        vm.recordLogs();
        reLST.operatorRegistry.setOperatorStrategyShareCaps(operatorId, zeroStrategyShareCaps);

        Vm.Log[] memory entries = vm.getRecordedLogs();
        assertGt(entries.length, 0);

        for (uint256 i = 0; i < entries.length; i++) {
            if (entries[i].topics[0] == keccak256('OperatorStrategyExitQueued(uint8,address,uint256,bytes32)')) {
                uint8 emittedOperatorId = abi.decode(abi.encodePacked(entries[i].topics[1]), (uint8));
                (address strategy, uint256 sharesToExit, bytes32 withdrawalRoot) =
                    abi.decode(entries[i].data, (address, uint256, bytes32));

                assertEq(emittedOperatorId, operatorId);
                assertEq(strategy, CBETH_STRATEGY);
                assertEq(sharesToExit, AMOUNT);
                assertNotEq(withdrawalRoot, bytes32(0));

                break;
            }
            if (i == entries.length - 1) fail('Event not found');
        }
    }

    function test_setOperatorValidatorCapInvalidOperatorDelegatorReverts() public {
        vm.expectRevert(abi.encodeWithSelector(IRioLRTOperatorRegistry.INVALID_OPERATOR_DELEGATOR.selector));
        reETH.operatorRegistry.setOperatorValidatorCap(99, 0);
    }

    function test_setOperatorValidatorCap() public {
        uint8 operatorId = addOperatorDelegator(reETH.operatorRegistry, address(reETH.rewardDistributor));

        uint40 newCap = 19191;
        reETH.operatorRegistry.setOperatorValidatorCap(operatorId, newCap);

        uint40 validatorCap = reETH.operatorRegistry.getOperatorDetails(operatorId).validatorDetails.cap;
        assertEq(newCap, validatorCap);
    }

    function test_setOperatorValidatorCapQueuesOperatorExitWhenSettingCapToZeroWithAllocation() public {
        uint8 operatorId = addOperatorDelegator(reETH.operatorRegistry, address(reETH.rewardDistributor));

        uint256 AMOUNT = 288 ether;

        // Allocate ETH.
        reETH.coordinator.depositETH{value: AMOUNT}();

        // Get the latest POS deposit root and guardian signature.
        (bytes32 root, bytes memory signature) = signCurrentDepositRoot(reETH.coordinator);

        // Push funds into EigenLayer.
        vm.prank(EOA, EOA);
        reETH.coordinator.rebalanceETH(root, signature);

        // Verify validator withdrawal credentials.
        verifyCredentialsForValidators(reETH.operatorRegistry, operatorId, uint8(AMOUNT / 32 ether));

        vm.recordLogs();
        reETH.operatorRegistry.setOperatorValidatorCap(operatorId, 0);

        Vm.Log[] memory entries = vm.getRecordedLogs();
        assertGt(entries.length, 0);

        for (uint256 i = 0; i < entries.length; i++) {
            if (entries[i].topics[0] == keccak256('OperatorStrategyExitQueued(uint8,address,uint256,bytes32)')) {
                uint8 emittedOperatorId = abi.decode(abi.encodePacked(entries[i].topics[1]), (uint8));
                (address strategy, uint256 sharesToExit, bytes32 withdrawalRoot) =
                    abi.decode(entries[i].data, (address, uint256, bytes32));

                assertEq(emittedOperatorId, operatorId);
                assertEq(strategy, BEACON_CHAIN_STRATEGY);
                assertEq(sharesToExit, AMOUNT);
                assertNotEq(withdrawalRoot, bytes32(0));

                break;
            }
            if (i == entries.length - 1) fail('Event not found');
        }
    }

    function test_reportOutOfOrderValidatorExits() public {
        uint40 UPLOADED_KEY_COUNT = 1_000;

        uint256 DEPOSIT_COUNT = 300;
        uint256 OOO_EXIT_STARTING_INDEX = 150;
        uint256 OOO_EXIT_COUNT = 88;

        // forgefmt: disable-next-item
        uint8 operatorId = addOperatorDelegator(reETH.operatorRegistry, address(reETH.rewardDistributor), emptyStrategyShareCaps, 0);
        reETH.operatorRegistry.setOperatorValidatorCap(operatorId, UPLOADED_KEY_COUNT);

        // Populate the keys and signatures with random bytes.
        (bytes memory publicKeys, bytes memory signatures) = TestUtils.getRandomValidatorKeys(UPLOADED_KEY_COUNT);
        reETH.operatorRegistry.addValidatorDetails(operatorId, UPLOADED_KEY_COUNT, publicKeys, signatures);

        // Fast forward to allow validator keys time to confirm.
        skip(reETH.operatorRegistry.validatorKeyReviewPeriod());

        IRioLRTOperatorRegistry.OperatorPublicDetails memory details =
            reETH.operatorRegistry.getOperatorDetails(operatorId);

        // Allocate `DEPOSIT_COUNT` deposits
        vm.prank(address(reETH.depositPool));
        reETH.operatorRegistry.allocateETHDeposits(DEPOSIT_COUNT);

        // Mark operators as withdrawn.
        vm.mockCall(
            address(IRioLRTOperatorDelegator(details.delegator).eigenPod()),
            abi.encodeWithSelector(IEigenPod.validatorStatus.selector),
            abi.encode(IEigenPod.VALIDATOR_STATUS.WITHDRAWN)
        );

        // Ensure the expected public keys are swapped.
        uint256 j = OOO_EXIT_STARTING_INDEX;
        for (uint256 i = 0; i < OOO_EXIT_COUNT; i++) {
            uint256 key1Start = j * ValidatorDetails.PUBKEY_LENGTH;
            uint256 key1End = (j + 1) * ValidatorDetails.PUBKEY_LENGTH;

            uint256 key2Start = i * ValidatorDetails.PUBKEY_LENGTH;
            uint256 key2End = (i + 1) * ValidatorDetails.PUBKEY_LENGTH;

            vm.expectEmit(true, false, false, true, address(reETH.operatorRegistry));
            emit ValidatorDetails.ValidatorDetailsSwapped(
                operatorId,
                bytes(LibString.slice(string(publicKeys), key1Start, key1End)),
                bytes(LibString.slice(string(publicKeys), key2Start, key2End))
            );

            j++;
        }

        // Report the out of order exits of `OOO_EXIT_COUNT` validators starting at index `OOO_EXIT_STARTING_INDEX`.
        reETH.operatorRegistry.reportOutOfOrderValidatorExits(operatorId, OOO_EXIT_STARTING_INDEX, OOO_EXIT_COUNT);

        details = reETH.operatorRegistry.getOperatorDetails(operatorId);
        assertEq(details.validatorDetails.exited, OOO_EXIT_COUNT);
    }

    function test_reportOutOfOrderValidatorExitsDoesNotSwapIfNextInLineToBeExited() public {
        uint40 DEPOSIT_COUNT = 20;
        uint256 OOO_EXIT_STARTING_INDEX = 0;
        uint256 OOO_EXIT_COUNT = 10;

        uint8 operatorId = addOperatorDelegator(
            reETH.operatorRegistry, address(reETH.rewardDistributor), emptyStrategyShareCaps, DEPOSIT_COUNT
        );

        IRioLRTOperatorRegistry.OperatorPublicDetails memory details =
            reETH.operatorRegistry.getOperatorDetails(operatorId);

        // Allocate `DEPOSIT_COUNT` deposits
        vm.prank(address(reETH.depositPool));
        reETH.operatorRegistry.allocateETHDeposits(DEPOSIT_COUNT);

        // Mark operators as withdrawn.
        vm.mockCall(
            address(IRioLRTOperatorDelegator(details.delegator).eigenPod()),
            abi.encodeWithSelector(IEigenPod.validatorStatus.selector),
            abi.encode(IEigenPod.VALIDATOR_STATUS.WITHDRAWN)
        );

        vm.expectEmit(true, false, false, true, address(reETH.operatorRegistry));
        emit IRioLRTOperatorRegistry.OperatorOutOfOrderValidatorExitsReported(operatorId, OOO_EXIT_COUNT);

        vm.recordLogs();

        // Report the out of order exits of `OOO_EXIT_COUNT` validators starting at index `OOO_EXIT_STARTING_INDEX`.
        reETH.operatorRegistry.reportOutOfOrderValidatorExits(operatorId, OOO_EXIT_STARTING_INDEX, OOO_EXIT_COUNT);

        // No swapping events should have been emitted.
        Vm.Log[] memory logs = vm.getRecordedLogs();
        assertEq(logs.length, 1);

        details = reETH.operatorRegistry.getOperatorDetails(operatorId);
        assertEq(details.validatorDetails.exited, OOO_EXIT_COUNT);
    }

    function test_reportOutOfOrderValidatorExitsWhenTwoCallsRequiredToAvoidOverlappingIndexes() public {
        uint40 DEPOSIT_COUNT = 300;
        uint256 OOO_EXIT_STARTING_INDEX = 50;
        uint256 OOO_EXIT_COUNT = 150;

        uint8 operatorId = addOperatorDelegator(
            reETH.operatorRegistry, address(reETH.rewardDistributor), emptyStrategyShareCaps, DEPOSIT_COUNT
        );

        IRioLRTOperatorRegistry.OperatorPublicDetails memory details =
            reETH.operatorRegistry.getOperatorDetails(operatorId);

        // Allocate `DEPOSIT_COUNT` deposits
        vm.prank(address(reETH.depositPool));
        reETH.operatorRegistry.allocateETHDeposits(DEPOSIT_COUNT);

        // Mark operators as withdrawn.
        vm.mockCall(
            address(IRioLRTOperatorDelegator(details.delegator).eigenPod()),
            abi.encodeWithSelector(IEigenPod.validatorStatus.selector),
            abi.encode(IEigenPod.VALIDATOR_STATUS.WITHDRAWN)
        );

        uint256 FIRST_CALL_STARTING_INDEX = 100;
        uint256 FIRST_CALL_EXIT_COUNT = 50;

        // Ensure the last 50 public keys are swapped to fill the gap between the remaining.
        uint256 j = FIRST_CALL_STARTING_INDEX;
        (bytes memory expectedPublicKeys,) = TestUtils.getValidatorKeys(DEPOSIT_COUNT);
        for (uint256 i = 0; i < FIRST_CALL_EXIT_COUNT; i++) {
            uint256 key1Start = j * ValidatorDetails.PUBKEY_LENGTH;
            uint256 key1End = (j + 1) * ValidatorDetails.PUBKEY_LENGTH;

            uint256 key2Start = i * ValidatorDetails.PUBKEY_LENGTH;
            uint256 key2End = (i + 1) * ValidatorDetails.PUBKEY_LENGTH;

            vm.expectEmit(true, false, false, true, address(reETH.operatorRegistry));
            emit ValidatorDetails.ValidatorDetailsSwapped(
                operatorId,
                bytes(LibString.slice(string(expectedPublicKeys), key1Start, key1End)),
                bytes(LibString.slice(string(expectedPublicKeys), key2Start, key2End))
            );

            j++;
        }

        // Report the out of order exits of `FIRST_CALL_EXIT_COUNT` validators starting at index `FIRST_CALL_STARTING_INDEX`.
        reETH.operatorRegistry.reportOutOfOrderValidatorExits(
            operatorId, FIRST_CALL_STARTING_INDEX, FIRST_CALL_EXIT_COUNT
        );

        // Report the remaining exits now that there is no longer a gap.
        uint256 SECOND_CALL_EXIT_COUNT = OOO_EXIT_COUNT - FIRST_CALL_EXIT_COUNT;

        vm.expectEmit(true, false, false, true, address(reETH.operatorRegistry));
        emit IRioLRTOperatorRegistry.OperatorOutOfOrderValidatorExitsReported(operatorId, SECOND_CALL_EXIT_COUNT);

        vm.recordLogs();

        // Report the out of order exits of `SECOND_CALL_EXIT_COUNT` validators starting at index `OOO_EXIT_STARTING_INDEX`.
        reETH.operatorRegistry.reportOutOfOrderValidatorExits(
            operatorId, OOO_EXIT_STARTING_INDEX, SECOND_CALL_EXIT_COUNT
        );

        // No swapping events should have been emitted.
        Vm.Log[] memory logs = vm.getRecordedLogs();
        assertEq(logs.length, 1);

        details = reETH.operatorRegistry.getOperatorDetails(operatorId);
        assertEq(details.validatorDetails.exited, OOO_EXIT_COUNT);
    }

    function test_syncStrategyShares() public {
        // First, set up an edge case scenario where the actual operator allocation can differ very
        // slightly from the stored allocation due to rounding differences.
        uint8[] memory operatorIds = addOperatorDelegators(reLST.operatorRegistry, address(reLST.rewardDistributor), 1);

        // Deposit and push the balance into EigenLayer.
        cbETH.approve(address(reLST.coordinator), type(uint256).max);
        reLST.coordinator.depositERC20(CBETH_ADDRESS, 100e18);

        vm.prank(EOA, EOA);
        reLST.coordinator.rebalanceERC20(CBETH_ADDRESS);

        // Donate 10 wei of cbETH to the EigenLayer strategy.
        cbETH.transfer(address(0x54945180dB7943c0ed0FEE7EdaB2Bd24620256bc), 10);

        reLST.coordinator.depositERC20(CBETH_ADDRESS, 100000000000000000010);
        skip(reLST.coordinator.rebalanceDelay());

        vm.prank(EOA, EOA);
        reLST.coordinator.rebalanceERC20(CBETH_ADDRESS);

        uint128 storedAllocationBefore = reLST.operatorRegistry.getOperatorShareDetails(1, CBETH_STRATEGY).allocation;
        assertEq(storedAllocationBefore, 200000000000000000000);

        // Sync the strategy shares with EigenLayer.
        reLST.operatorRegistry.syncStrategyShares(operatorIds, CBETH_STRATEGY);

        // Ensure the stored allocation is updated to the actual allocation.
        uint128 storedAllocationAfter = reLST.operatorRegistry.getOperatorShareDetails(1, CBETH_STRATEGY).allocation;
        assertEq(storedAllocationAfter, 199999999999999999999);
    }

    function test_removeValidatorDetailsDepositedKeysReverts() public {
        uint8 operatorId =
            addOperatorDelegator(reETH.operatorRegistry, address(reETH.rewardDistributor), emptyStrategyShareCaps, 10);

        vm.prank(address(reETH.depositPool));
        reETH.operatorRegistry.allocateETHDeposits(10);

        vm.expectRevert(abi.encodeWithSelector(IRioLRTOperatorRegistry.INVALID_INDEX.selector));
        reETH.operatorRegistry.removeValidatorDetails(operatorId, 1, 1);
    }

    function test_removeValidatorDetailsRemovesPendingKeys() public {
        uint8 operatorId =
            addOperatorDelegator(reETH.operatorRegistry, address(reETH.rewardDistributor), emptyStrategyShareCaps, 0);

        // Add validator keys, but do not allow enough time for them to confirm.
        uint40 validatorCount = 10;
        (bytes memory publicKeys, bytes memory signatures) = TestUtils.getValidatorKeys(validatorCount);
        reETH.operatorRegistry.addValidatorDetails(operatorId, validatorCount, publicKeys, signatures);

        IRioLRTOperatorRegistry.OperatorPublicDetails memory operator;

        operator = reETH.operatorRegistry.getOperatorDetails(operatorId);
        assertEq(operator.validatorDetails.confirmed, 0);
        assertEq(operator.validatorDetails.total, 10);

        // Remove 5 validators starting at index 5.
        reETH.operatorRegistry.removeValidatorDetails(operatorId, 5, 5);

        operator = reETH.operatorRegistry.getOperatorDetails(operatorId);
        assertEq(operator.validatorDetails.confirmed, 0);
        assertEq(operator.validatorDetails.total, 5); // Total has been decreased by 5.
    }

    function test_removeValidatorDetailsRemovesConfirmedKeys() public {
        uint8 operatorId =
            addOperatorDelegator(reETH.operatorRegistry, address(reETH.rewardDistributor), emptyStrategyShareCaps, 0);

        // Add 10 validator keys and allow enough time for them to confirm.
        (bytes memory publicKeys, bytes memory signatures) = TestUtils.getValidatorKeys(10);
        reETH.operatorRegistry.addValidatorDetails(operatorId, 10, publicKeys, signatures);

        // Fast forward to allow validator keys time to confirm.
        skip(reETH.operatorRegistry.validatorKeyReviewPeriod());

        // Add 10 more validator keys and leave them pending in order to confirm the first 10.
        reETH.operatorRegistry.addValidatorDetails(operatorId, 10, publicKeys, signatures);

        // Fast forward, but not enough for new keys to confirm.
        skip(reETH.operatorRegistry.validatorKeyReviewPeriod() / 2);

        IRioLRTOperatorRegistry.OperatorPublicDetails memory operator;

        operator = reETH.operatorRegistry.getOperatorDetails(operatorId);
        assertEq(operator.validatorDetails.confirmed, 10);
        assertEq(operator.validatorDetails.total, 20);

        // Remove 10 validators starting at index 3.
        uint40 fromIndex = 3;
        uint40 validatorsToRemove = 10;
        reETH.operatorRegistry.removeValidatorDetails(operatorId, fromIndex, validatorsToRemove);

        operator = reETH.operatorRegistry.getOperatorDetails(operatorId);
        assertEq(operator.validatorDetails.confirmed, fromIndex); // Confirmed has been decreased to the `fromIndex`.
        assertEq(operator.validatorDetails.total, 20 - validatorsToRemove); // Total has been decreased by `validatorsToRemove`.
    }

    function test_allocateStrategySharesInvalidCallerReverts() public {
        vm.expectRevert(abi.encodeWithSelector(RioLRTCore.ONLY_DEPOSIT_POOL.selector));
        reLST.operatorRegistry.allocateStrategyShares(CBETH_STRATEGY, 1);
    }

    function test_allocateStrategySharesNoAvailableOperatorsReturnsZeroAllocation() public {
        vm.prank(address(reLST.depositPool));
        (uint256 sharesAllocated, IRioLRTOperatorRegistry.OperatorStrategyAllocation[] memory allocations) =
            reLST.operatorRegistry.allocateStrategyShares(CBETH_STRATEGY, 1);

        assertEq(sharesAllocated, 0);
        assertEq(allocations.length, 0);
    }

    function test_allocateStrategySharesFullyAllocatedExact() public {
        uint128 STRATEGY_CAP = 40e18;

        // Add 10 operator delegators
        IRioLRTOperatorRegistry.StrategyShareCap[] memory strategyShareCaps =
            new IRioLRTOperatorRegistry.StrategyShareCap[](1);
        strategyShareCaps[0] = IRioLRTOperatorRegistry.StrategyShareCap({strategy: CBETH_STRATEGY, cap: STRATEGY_CAP});

        addOperatorDelegators(reLST.operatorRegistry, address(reLST.rewardDistributor), 10, strategyShareCaps, 0);

        uint256 TOTAL_ALLOCATION = STRATEGY_CAP * 10;

        vm.prank(address(reLST.depositPool));
        (uint256 sharesAllocated, IRioLRTOperatorRegistry.OperatorStrategyAllocation[] memory allocations) =
            reLST.operatorRegistry.allocateStrategyShares(CBETH_STRATEGY, TOTAL_ALLOCATION);
        assertEq(sharesAllocated, TOTAL_ALLOCATION);
        assertEq(allocations.length, 10);

        for (uint256 i = 0; i < allocations.length; i++) {
            assertEq(allocations[i].shares, STRATEGY_CAP);
            assertEq(allocations[i].tokens, STRATEGY_CAP);
        }
    }

    function test_allocateStrategySharesOverAllocationIsCapped() public {
        uint128 STRATEGY_CAP = 50e18;

        // Add 10 operator delegators
        IRioLRTOperatorRegistry.StrategyShareCap[] memory strategyShareCaps =
            new IRioLRTOperatorRegistry.StrategyShareCap[](1);
        strategyShareCaps[0] = IRioLRTOperatorRegistry.StrategyShareCap({strategy: CBETH_STRATEGY, cap: STRATEGY_CAP});

        addOperatorDelegators(reLST.operatorRegistry, address(reLST.rewardDistributor), 10, strategyShareCaps, 0);

        uint256 TOTAL_ALLOCATION = STRATEGY_CAP * 10;

        vm.prank(address(reLST.depositPool));
        (uint256 sharesAllocated, IRioLRTOperatorRegistry.OperatorStrategyAllocation[] memory allocations) = reLST
            .operatorRegistry
            .allocateStrategyShares(
            CBETH_STRATEGY,
            TOTAL_ALLOCATION + STRATEGY_CAP // Requesting more than available
        );
        assertEq(sharesAllocated, TOTAL_ALLOCATION);
        assertEq(allocations.length, 10);

        for (uint256 i = 0; i < allocations.length; i++) {
            assertEq(allocations[i].shares, STRATEGY_CAP);
            assertEq(allocations[i].tokens, STRATEGY_CAP);
        }
    }

    function test_allocateStrategySharesPartiallyAllocated() public {
        uint128 STRATEGY_CAP = 1.5e18;

        // Add 10 operator delegators
        IRioLRTOperatorRegistry.StrategyShareCap[] memory strategyShareCaps =
            new IRioLRTOperatorRegistry.StrategyShareCap[](1);
        strategyShareCaps[0] = IRioLRTOperatorRegistry.StrategyShareCap({strategy: CBETH_STRATEGY, cap: STRATEGY_CAP});

        addOperatorDelegators(reLST.operatorRegistry, address(reLST.rewardDistributor), 10, strategyShareCaps, 0);

        uint256 PARTIAL_ALLOCATION = (STRATEGY_CAP * 2) + (STRATEGY_CAP / 2);

        vm.prank(address(reLST.depositPool));
        (uint256 sharesAllocated, IRioLRTOperatorRegistry.OperatorStrategyAllocation[] memory allocations) =
            reLST.operatorRegistry.allocateStrategyShares(CBETH_STRATEGY, PARTIAL_ALLOCATION);
        assertEq(sharesAllocated, PARTIAL_ALLOCATION);
        assertEq(allocations.length, 3);

        assertEq(allocations[0].shares, STRATEGY_CAP);
        assertEq(allocations[0].tokens, STRATEGY_CAP);
        assertEq(allocations[1].shares, STRATEGY_CAP);
        assertEq(allocations[1].tokens, STRATEGY_CAP);
        assertEq(allocations[2].shares, STRATEGY_CAP / 2);
        assertEq(allocations[2].tokens, STRATEGY_CAP / 2);
    }

    function test_allocateETHDepositsNoAvailableOperatorsReturnsZeroAllocation() public {
        vm.prank(address(reETH.depositPool));
        (uint256 depositsAllocated, IRioLRTOperatorRegistry.OperatorETHAllocation[] memory allocations) =
            reETH.operatorRegistry.allocateETHDeposits(1);

        assertEq(depositsAllocated, 0);
        assertEq(allocations.length, 0);
    }

    function test_allocateETHDepositsWithNoConfirmedKeysReturnsZeroAllocation() public {
        uint8 operatorId =
            addOperatorDelegator(reETH.operatorRegistry, address(reETH.rewardDistributor), emptyStrategyShareCaps, 0);

        // Add validator keys, but do not allow enough time for them to confirm.
        uint40 VALIDATOR_CAP = 10;
        (bytes memory publicKeys, bytes memory signatures) = TestUtils.getValidatorKeys(VALIDATOR_CAP);
        reETH.operatorRegistry.addValidatorDetails(operatorId, VALIDATOR_CAP, publicKeys, signatures);

        vm.prank(address(reETH.depositPool));
        (uint256 depositsAllocated, IRioLRTOperatorRegistry.OperatorETHAllocation[] memory allocations) =
            reETH.operatorRegistry.allocateETHDeposits(VALIDATOR_CAP);

        assertEq(depositsAllocated, 0);
        assertEq(allocations.length, 0);
    }

    function test_allocateETHDepositsFullyAllocatedExact() public {
        uint8 OPERATOR_COUNT = 10;
        uint40 VALIDATORS_PER_OPERATOR = 5;

        // Create 10 operator delegator with 5 validators each and fast forward to allow keys to confirm.
        addOperatorDelegators(
            reETH.operatorRegistry,
            address(reETH.rewardDistributor),
            OPERATOR_COUNT,
            emptyStrategyShareCaps,
            VALIDATORS_PER_OPERATOR
        );

        uint256 TOTAL_DEPOSITS_TO_ALLOCATE = OPERATOR_COUNT * VALIDATORS_PER_OPERATOR;

        vm.prank(address(reETH.depositPool));
        (uint256 depositsAllocated, IRioLRTOperatorRegistry.OperatorETHAllocation[] memory allocations) =
            reETH.operatorRegistry.allocateETHDeposits(TOTAL_DEPOSITS_TO_ALLOCATE);
        assertEq(depositsAllocated, TOTAL_DEPOSITS_TO_ALLOCATE);
        assertEq(allocations.length, OPERATOR_COUNT);

        for (uint256 i = 0; i < allocations.length; i++) {
            assertEq(allocations[i].deposits, VALIDATORS_PER_OPERATOR);
        }
    }

    function test_allocateETHDepositsOverAllocationIsCapped() public {
        uint8 OPERATOR_COUNT = 10;
        uint40 VALIDATORS_PER_OPERATOR = 5;

        // Create 10 operator delegator with 5 validators each and fast forward to allow keys to confirm.
        addOperatorDelegators(
            reETH.operatorRegistry,
            address(reETH.rewardDistributor),
            OPERATOR_COUNT,
            emptyStrategyShareCaps,
            VALIDATORS_PER_OPERATOR
        );

        uint256 TOTAL_DEPOSITS_TO_ALLOCATE = OPERATOR_COUNT * VALIDATORS_PER_OPERATOR;

        vm.prank(address(reETH.depositPool));
        (uint256 depositsAllocated, IRioLRTOperatorRegistry.OperatorETHAllocation[] memory allocations) = reETH
            .operatorRegistry
            .allocateETHDeposits(
            TOTAL_DEPOSITS_TO_ALLOCATE + 2 // Requesting more than available
        );
        assertEq(depositsAllocated, TOTAL_DEPOSITS_TO_ALLOCATE);
        assertEq(allocations.length, OPERATOR_COUNT);

        for (uint256 i = 0; i < allocations.length; i++) {
            assertEq(allocations[i].deposits, VALIDATORS_PER_OPERATOR);
        }
    }

    function test_allocateETHDepositsPartiallyAllocated() public {
        uint8 OPERATOR_COUNT = 10;
        uint40 VALIDATORS_PER_OPERATOR = 5;

        // Create 10 operator delegator with 5 validators each and fast forward to allow keys to confirm.
        addOperatorDelegators(
            reETH.operatorRegistry,
            address(reETH.rewardDistributor),
            OPERATOR_COUNT,
            emptyStrategyShareCaps,
            VALIDATORS_PER_OPERATOR
        );

        uint256 TOTAL_DEPOSITS_TO_ALLOCATE_PARTIAL = (VALIDATORS_PER_OPERATOR * 2) + (VALIDATORS_PER_OPERATOR / 2);

        vm.prank(address(reETH.depositPool));
        (uint256 depositsAllocated, IRioLRTOperatorRegistry.OperatorETHAllocation[] memory allocations) =
            reETH.operatorRegistry.allocateETHDeposits(TOTAL_DEPOSITS_TO_ALLOCATE_PARTIAL);
        assertEq(depositsAllocated, TOTAL_DEPOSITS_TO_ALLOCATE_PARTIAL);
        assertEq(allocations.length, 3);

        assertEq(allocations[0].deposits, VALIDATORS_PER_OPERATOR);
        assertEq(allocations[1].deposits, VALIDATORS_PER_OPERATOR);
        assertEq(allocations[2].deposits, VALIDATORS_PER_OPERATOR / 2);
    }

    function test_allocateETHDepositsSkipsOperatorsWithNoConfirmedKeys() public {
        uint40 VALIDATORS_PER_OPERATOR = 10;

        // Create an operator without uploading any keys.
        address operator = address(99);
        vm.prank(operator);
        delegationManager.registerAsOperator(
            IDelegationManager.OperatorDetails({
                earningsReceiver: address(reETH.rewardDistributor),
                delegationApprover: address(0),
                stakerOptOutWindowBlocks: 0
            }),
            metadataURI
        );
        reETH.operatorRegistry.addOperator(
            IRioLRTOperatorRegistry.OperatorConfig({
                operator: operator,
                initialManager: address(this),
                initialEarningsReceiver: address(this),
                initialMetadataURI: metadataURI,
                strategyShareCaps: emptyStrategyShareCaps,
                validatorCap: VALIDATORS_PER_OPERATOR
            })
        );

        // Create an operator with confirmed keys.
        uint8 operatorTwoId = addOperatorDelegator(
            reETH.operatorRegistry, address(reETH.rewardDistributor), emptyStrategyShareCaps, VALIDATORS_PER_OPERATOR
        );
        address operatorDelegator = reETH.operatorRegistry.getOperatorDetails(operatorTwoId).delegator;

        vm.prank(address(reETH.depositPool));
        (uint256 depositsAllocated, IRioLRTOperatorRegistry.OperatorETHAllocation[] memory allocations) = reETH
            .operatorRegistry
            .allocateETHDeposits(
            VALIDATORS_PER_OPERATOR * 2 // Try to allocate to both operators.
        );
        assertEq(depositsAllocated, VALIDATORS_PER_OPERATOR); // Only the operator with confirmed keys should be allocated to.
        assertEq(allocations.length, 1);

        assertEq(allocations[0].delegator, operatorDelegator);
        assertEq(allocations[0].deposits, VALIDATORS_PER_OPERATOR);
    }

    function test_deallocateAllStrategyShares() public {
        uint128 STRATEGY_CAP = 40e18;

        // Add 10 operator delegators
        IRioLRTOperatorRegistry.StrategyShareCap[] memory strategyShareCaps =
            new IRioLRTOperatorRegistry.StrategyShareCap[](1);
        strategyShareCaps[0] = IRioLRTOperatorRegistry.StrategyShareCap({strategy: CBETH_STRATEGY, cap: STRATEGY_CAP});

        addOperatorDelegators(reLST.operatorRegistry, address(reLST.rewardDistributor), 10, strategyShareCaps, 0);

        uint256 TOTAL_ALLOCATION = STRATEGY_CAP * 10;

        vm.prank(address(reLST.depositPool));
        reLST.operatorRegistry.allocateStrategyShares(CBETH_STRATEGY, TOTAL_ALLOCATION);

        vm.prank(address(reLST.coordinator));
        (uint256 sharesDeallocated, IRioLRTOperatorRegistry.OperatorStrategyDeallocation[] memory deallocations) =
            reLST.operatorRegistry.deallocateStrategyShares(CBETH_STRATEGY, TOTAL_ALLOCATION);

        assertEq(sharesDeallocated, TOTAL_ALLOCATION);
        assertEq(deallocations.length, 10);

        for (uint256 i = 0; i < deallocations.length; i++) {
            assertEq(deallocations[i].shares, STRATEGY_CAP);
            assertEq(deallocations[i].tokens, STRATEGY_CAP);
        }
    }

    function test_deallocateAllETHDeposits() public {
        uint8 OPERATOR_COUNT = 10;
        uint40 VALIDATORS_PER_OPERATOR = 5;

        // Create 10 operator delegator with 5 validators each and fast forward to allow keys to confirm.
        uint8[] memory operatorIds = addOperatorDelegators(
            reETH.operatorRegistry,
            address(reETH.rewardDistributor),
            OPERATOR_COUNT,
            emptyStrategyShareCaps,
            VALIDATORS_PER_OPERATOR
        );

        uint256 TOTAL_DEPOSITS = OPERATOR_COUNT * VALIDATORS_PER_OPERATOR;

        vm.prank(address(reETH.depositPool));
        reETH.operatorRegistry.allocateETHDeposits(TOTAL_DEPOSITS);

        IRioLRTOperatorRegistry.OperatorValidatorDetails memory validatorDetails;
        for (uint256 i = 0; i < operatorIds.length; i++) {
            validatorDetails = reETH.operatorRegistry.getOperatorDetails(operatorIds[i]).validatorDetails;
            assertEq(validatorDetails.total, VALIDATORS_PER_OPERATOR);
            assertEq(validatorDetails.confirmed, VALIDATORS_PER_OPERATOR);
            assertEq(validatorDetails.deposited, VALIDATORS_PER_OPERATOR);
            assertEq(validatorDetails.exited, 0);
        }

        vm.prank(address(reETH.coordinator));
        (uint256 depositsDeallocated, IRioLRTOperatorRegistry.OperatorETHDeallocation[] memory deallocations) =
            reETH.operatorRegistry.deallocateETHDeposits(TOTAL_DEPOSITS);

        assertEq(depositsDeallocated, TOTAL_DEPOSITS);
        assertEq(deallocations.length, OPERATOR_COUNT);

        for (uint256 i = 0; i < deallocations.length; i++) {
            assertEq(deallocations[i].deposits, VALIDATORS_PER_OPERATOR);
        }
        for (uint256 i = 0; i < operatorIds.length; i++) {
            validatorDetails = reETH.operatorRegistry.getOperatorDetails(operatorIds[i]).validatorDetails;
            assertEq(validatorDetails.total, VALIDATORS_PER_OPERATOR);
            assertEq(validatorDetails.confirmed, VALIDATORS_PER_OPERATOR);
            assertEq(validatorDetails.deposited, VALIDATORS_PER_OPERATOR);
            assertEq(validatorDetails.exited, VALIDATORS_PER_OPERATOR);
        }
    }

    function test_deallocateSomeETHDeposits() public {
        uint8 OPERATOR_COUNT = 10;
        uint40 VALIDATORS_PER_OPERATOR = 5;

        // Create 10 operator delegator with 5 validators each and fast forward to allow keys to confirm.
        uint8[] memory operatorIds = addOperatorDelegators(
            reETH.operatorRegistry,
            address(reETH.rewardDistributor),
            OPERATOR_COUNT,
            emptyStrategyShareCaps,
            VALIDATORS_PER_OPERATOR
        );

        uint256 TOTAL_DEPOSITS = OPERATOR_COUNT * VALIDATORS_PER_OPERATOR;

        vm.prank(address(reETH.depositPool));
        reETH.operatorRegistry.allocateETHDeposits(TOTAL_DEPOSITS);

        IRioLRTOperatorRegistry.OperatorValidatorDetails memory validatorDetails;
        for (uint256 i = 0; i < operatorIds.length; i++) {
            validatorDetails = reETH.operatorRegistry.getOperatorDetails(operatorIds[i]).validatorDetails;
            assertEq(validatorDetails.total, VALIDATORS_PER_OPERATOR);
            assertEq(validatorDetails.confirmed, VALIDATORS_PER_OPERATOR);
            assertEq(validatorDetails.deposited, VALIDATORS_PER_OPERATOR);
            assertEq(validatorDetails.exited, 0);
        }

        uint256 DEPOSITS_TO_DEALLOCATE = 17;

        vm.prank(address(reETH.coordinator));
        (uint256 depositsDeallocated, IRioLRTOperatorRegistry.OperatorETHDeallocation[] memory deallocations) =
            reETH.operatorRegistry.deallocateETHDeposits(DEPOSITS_TO_DEALLOCATE);

        assertEq(depositsDeallocated, DEPOSITS_TO_DEALLOCATE);
        assertEq(deallocations.length, 4);

        assertEq(deallocations[0].deposits, VALIDATORS_PER_OPERATOR);
        assertEq(deallocations[1].deposits, VALIDATORS_PER_OPERATOR);
        assertEq(deallocations[2].deposits, VALIDATORS_PER_OPERATOR);
        assertEq(deallocations[3].deposits, 2);

        uint256 fullyExitedCount;
        uint256 partiallyExitedCount;
        uint256 notExitedCount;
        for (uint256 i = 0; i < operatorIds.length; i++) {
            validatorDetails = reETH.operatorRegistry.getOperatorDetails(operatorIds[i]).validatorDetails;
            assertEq(validatorDetails.total, VALIDATORS_PER_OPERATOR);
            assertEq(validatorDetails.confirmed, VALIDATORS_PER_OPERATOR);
            assertEq(validatorDetails.deposited, VALIDATORS_PER_OPERATOR);

            if (validatorDetails.exited == VALIDATORS_PER_OPERATOR) {
                fullyExitedCount++;
            } else if (validatorDetails.exited == 0) {
                notExitedCount++;
            } else {
                partiallyExitedCount++;
            }
        }
        assertEq(fullyExitedCount, 3);
        assertEq(partiallyExitedCount, 1);
        assertEq(notExitedCount, 6);
    }
}
