// // SPDX-License-Identifier: GPL-3.0
// pragma solidity 0.8.21;

// import {Math} from '@openzeppelin/contracts/utils/math/Math.sol';
// import {IBLSPublicKeyCompendium} from 'contracts/interfaces/eigenlayer/IBLSPublicKeyCompendium.sol';
// import {IRioLRTOperatorRegistry} from 'contracts/interfaces/IRioLRTOperatorRegistry.sol';
// import {IRioLRTOperator} from 'contracts/interfaces/IRioLRTOperator.sol';
// import {IRioLRTIssuer} from 'contracts/interfaces/IRioLRTIssuer.sol';
// import {RioDeployer} from 'test/utils/RioDeployer.sol';
// import {TestUtils} from 'test/utils/TestUtils.sol';

// contract RioLRTOperatorRegistryTest is RioDeployer {
//     IRioLRTIssuer.LRTDeployment public deployment;
//     IRioLRTOperatorRegistry public operatorRegistry;
//     IRioLRTOperatorRegistry.StrategyShareCap[] public defaultStrategyShareCaps;
//     IRioLRTOperator.BLSRegistrationDetails public defaultBlsDetails;

//     bytes32 public constant DEFAULT_SALT = bytes32(bytes('FAKE_OPERATOR'));
//     uint128 public constant DEFAULT_STRATEGY_CAP = 100 ether;

//     function setUp() public {
//         deployRio();

//         (deployment,) = issueRestakedETH();
//         operatorRegistry = IRioLRTOperatorRegistry(deployment.operatorRegistry);

//         defaultStrategyShareCaps.push(
//             IRioLRTOperatorRegistry.StrategyShareCap({strategy: STETH_STRATEGY, cap: DEFAULT_STRATEGY_CAP})
//         );

//         uint256[2] memory elements = [uint256(0), uint256(0)];
//         defaultBlsDetails = IRioLRTOperator.BLSRegistrationDetails({
//             signedMessageHash: IBLSPublicKeyCompendium.G1Point(0, 0),
//             pubkeyG1: IBLSPublicKeyCompendium.G1Point(0, 0),
//             pubkeyG2: IBLSPublicKeyCompendium.G2Point(elements, elements)
//         });

//         // Ignore BLS key validation
//         vm.mockCall(
//             BLS_PUBLIC_KEY_COMPENDIUM_ADDRESS,
//             abi.encodeWithSelector(IBLSPublicKeyCompendium.registerBLSPublicKey.selector),
//             new bytes(0)
//         );

//         // Stub Ethereum POS deposits
//         vm.mockCall(
//             ETH_POS_ADDRESS,
//             abi.encodeWithSelector(0x22895118), // deposit(bytes,bytes,bytes,bytes32)
//             new bytes(0)
//         );
//     }

//     function testFuzz_allocateETHDeposits(uint8 operatorCount, uint8 validatorsPerOperator, uint16 depositsToAllocate)
//         public
//     {
//         vm.assume(operatorCount > 0 && operatorCount <= 64);
//         vm.assume(validatorsPerOperator > 0);
//         vm.assume(depositsToAllocate > 0 && depositsToAllocate <= 100);

//         (bytes memory publicKeys, bytes memory signatures) = TestUtils.getValidatorKeys(validatorsPerOperator);

//         // Create 10 operators
//         for (uint256 i = 0; i < operatorCount; i++) {
//             (uint8 operatorId,) = operatorRegistry.createOperator(
//                 address(this),
//                 address(this),
//                 'https://example.com/metadata.json',
//                 defaultBlsDetails,
//                 defaultStrategyShareCaps,
//                 validatorsPerOperator,
//                 bytes32(i) // Salt
//             );

//             // Upload validator keys
//             operatorRegistry.addValidatorDetails(operatorId, validatorsPerOperator, publicKeys, signatures);

//             // Fast forward to allow validator keys time to confirm.
//             skip(operatorRegistry.validatorKeyReviewPeriod());
//         }

//         vm.prank(deployment.assetManager);
//         (uint256 depositsAllocated, IRioLRTOperatorRegistry.OperatorETHAllocation[] memory allocations) =
//             operatorRegistry.allocateETHDeposits(depositsToAllocate);

//         assertEq(
//             depositsAllocated, Math.min(uint256(depositsToAllocate), uint256(operatorCount) * validatorsPerOperator)
//         );

//         for (uint256 i = 0; i < allocations.length - 1; ++i) {
//             assertEq(allocations[i].deposits, validatorsPerOperator);
//         }
//         uint256 remainingDeposits = depositsAllocated % validatorsPerOperator;
//         uint256 expectedDeposits = remainingDeposits > 0 ? remainingDeposits : validatorsPerOperator;
//         assertEq(allocations[allocations.length - 1].deposits, expectedDeposits);
//     }

//     function test_createOperatorWithoutManagerReverts() public {
//         vm.expectRevert(abi.encodeWithSelector(IRioLRTOperatorRegistry.INVALID_MANAGER.selector));
//         operatorRegistry.createOperator(
//             address(0), // No manager
//             address(this),
//             'https://example.com/metadata.json',
//             defaultBlsDetails,
//             defaultStrategyShareCaps,
//             100,
//             DEFAULT_SALT
//         );
//     }

//     function test_createOperatorWithoutEarningsReceiverReverts() public {
//         vm.expectRevert(abi.encodeWithSelector(IRioLRTOperatorRegistry.INVALID_EARNINGS_RECEIVER.selector));
//         operatorRegistry.createOperator(
//             address(this),
//             address(0), // No earnings receiver
//             'https://example.com/metadata.json',
//             defaultBlsDetails,
//             defaultStrategyShareCaps,
//             100,
//             DEFAULT_SALT
//         );
//     }

//     function test_createOperatorWithoutMetadataReverts() public {
//         vm.expectRevert(abi.encodeWithSelector(IRioLRTOperatorRegistry.INVALID_METADATA_URI.selector));
//         operatorRegistry.createOperator(
//             address(this),
//             address(this),
//             '', // No metadata
//             defaultBlsDetails,
//             defaultStrategyShareCaps,
//             100,
//             DEFAULT_SALT
//         );
//     }

//     function test_createOperator() public {
//         uint40 validatorCap = 100;
//         (uint8 operatorId, address operatorContract) = operatorRegistry.createOperator(
//             address(this),
//             address(this),
//             'https://example.com/metadata.json',
//             defaultBlsDetails,
//             defaultStrategyShareCaps,
//             validatorCap,
//             DEFAULT_SALT
//         );
//         assertEq(operatorId, 1);
//         assertNotEq(operatorContract, address(0));

//         IRioLRTOperatorRegistry.OperatorPublicDetails memory operatorDetails =
//             operatorRegistry.getOperatorDetails(operatorId);

//         assertEq(operatorDetails.active, true);
//         assertEq(operatorDetails.manager, address(this));
//         assertEq(operatorDetails.pendingManager, address(0));
//         assertEq(operatorDetails.earningsReceiver, address(this));
//         assertEq(operatorDetails.validatorDetails.cap, validatorCap);

//         assertEq(operatorRegistry.operatorCount(), 1);
//         assertEq(operatorRegistry.activeOperatorCount(), 1);
//         assertEq(operatorRegistry.predictOperatorAddress(DEFAULT_SALT), operatorContract);

//         for (uint256 i = 0; i < defaultStrategyShareCaps.length; i++) {
//             IRioLRTOperatorRegistry.OperatorShareDetails memory operatorShareDetails =
//                 operatorRegistry.getOperatorShareDetails(operatorId, defaultStrategyShareCaps[i].strategy);

//             assertEq(operatorShareDetails.cap, defaultStrategyShareCaps[i].cap);
//             assertEq(operatorShareDetails.allocation, 0);
//         }
//     }

//     function test_deactivateOperatorInvalidOperatorReverts() public {
//         vm.expectRevert(abi.encodeWithSelector(IRioLRTOperatorRegistry.INVALID_OPERATOR.selector));
//         operatorRegistry.deactivateOperator(99);
//     }

//     function test_deactivateOperatorAlreadyInactiveReverts() public {
//         (uint8 operatorId,) = operatorRegistry.createOperator(
//             address(this),
//             address(this),
//             'https://example.com/metadata.json',
//             defaultBlsDetails,
//             defaultStrategyShareCaps,
//             100,
//             DEFAULT_SALT
//         );
//         operatorRegistry.deactivateOperator(operatorId);

//         vm.expectRevert(abi.encodeWithSelector(IRioLRTOperatorRegistry.OPERATOR_ALREADY_INACTIVE.selector));
//         operatorRegistry.deactivateOperator(operatorId);
//     }

//     function test_deactivateOperator() public {
//         (uint8 operatorId,) = operatorRegistry.createOperator(
//             address(this),
//             address(this),
//             'https://example.com/metadata.json',
//             defaultBlsDetails,
//             defaultStrategyShareCaps,
//             100,
//             DEFAULT_SALT
//         );
//         IRioLRTOperatorRegistry.OperatorPublicDetails memory operatorDetails =
//             operatorRegistry.getOperatorDetails(operatorId);
//         assertEq(operatorDetails.active, true);
//         assertEq(operatorRegistry.activeOperatorCount(), 1);

//         operatorRegistry.deactivateOperator(operatorId);

//         operatorDetails = operatorRegistry.getOperatorDetails(operatorId);
//         assertEq(operatorDetails.active, false);
//         assertEq(operatorRegistry.activeOperatorCount(), 0);
//     }

//     function test_activateOperator() public {
//         (uint8 operatorId,) = operatorRegistry.createOperator(
//             address(this),
//             address(this),
//             'https://example.com/metadata.json',
//             defaultBlsDetails,
//             defaultStrategyShareCaps,
//             100,
//             DEFAULT_SALT
//         );
//         operatorRegistry.deactivateOperator(operatorId);

//         operatorRegistry.activateOperator(operatorId);

//         IRioLRTOperatorRegistry.OperatorPublicDetails memory operatorDetails =
//             operatorRegistry.getOperatorDetails(operatorId);
//         assertEq(operatorDetails.active, true);
//         assertEq(operatorRegistry.activeOperatorCount(), 1);
//     }

//     function test_allocateStrategySharesInvalidCallerReverts() public {
//         vm.expectRevert(abi.encodeWithSelector(IRioLRTOperatorRegistry.ONLY_ASSET_MANAGER.selector));
//         operatorRegistry.allocateStrategyShares(STETH_STRATEGY, 1);
//     }

//     function test_allocateStrategySharesNoAvailableOperatorsReverts() public {
//         vm.expectRevert(abi.encodeWithSelector(IRioLRTOperatorRegistry.NO_AVAILABLE_OPERATORS_FOR_ALLOCATION.selector));
//         vm.prank(deployment.assetManager);
//         operatorRegistry.allocateStrategyShares(STETH_STRATEGY, 1);
//     }

//     function test_allocateStrategySharesFullyAllocatedExact() public {
//         // Create 10 operators
//         for (uint256 i = 0; i < 10; i++) {
//             operatorRegistry.createOperator(
//                 address(this),
//                 address(this),
//                 'https://example.com/metadata.json',
//                 defaultBlsDetails,
//                 defaultStrategyShareCaps,
//                 100,
//                 bytes32(i) // Salt
//             );
//         }

//         uint256 TOTAL_ALLOCATION = DEFAULT_STRATEGY_CAP * 10;

//         vm.prank(deployment.assetManager);
//         (uint256 sharesAllocated, IRioLRTOperatorRegistry.OperatorStrategyAllocation[] memory allocations) =
//             operatorRegistry.allocateStrategyShares(STETH_STRATEGY, TOTAL_ALLOCATION);
//         assertEq(sharesAllocated, TOTAL_ALLOCATION);
//         assertEq(allocations.length, 10);

//         for (uint256 i = 0; i < allocations.length; i++) {
//             assertEq(allocations[i].shares, DEFAULT_STRATEGY_CAP);
//             assertEq(allocations[i].tokens, DEFAULT_STRATEGY_CAP);
//         }
//     }

//     function test_allocateStrategySharesOverAllocationIsCapped() public {
//         // Create 10 operators
//         for (uint256 i = 0; i < 10; i++) {
//             operatorRegistry.createOperator(
//                 address(this),
//                 address(this),
//                 'https://example.com/metadata.json',
//                 defaultBlsDetails,
//                 defaultStrategyShareCaps,
//                 100,
//                 bytes32(i) // Salt
//             );
//         }

//         uint256 TOTAL_ALLOCATION = DEFAULT_STRATEGY_CAP * 10;

//         vm.prank(deployment.assetManager);
//         (uint256 sharesAllocated, IRioLRTOperatorRegistry.OperatorStrategyAllocation[] memory allocations) =
//         operatorRegistry.allocateStrategyShares(
//             STETH_STRATEGY,
//             TOTAL_ALLOCATION + DEFAULT_STRATEGY_CAP // Requesting more than available
//         );
//         assertEq(sharesAllocated, TOTAL_ALLOCATION);
//         assertEq(allocations.length, 10);

//         for (uint256 i = 0; i < allocations.length; i++) {
//             assertEq(allocations[i].shares, DEFAULT_STRATEGY_CAP);
//             assertEq(allocations[i].tokens, DEFAULT_STRATEGY_CAP);
//         }
//     }

//     function test_allocateStrategySharesPartiallyAllocated() public {
//         // Create 10 operators
//         for (uint256 i = 0; i < 10; i++) {
//             operatorRegistry.createOperator(
//                 address(this),
//                 address(this),
//                 'https://example.com/metadata.json',
//                 defaultBlsDetails,
//                 defaultStrategyShareCaps,
//                 100,
//                 bytes32(i) // Salt
//             );
//         }

//         uint256 PARTIAL_ALLOCATION = (DEFAULT_STRATEGY_CAP * 2) + (DEFAULT_STRATEGY_CAP / 2);

//         vm.prank(deployment.assetManager);
//         (uint256 sharesAllocated, IRioLRTOperatorRegistry.OperatorStrategyAllocation[] memory allocations) =
//             operatorRegistry.allocateStrategyShares(STETH_STRATEGY, PARTIAL_ALLOCATION);
//         assertEq(sharesAllocated, PARTIAL_ALLOCATION);
//         assertEq(allocations.length, 3);

//         assertEq(allocations[0].shares, DEFAULT_STRATEGY_CAP);
//         assertEq(allocations[0].tokens, DEFAULT_STRATEGY_CAP);
//         assertEq(allocations[1].shares, DEFAULT_STRATEGY_CAP);
//         assertEq(allocations[1].tokens, DEFAULT_STRATEGY_CAP);
//         assertEq(allocations[2].shares, DEFAULT_STRATEGY_CAP / 2);
//         assertEq(allocations[2].tokens, DEFAULT_STRATEGY_CAP / 2);
//     }

//     function test_allocateETHDepositsWithNoOperatorsReverts() public {
//         vm.prank(deployment.assetManager);
//         vm.expectRevert(abi.encodeWithSelector(IRioLRTOperatorRegistry.NO_AVAILABLE_OPERATORS_FOR_ALLOCATION.selector));
//         operatorRegistry.allocateETHDeposits(1);
//     }

//     function test_allocateETHDepositsWithNoConfirmedKeysReverts() public {
//         // Create an operator with unconfirmed keys.
//         uint40 VALIDATORS_PER_OPERATOR = 10;
//         (uint8 operatorId,) = operatorRegistry.createOperator(
//             address(this),
//             address(this),
//             'https://example.com/metadata.json',
//             defaultBlsDetails,
//             defaultStrategyShareCaps,
//             VALIDATORS_PER_OPERATOR,
//             bytes32(uint256(1)) // Salt
//         );
//         (bytes memory publicKeys, bytes memory signatures) = TestUtils.getValidatorKeys(VALIDATORS_PER_OPERATOR);
//         operatorRegistry.addValidatorDetails(operatorId, VALIDATORS_PER_OPERATOR, publicKeys, signatures);

//         vm.prank(deployment.assetManager);
//         vm.expectRevert(abi.encodeWithSelector(IRioLRTOperatorRegistry.NO_AVAILABLE_OPERATORS_FOR_ALLOCATION.selector));
//         operatorRegistry.allocateETHDeposits(VALIDATORS_PER_OPERATOR);
//     }

//     function test_allocateETHDepositsFullyAllocatedExact() public {
//         uint256 OPERATOR_COUNT = 10;
//         uint40 VALIDATORS_PER_OPERATOR = 5;
//         (bytes memory publicKeys, bytes memory signatures) = TestUtils.getValidatorKeys(VALIDATORS_PER_OPERATOR);

//         // Create 10 operators
//         for (uint256 i = 0; i < OPERATOR_COUNT; i++) {
//             (uint8 operatorId,) = operatorRegistry.createOperator(
//                 address(this),
//                 address(this),
//                 'https://example.com/metadata.json',
//                 defaultBlsDetails,
//                 defaultStrategyShareCaps,
//                 VALIDATORS_PER_OPERATOR,
//                 bytes32(i) // Salt
//             );

//             // Upload validator keys
//             operatorRegistry.addValidatorDetails(operatorId, VALIDATORS_PER_OPERATOR, publicKeys, signatures);

//             // Fast forward to allow validator keys time to confirm.
//             skip(operatorRegistry.validatorKeyReviewPeriod());
//         }

//         uint256 TOTAL_DEPOSITS_TO_ALLOCATE = OPERATOR_COUNT * VALIDATORS_PER_OPERATOR;

//         vm.prank(deployment.assetManager);
//         (uint256 depositsAllocated, IRioLRTOperatorRegistry.OperatorETHAllocation[] memory allocations) =
//             operatorRegistry.allocateETHDeposits(TOTAL_DEPOSITS_TO_ALLOCATE);
//         assertEq(depositsAllocated, TOTAL_DEPOSITS_TO_ALLOCATE);
//         assertEq(allocations.length, 10);

//         for (uint256 i = 0; i < allocations.length; i++) {
//             assertEq(allocations[i].deposits, VALIDATORS_PER_OPERATOR);
//         }
//     }

//     function test_allocateETHDepositsOverAllocationIsCapped() public {
//         uint256 OPERATOR_COUNT = 10;
//         uint40 VALIDATORS_PER_OPERATOR = 5;
//         (bytes memory publicKeys, bytes memory signatures) = TestUtils.getValidatorKeys(VALIDATORS_PER_OPERATOR);

//         // Create 10 operators
//         for (uint256 i = 0; i < OPERATOR_COUNT; i++) {
//             (uint8 operatorId,) = operatorRegistry.createOperator(
//                 address(this),
//                 address(this),
//                 'https://example.com/metadata.json',
//                 defaultBlsDetails,
//                 defaultStrategyShareCaps,
//                 VALIDATORS_PER_OPERATOR,
//                 bytes32(i) // Salt
//             );

//             // Upload validator keys
//             operatorRegistry.addValidatorDetails(operatorId, VALIDATORS_PER_OPERATOR, publicKeys, signatures);

//             // Fast forward to allow validator keys time to confirm.
//             skip(operatorRegistry.validatorKeyReviewPeriod());
//         }

//         uint256 TOTAL_DEPOSITS_TO_ALLOCATE = OPERATOR_COUNT * VALIDATORS_PER_OPERATOR;

//         vm.prank(deployment.assetManager);
//         (uint256 depositsAllocated, IRioLRTOperatorRegistry.OperatorETHAllocation[] memory allocations) =
//         operatorRegistry.allocateETHDeposits(
//             TOTAL_DEPOSITS_TO_ALLOCATE + 2 // Requesting more than available
//         );
//         assertEq(depositsAllocated, TOTAL_DEPOSITS_TO_ALLOCATE);
//         assertEq(allocations.length, 10);

//         for (uint256 i = 0; i < allocations.length; i++) {
//             assertEq(allocations[i].deposits, VALIDATORS_PER_OPERATOR);
//         }
//     }

//     function test_allocateETHDepositsPartiallyAllocated() public {
//         uint256 OPERATOR_COUNT = 10;
//         uint40 VALIDATORS_PER_OPERATOR = 5;
//         (bytes memory publicKeys, bytes memory signatures) = TestUtils.getValidatorKeys(VALIDATORS_PER_OPERATOR);

//         // Create 10 operators
//         for (uint256 i = 0; i < OPERATOR_COUNT; i++) {
//             (uint8 operatorId,) = operatorRegistry.createOperator(
//                 address(this),
//                 address(this),
//                 'https://example.com/metadata.json',
//                 defaultBlsDetails,
//                 defaultStrategyShareCaps,
//                 VALIDATORS_PER_OPERATOR,
//                 bytes32(i) // Salt
//             );

//             // Upload validator keys
//             operatorRegistry.addValidatorDetails(operatorId, VALIDATORS_PER_OPERATOR, publicKeys, signatures);

//             // Fast forward to allow validator keys time to confirm.
//             skip(operatorRegistry.validatorKeyReviewPeriod());
//         }

//         uint256 TOTAL_DEPOSITS_TO_ALLOCATE_PARTIAL = (VALIDATORS_PER_OPERATOR * 2) + (VALIDATORS_PER_OPERATOR / 2);

//         vm.prank(deployment.assetManager);
//         (uint256 depositsAllocated, IRioLRTOperatorRegistry.OperatorETHAllocation[] memory allocations) =
//             operatorRegistry.allocateETHDeposits(TOTAL_DEPOSITS_TO_ALLOCATE_PARTIAL);
//         assertEq(depositsAllocated, TOTAL_DEPOSITS_TO_ALLOCATE_PARTIAL);
//         assertEq(allocations.length, 3);

//         assertEq(allocations[0].deposits, VALIDATORS_PER_OPERATOR);
//         assertEq(allocations[1].deposits, VALIDATORS_PER_OPERATOR);
//         assertEq(allocations[2].deposits, VALIDATORS_PER_OPERATOR / 2);
//     }

//     function test_allocateETHDepositsSkipsOperatorsWithNoConfirmedKeys() public {
//         uint40 VALIDATORS_PER_OPERATOR = 10;

//         // Create an operator without uploading any keys.
//         operatorRegistry.createOperator(
//             address(this),
//             address(this),
//             'https://example.com/metadata.json',
//             defaultBlsDetails,
//             defaultStrategyShareCaps,
//             VALIDATORS_PER_OPERATOR,
//             bytes32(uint256(0)) // Salt
//         );

//         // Create an operator with confirmed keys.
//         (uint8 operatorId, address operatorContract) = operatorRegistry.createOperator(
//             address(this),
//             address(this),
//             'https://example.com/metadata.json',
//             defaultBlsDetails,
//             defaultStrategyShareCaps,
//             VALIDATORS_PER_OPERATOR,
//             bytes32(uint256(1)) // Salt
//         );
//         (bytes memory publicKeys, bytes memory signatures) = TestUtils.getValidatorKeys(VALIDATORS_PER_OPERATOR);
//         operatorRegistry.addValidatorDetails(operatorId, VALIDATORS_PER_OPERATOR, publicKeys, signatures);
//         skip(operatorRegistry.validatorKeyReviewPeriod());

//         vm.prank(deployment.assetManager);
//         (uint256 depositsAllocated, IRioLRTOperatorRegistry.OperatorETHAllocation[] memory allocations) =
//         operatorRegistry.allocateETHDeposits(
//             VALIDATORS_PER_OPERATOR * 2 // Try to allocate to both operators.
//         );
//         assertEq(depositsAllocated, VALIDATORS_PER_OPERATOR); // Only the operator with confirmed keys should be allocated to.
//         assertEq(allocations.length, 1);

//         assertEq(allocations[0].operator, operatorContract);
//         assertEq(allocations[0].deposits, VALIDATORS_PER_OPERATOR);
//     }
// }
