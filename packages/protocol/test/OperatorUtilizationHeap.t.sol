// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {Test} from 'forge-std/Test.sol';
import {LibMap} from '@solady/utils/LibMap.sol';
import {OperatorUtilizationHeap} from 'contracts/utils/OperatorUtilizationHeap.sol';

contract OperatorUtilizationHeapTest is Test {
    using OperatorUtilizationHeap for OperatorUtilizationHeap.Data;
    using LibMap for *;

    LibMap.Uint8Map heapStore;

    function test_initialize() public {
        OperatorUtilizationHeap.Data memory heap = OperatorUtilizationHeap.initialize(5);

        assertEq(heap.count, 0);
        assertEq(heap.isEmpty(), true);
        assertEq(heap.operators.length, 6); // maxSize + 1
    }

    function test_isEmpty() public {
        OperatorUtilizationHeap.Data memory heap = OperatorUtilizationHeap.initialize(10);

        assertEq(heap.isEmpty(), true);
        for (uint8 id; id < 10; id++) {
            heap.insert(OperatorUtilizationHeap.Operator({id: id, utilization: 0}));
        }
        assertEq(heap.isEmpty(), false);
        for (uint8 id; id < 10; id++) {
            heap.removeByID(id);
        }
        assertEq(heap.isEmpty(), true);
    }

    function test_isFull() public {
        OperatorUtilizationHeap.Data memory heap = OperatorUtilizationHeap.initialize(10);

        assertEq(heap.isFull(), false);
        for (uint8 id; id < 10; id++) {
            heap.insert(OperatorUtilizationHeap.Operator({id: id, utilization: 0}));
        }
        assertEq(heap.isFull(), true);
        heap.removeByID(0);
        assertEq(heap.isFull(), false);
    }

    function test_store() public {
        OperatorUtilizationHeap.Data memory heap = OperatorUtilizationHeap.initialize(5);

        heap.insert(OperatorUtilizationHeap.Operator({id: 1, utilization: 5}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 2, utilization: 10}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 3, utilization: 15}));

        heap.store(heapStore);

        for (uint8 i; i < heap.count; i++) {
            assertEq(heapStore.get(i), heap.operators[i + 1].id);
        }
    }

    function test_insert() public {
        OperatorUtilizationHeap.Data memory heap = OperatorUtilizationHeap.initialize(5);

        heap.insert(OperatorUtilizationHeap.Operator({id: 1, utilization: 5}));

        assertEq(heap.count, 1);
        assertEq(heap.operators[1].id, 1);
        assertEq(heap.operators[1].utilization, 5);
        assertEq(heap.getMin().id, 1);
        assertEq(heap.getMax().id, 1);

        heap.insert(OperatorUtilizationHeap.Operator({id: 2, utilization: 10}));

        assertEq(heap.count, 2);
        assertEq(heap.getMin().id, 1);
        assertEq(heap.getMax().id, 2);
    }

    function test_remove() public {
        OperatorUtilizationHeap.Data memory heap = OperatorUtilizationHeap.initialize(5);

        heap.insert(OperatorUtilizationHeap.Operator({id: 1, utilization: 15}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 2, utilization: 5}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 3, utilization: 10}));

        assertEq(heap.operators[1].id, 2);
        assertEq(heap.operators[1].utilization, 5);
        assertEq(heap.operators[2].id, 1);
        assertEq(heap.operators[2].utilization, 15);
        assertEq(heap.operators[3].id, 3);
        assertEq(heap.operators[3].utilization, 10);

        heap.remove(1);

        assertEq(heap.count, 2);
        assertEq(heap.extractMin().id, 3);
        assertEq(heap.extractMin().id, 1);
    }

    function test_removeByID() public {
        OperatorUtilizationHeap.Data memory heap = OperatorUtilizationHeap.initialize(5);

        heap.insert(OperatorUtilizationHeap.Operator({id: 1, utilization: 15}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 2, utilization: 5}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 3, utilization: 10}));

        assertEq(heap.operators[1].id, 2);
        assertEq(heap.operators[1].utilization, 5);
        assertEq(heap.operators[2].id, 1);
        assertEq(heap.operators[2].utilization, 15);
        assertEq(heap.operators[3].id, 3);
        assertEq(heap.operators[3].utilization, 10);

        heap.removeByID(1);

        assertEq(heap.count, 2);
        assertEq(heap.extractMin().id, 2);
        assertEq(heap.extractMin().id, 3);
    }

    function test_updateUtilization() public {
        OperatorUtilizationHeap.Data memory heap = OperatorUtilizationHeap.initialize(5);

        heap.insert(OperatorUtilizationHeap.Operator({id: 1, utilization: 15}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 2, utilization: 5}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 3, utilization: 10}));

        assertEq(heap.operators[1].id, 2);
        assertEq(heap.operators[1].utilization, 5);
        assertEq(heap.operators[2].id, 1);
        assertEq(heap.operators[2].utilization, 15);
        assertEq(heap.operators[3].id, 3);
        assertEq(heap.operators[3].utilization, 10);

        heap.updateUtilization(2, 0);

        assertEq(heap.count, 3);
        assertEq(heap.extractMin().id, 1);
        assertEq(heap.extractMin().id, 2);
        assertEq(heap.extractMin().id, 3);
    }

    function test_updateUtilizationByID() public {
        OperatorUtilizationHeap.Data memory heap = OperatorUtilizationHeap.initialize(5);

        heap.insert(OperatorUtilizationHeap.Operator({id: 1, utilization: 15}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 2, utilization: 5}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 3, utilization: 10}));

        assertEq(heap.operators[1].id, 2);
        assertEq(heap.operators[1].utilization, 5);
        assertEq(heap.operators[2].id, 1);
        assertEq(heap.operators[2].utilization, 15);
        assertEq(heap.operators[3].id, 3);
        assertEq(heap.operators[3].utilization, 10);

        heap.updateUtilizationByID(1, 0);

        assertEq(heap.count, 3);
        assertEq(heap.extractMin().id, 1);
        assertEq(heap.extractMin().id, 2);
        assertEq(heap.extractMin().id, 3);
    }

    function test_extractMin() public {
        OperatorUtilizationHeap.Data memory heap = OperatorUtilizationHeap.initialize(10);

        heap.insert(OperatorUtilizationHeap.Operator({id: 1, utilization: 15}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 2, utilization: 5}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 3, utilization: 20}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 4, utilization: 50}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 5, utilization: 10000}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 6, utilization: 18}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 7, utilization: 44}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 8, utilization: 1000}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 9, utilization: 99}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 10, utilization: 0}));

        assertEq(heap.extractMin().id, 10);
        assertEq(heap.extractMin().id, 2);
        assertEq(heap.extractMin().id, 1);
        assertEq(heap.extractMin().id, 6);
        assertEq(heap.extractMin().id, 3);
        assertEq(heap.extractMin().id, 7);
        assertEq(heap.extractMin().id, 4);
        assertEq(heap.extractMin().id, 9);
        assertEq(heap.extractMin().id, 8);
        assertEq(heap.extractMin().id, 5);
    }

    function test_extractMax() public {
        OperatorUtilizationHeap.Data memory heap = OperatorUtilizationHeap.initialize(10);

        heap.insert(OperatorUtilizationHeap.Operator({id: 1, utilization: 15}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 2, utilization: 5}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 3, utilization: 20}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 4, utilization: 50}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 5, utilization: 10000}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 6, utilization: 18}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 7, utilization: 44}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 8, utilization: 1000}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 9, utilization: 99}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 10, utilization: 0}));

        assertEq(heap.extractMax().id, 5);
        assertEq(heap.extractMax().id, 8);
        assertEq(heap.extractMax().id, 9);
        assertEq(heap.extractMax().id, 4);
        assertEq(heap.extractMax().id, 7);
        assertEq(heap.extractMax().id, 3);
        assertEq(heap.extractMax().id, 6);
        assertEq(heap.extractMax().id, 1);
        assertEq(heap.extractMax().id, 2);
        assertEq(heap.extractMax().id, 10);
    }

    function test_extractMinMaxAlternating() public {
        OperatorUtilizationHeap.Data memory heap = OperatorUtilizationHeap.initialize(10);

        heap.insert(OperatorUtilizationHeap.Operator({id: 1, utilization: 67}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 2, utilization: 33}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 3, utilization: 32_423}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 4, utilization: 33}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 5, utilization: 2_365}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 6, utilization: 96}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 7, utilization: 1}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 8, utilization: 8_276_349}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 9, utilization: 891}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 10, utilization: 11}));

        assertEq(heap.extractMax().id, 8);
        assertEq(heap.extractMin().id, 7);
        assertEq(heap.extractMax().id, 3);
        assertEq(heap.extractMin().id, 10);
        assertEq(heap.extractMax().id, 5);
        assertEq(heap.extractMin().id, 2);
        assertEq(heap.extractMax().id, 9);
        assertEq(heap.extractMin().id, 4);
        assertEq(heap.extractMax().id, 6);
        assertEq(heap.extractMin().id, 1);
    }

    function test_getMin() public {
        OperatorUtilizationHeap.Data memory heap = OperatorUtilizationHeap.initialize(10);

        heap.insert(OperatorUtilizationHeap.Operator({id: 1, utilization: 44}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 2, utilization: 1000}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 3, utilization: 0}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 4, utilization: 99}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 5, utilization: 5}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 6, utilization: 10000}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 7, utilization: 15}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 8, utilization: 18}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 9, utilization: 50}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 10, utilization: 20}));

        uint8[10] memory ids = [3, 5, 7, 8, 10, 1, 9, 4, 2, 6];
        for (uint8 i; i < ids.length; i++) {
            assertEq(heap.getMin().id, ids[i]);
            heap.removeByID(ids[i]);
        }
    }

    function test_getMax() public {
        OperatorUtilizationHeap.Data memory heap = OperatorUtilizationHeap.initialize(10);

        heap.insert(OperatorUtilizationHeap.Operator({id: 1, utilization: 44}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 2, utilization: 1000}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 3, utilization: 0}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 4, utilization: 99}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 5, utilization: 5}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 6, utilization: 10000}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 7, utilization: 15}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 8, utilization: 18}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 9, utilization: 50}));
        heap.insert(OperatorUtilizationHeap.Operator({id: 10, utilization: 20}));

        uint8[10] memory ids = [6, 2, 4, 9, 1, 10, 8, 7, 5, 3];
        for (uint8 i; i < ids.length; i++) {
            assertEq(heap.getMax().id, ids[i]);
            heap.removeByID(ids[i]);
        }
    }

    function testFuzz_extractMin(uint256[] memory utilizations) public {
        vm.assume(utilizations.length > 0 && utilizations.length < 50);

        OperatorUtilizationHeap.Data memory heap = OperatorUtilizationHeap.initialize(uint8(utilizations.length));
        for (uint8 i = 0; i < utilizations.length; i++) {
            vm.assume(utilizations[i] < type(uint128).max);
            heap.insert(OperatorUtilizationHeap.Operator({id: i, utilization: utilizations[i]}));
        }

        uint256 currentMinUtilization;
        uint256 previousMinUtilization;
        while (!heap.isEmpty()) {
            currentMinUtilization = heap.extractMin().utilization;

            assertTrue(currentMinUtilization >= previousMinUtilization);
            previousMinUtilization = currentMinUtilization;
        }
    }

    function testFuzz_extractMax(uint256[] memory utilizations) public {
        vm.assume(utilizations.length > 0 && utilizations.length < 50);

        OperatorUtilizationHeap.Data memory heap = OperatorUtilizationHeap.initialize(uint8(utilizations.length));
        for (uint8 i = 0; i < utilizations.length; i++) {
            vm.assume(utilizations[i] < type(uint128).max);
            heap.insert(OperatorUtilizationHeap.Operator({id: i, utilization: utilizations[i]}));
        }

        uint256 currentMaxUtilization;
        uint256 previousMaxUtilization = type(uint256).max;
        while (!heap.isEmpty()) {
            currentMaxUtilization = heap.extractMax().utilization;

            assertTrue(currentMaxUtilization <= previousMaxUtilization);
            previousMaxUtilization = currentMaxUtilization;
        }
    }

    function testFuzz_getMin(uint256[] memory utilizations, uint8 random) public {
        vm.assume(utilizations.length > 0 && utilizations.length < 50);

        OperatorUtilizationHeap.Data memory heap = OperatorUtilizationHeap.initialize(uint8(utilizations.length));
        for (uint8 i = 0; i < utilizations.length; i++) {
            vm.assume(utilizations[i] < type(uint128).max);
            heap.insert(OperatorUtilizationHeap.Operator({id: i, utilization: utilizations[i]}));
        }

        uint256 currentMinUtilization;
        uint256 previousMinUtilization;
        while (!heap.isEmpty()) {
            currentMinUtilization = heap.getMin().utilization;

            assertTrue(currentMinUtilization >= previousMinUtilization);
            previousMinUtilization = currentMinUtilization;

            heap.remove(random % heap.count + 1);
        }
    }

    function testFuzz_getMax(uint256[] memory utilizations, uint8 random) public {
        vm.assume(utilizations.length > 0 && utilizations.length < 50);

        OperatorUtilizationHeap.Data memory heap = OperatorUtilizationHeap.initialize(uint8(utilizations.length));
        for (uint8 i = 0; i < utilizations.length; i++) {
            vm.assume(utilizations[i] < type(uint128).max);
            heap.insert(OperatorUtilizationHeap.Operator({id: i, utilization: utilizations[i]}));
        }

        uint256 currentMaxUtilization;
        uint256 previousMaxUtilization = type(uint256).max;
        while (!heap.isEmpty()) {
            currentMaxUtilization = heap.getMax().utilization;

            assertTrue(currentMaxUtilization <= previousMaxUtilization);
            previousMaxUtilization = currentMaxUtilization;

            heap.remove(random % heap.count + 1);
        }
    }

    function testFuzz_getMaxUpdateUtilizationByID(uint256[] memory utilizations, uint8 random) public {
        vm.assume(utilizations.length > 0 && utilizations.length < 50);

        OperatorUtilizationHeap.Data memory heap = OperatorUtilizationHeap.initialize(uint8(utilizations.length));
        for (uint8 i = 0; i < utilizations.length; i++) {
            vm.assume(utilizations[i] < type(uint64).max);
            heap.insert(OperatorUtilizationHeap.Operator({id: i, utilization: utilizations[i]}));
            heap.updateUtilizationByID(i, utilizations[i] % 2 == 0 ? utilizations[i] * 2 : utilizations[i] / 2);
        }

        uint256 currentMaxUtilization;
        uint256 previousMaxUtilization = type(uint256).max;
        while (!heap.isEmpty()) {
            currentMaxUtilization = heap.getMax().utilization;

            assertTrue(currentMaxUtilization <= previousMaxUtilization);
            previousMaxUtilization = currentMaxUtilization;

            heap.remove(random % heap.count + 1);
        }
    }

    function testFuzz_getMinUpdateUtilizationByID(uint256[] memory utilizations, uint8 random) public {
        vm.assume(utilizations.length > 0 && utilizations.length < 50);

        OperatorUtilizationHeap.Data memory heap = OperatorUtilizationHeap.initialize(uint8(utilizations.length));
        for (uint8 i = 0; i < utilizations.length; i++) {
            vm.assume(utilizations[i] < type(uint128).max);
            heap.insert(OperatorUtilizationHeap.Operator({id: i, utilization: utilizations[i]}));
            heap.updateUtilizationByID(i, utilizations[i] % 2 == 0 ? utilizations[i] * 2 : utilizations[i] / 2);
        }

        uint256 currentMinUtilization;
        uint256 previousMinUtilization;
        while (!heap.isEmpty()) {
            currentMinUtilization = heap.getMin().utilization;

            assertTrue(currentMinUtilization >= previousMinUtilization);
            previousMinUtilization = currentMinUtilization;

            heap.remove(random % heap.count + 1);
        }
    }
}
