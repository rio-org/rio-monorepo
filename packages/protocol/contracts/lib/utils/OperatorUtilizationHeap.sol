// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

/// @title Operator Utilization Heap
/// @notice The `OperatorUtilizationHeap` library provides functionality for managing an in-memory heap data
/// structure that organizes operators based on their utilization. The heap allows for efficient insertion,
/// removal, and updates of operators, as well as retrieval of the operator with the minimum utilization.
library OperatorUtilizationHeap {
    /// @notice Thrown when an operator is not found in the heap.
    error OPERATOR_NOT_FOUND();

    /// @notice The root index of the heap.
    uint8 constant ROOT_INDEX = 1;

    /// @notice The operator struct.
    struct Operator {
        uint8 id;
        uint256 utilization;
    }

    /// @notice The heap data struct.
    struct Data {
        Operator[] operators;
        uint8 count;
    }

    /// @notice Initializes a new heap.
    /// @param maxSize The maximum size of the heap.
    function initialize(uint8 maxSize) internal pure returns (Data memory) {
        return Data(new Operator[](maxSize + 1), 0);
    }

    /// @notice Initializes the provided heap.
    /// @param self The heap data struct.
    /// @param maxSize The maximum size of the heap.
    function initialize(Data memory self, uint8 maxSize) internal pure {
        self.operators = new Operator[](maxSize + 1);
    }

    /// @notice Inserts an operator into the heap.
    /// @param self The heap data struct.
    /// @param o The operator to insert.
    function insert(Data memory self, Operator memory o) internal pure returns (Operator memory) {
        _bubbleUp(self, o, ++self.count);
        return o;
    }

    /// @notice Removes an operator from the heap.
    /// @param self The heap data struct.
    /// @param index The index of the operator to remove.
    function remove(Data memory self, uint8 index) internal pure {
        Operator memory lastOperator = self.operators[self.count];
        self.operators[index] = lastOperator;
        self.count--;

        _bubbleDown(self, lastOperator, index);
    }

    /// @notice Removes an operator from the heap by its ID.
    /// @param self The heap data struct.
    /// @param id The ID of the operator to remove.
    function removeByID(Data memory self, uint8 id) internal pure {
        for (uint8 i = 1; i <= self.count; ++i) {
            if (self.operators[i].id == id) {
                remove(self, i);
                return;
            }
        }
        revert OPERATOR_NOT_FOUND();
    }

    /// @notice Updates the utilization of an operator in the heap.
    /// @param self The heap data struct.
    /// @param index The index of the operator to update.
    /// @param newUtilization The new utilization of the operator.
    function updateUtilization(Data memory self, uint8 index, uint256 newUtilization) internal pure {
        uint256 oldUtilization = self.operators[index].utilization;
        self.operators[index].utilization = newUtilization;

        if (newUtilization > oldUtilization) {
            _bubbleDown(self, self.operators[index], index);
        } else if (newUtilization < oldUtilization) {
            _bubbleUp(self, self.operators[index], index);
        }
    }

    /// @notice Updates the utilization of an operator in the heap by its ID.
    /// @param self The heap data struct.
    /// @param id The id of the operator to update.
    /// @param newUtilization The new utilization of the operator.
    function updateUtilizationByID(Data memory self, uint8 id, uint256 newUtilization) internal pure {
        for (uint8 i = 1; i <= self.count; ++i) {
            if (self.operators[i].id == id) {
                updateUtilization(self, i, newUtilization);
                return;
            }
        }
        revert OPERATOR_NOT_FOUND();
    }

    /// @notice Extracts the minimum operator from the heap.
    function extractMin(Data memory self) internal pure returns (Operator memory) {
        return _extract(self, ROOT_INDEX);
    }

    /// @notice Returns the minimum operator from the heap.
    function getMin(Data memory self) internal pure returns (Operator memory) {
        return self.operators[ROOT_INDEX];
    }

    /// @notice Returns `true` if the heap is empty.
    function isEmpty(Data memory self) internal pure returns (bool) {
        return self.count == 0;
    }

    /// @notice Returns the number of operators in the heap.
    /// @param self The heap data struct.
    /// @param i The index of the operator to extract.
    function _extract(Data memory self, uint8 i) private pure returns (Operator memory) {
        Operator memory o = self.operators[i];
        Operator memory tailOperator = self.operators[self.count];
        if (i < self.count) {
            _bubbleUp(self, tailOperator, i);
            _bubbleDown(self, self.operators[i], i);
        }
        return o;
    }

    /// @notice Bubbles up an operator in the heap.
    /// @param self The heap data struct.
    /// @param o The operator to bubble up.
    /// @param i The index of the operator to bubble up.
    function _bubbleUp(Data memory self, Operator memory o, uint8 i) private pure {
        if (i == ROOT_INDEX || o.utilization >= self.operators[i / 2].utilization) {
            _insert(self, o, i);
        } else {
            _insert(self, self.operators[i / 2], i);
            _bubbleUp(self, o, i / 2);
        }
    }

    /// @notice Bubbles down an operator in the heap.
    /// @param self The heap data struct.
    /// @param o The operator to bubble down.
    /// @param i The index of the operator to bubble down.
    function _bubbleDown(Data memory self, Operator memory o, uint8 i) private pure {
        uint8 length = self.count + 1;
        uint8 cIndex = i * 2;
        if (length <= cIndex) {
            _insert(self, o, i);
        } else {
            Operator memory smallestChild = self.operators[cIndex];
            if (length > cIndex + 1 && self.operators[cIndex + 1].utilization < smallestChild.utilization) {
                smallestChild = self.operators[++cIndex];
            }
            if (smallestChild.utilization >= o.utilization) {
                _insert(self, o, i);
            } else {
                _insert(self, smallestChild, i);
                _bubbleDown(self, o, cIndex);
            }
        }
    }

    /// @notice Inserts an operator into the heap.
    /// @param self The heap data struct.
    /// @param o The operator to insert.
    function _insert(Data memory self, Operator memory o, uint8 i) private pure {
        self.operators[i] = o;
    }
}
