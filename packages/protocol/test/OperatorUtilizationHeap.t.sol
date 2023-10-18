// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {Test} from 'forge-std/Test.sol';
import {OperatorUtilizationHeap} from 'contracts/utils/OperatorUtilizationHeap.sol';

contract OperatorUtilizationHeapTest is Test {
    using OperatorUtilizationHeap for OperatorUtilizationHeap.Data;

    function test_initialize() public {
        OperatorUtilizationHeap.Data memory heap = OperatorUtilizationHeap.initialize(5);

        assertEq(heap.count, 0);
        assertEq(heap.isEmpty(), true);
        assertEq(heap.operators.length, 6); // maxSize + 1
    }

    function test_insert() public {
        OperatorUtilizationHeap.Data memory heap = OperatorUtilizationHeap.initialize(5);

        heap.insert(OperatorUtilizationHeap.Operator({id: 1, utilization: 5}));

        assertEq(heap.count, 1);
        assertEq(heap.operators[1].id, 1);
        assertEq(heap.operators[1].utilization, 5);

        heap.insert(OperatorUtilizationHeap.Operator({id: 2, utilization: 10}));

        assertEq(heap.count, 2);
        assertEq(heap.extractMin().id, 1);
        assertEq(heap.extractMin().id, 2);
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
}
