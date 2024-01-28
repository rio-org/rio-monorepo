// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {Math} from '@openzeppelin/contracts/utils/math/Math.sol';
import {IDelegationManager} from 'contracts/interfaces/eigenlayer/IDelegationManager.sol';
import {IRioLRTOperatorRegistry} from 'contracts/interfaces/IRioLRTOperatorRegistry.sol';
import {RioLRTCore} from 'contracts/restaking/base/RioLRTCore.sol';
import {RioDeployer} from 'test/utils/RioDeployer.sol';
import {TestUtils} from 'test/utils/TestUtils.sol';

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

    function test_activateOperator() public {
        uint8 operatorId = addOperatorDelegator(reETH.operatorRegistry, address(reETH.rewardDistributor));
        reETH.operatorRegistry.deactivateOperator(operatorId);

        reETH.operatorRegistry.activateOperator(operatorId);

        IRioLRTOperatorRegistry.OperatorPublicDetails memory operatorDetails =
            reETH.operatorRegistry.getOperatorDetails(operatorId);
        assertEq(operatorDetails.active, true);
        assertEq(reETH.operatorRegistry.activeOperatorCount(), 1);
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

        assertEq(allocations[0].operator, operatorDelegator);
        assertEq(allocations[0].deposits, VALIDATORS_PER_OPERATOR);
    }
}
