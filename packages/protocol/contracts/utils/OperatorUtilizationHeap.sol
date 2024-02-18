// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {LibMap} from '@solady/utils/LibMap.sol';

/// @title Operator Utilization Heap.
/// @notice The `OperatorUtilizationHeap` library provides functionality for managing an in-memory heap data
/// structure that organizes operators based on their utilization. The heap allows for efficient insertion,
/// removal, and update of operator utilizations, as well as retrieval of the operators with the minimum
/// or maximum utilizations.
/// https://people.scs.carleton.ca/~santoro/Reports/MinMaxHeap.pdf
library OperatorUtilizationHeap {
    using OperatorUtilizationHeap for Data;
    using LibMap for *;

    /// @notice Thrown when an operator is not found in the heap.
    error OPERATOR_NOT_FOUND();

    /// @notice Thrown when attempting to initialize a heap with a size of 0.
    error INVALID_HEAP_SIZE();

    /// @notice Thrown when attempting an operation on an invalid operator index.
    error INVALID_INDEX();

    /// @notice Thrown when attempting to insert an operator into a full heap.
    error HEAP_OVERFLOW();

    /// @notice Thrown when attempting to fetch an operator from an empty heap.
    error HEAP_UNDERFLOW();

    /// @notice The root index of the heap.
    uint8 constant ROOT_INDEX = 1;

    /// @notice The data structure representing an operator and its utilization.
    struct Operator {
        uint8 id;
        uint256 utilization;
    }

    /// @notice The data structure representing the heap.
    struct Data {
        Operator[] operators;
        uint8 count;
    }

    /// @notice Initializes the heap.
    /// @param maxSize The maximum number of operators that can be stored in the heap.
    function initialize(uint8 maxSize) internal pure returns (Data memory) {
        if (maxSize == 0) revert INVALID_HEAP_SIZE();
        return Data(new Operator[](maxSize + 1), 0);
    }

    /// @notice Returns whether the heap is empty.
    /// @param self The heap.
    function isEmpty(Data memory self) internal pure returns (bool) {
        return self.count == 0;
    }

    /// @notice Returns whether the heap is full.
    /// @param self The heap.
    function isFull(Data memory self) internal pure returns (bool) {
        return self.count == self.operators.length - 1;
    }

    /// @notice Inserts the heap into storage.
    /// @param self The heap.
    /// @param heapStore The stored heap.
    function store(Data memory self, LibMap.Uint8Map storage heapStore) internal {
        for (uint8 i = 0; i < self.count;) {
            unchecked {
                heapStore.set(i, self.operators[i + 1].id);
                ++i;
            }
        }
    }

    /// @notice Inserts an operator into the heap.
    /// @param self The heap.
    /// @param o The operator to insert.
    function insert(Data memory self, Operator memory o) internal pure {
        if (self.isEmpty()) {
            self._push(o);
            return;
        }
        if (self.isFull()) revert HEAP_OVERFLOW();

        self._push(o);
        self._bubbleUp(self.count);
    }

    /// @notice Removes an operator from the heap.
    /// @param self The heap.
    /// @param index The index of the operator to remove.
    function remove(Data memory self, uint8 index) internal pure {
        if (index < ROOT_INDEX || index > self.count) revert INVALID_INDEX();

        self._remove(index);
        self._bubbleUp(index);
        self._bubbleDown(index);
    }

    /// @notice Removes an operator from the heap by its ID.
    /// @param self The heap.
    /// @param id The ID of the operator to remove.
    function removeByID(Data memory self, uint8 id) internal pure {
        (uint8 index, bool found) = self._findOperatorIndex(id);
        if (!found) revert OPERATOR_NOT_FOUND();

        self.remove(index);
    }

    /// @notice Updates the utilization of an operator in the heap.
    /// @param self The heap.
    /// @param index The index of the operator to update.
    /// @param newUtilization The new utilization of the operator.
    function updateUtilization(Data memory self, uint8 index, uint256 newUtilization) internal pure {
        if (index < ROOT_INDEX || index > self.count) revert INVALID_INDEX();

        uint256 oldUtilization = self.operators[index].utilization;
        if (newUtilization == oldUtilization) return;

        self.operators[index].utilization = newUtilization;

        self._bubbleUp(index);
        self._bubbleDown(index);
    }

    /// @notice Updates the utilization of an operator in the heap by its ID.
    /// @param self The heap.
    /// @param id The ID of the operator to update.
    /// @param newUtilization The new utilization of the operator.
    function updateUtilizationByID(Data memory self, uint8 id, uint256 newUtilization) internal pure {
        (uint8 index, bool found) = self._findOperatorIndex(id);
        if (!found) revert OPERATOR_NOT_FOUND();

        self.updateUtilization(index, newUtilization);
    }

    /// @notice Extracts the minimum operator from the heap.
    /// @param self The heap.
    function extractMin(Data memory self) internal pure returns (Operator memory o) {
        if (self.isEmpty()) revert HEAP_UNDERFLOW();

        o = self.operators[ROOT_INDEX];

        self._remove(ROOT_INDEX);
        self._bubbleDownMin(ROOT_INDEX);
    }

    /// @notice Extracts the maximum operator from the heap.
    /// @param self The heap.
    function extractMax(Data memory self) internal pure returns (Operator memory o) {
        if (self.isEmpty()) revert HEAP_UNDERFLOW();

        // If the heap only contains one element, it's both the min and max.
        if (self.count == 1) {
            return self.operators[self.count--];
        }

        // If the heap has a second level, find the maximum value in that level.
        uint8 maxIndex = 2;
        if (self.count >= 3 && self.operators[3].utilization > self.operators[2].utilization) {
            maxIndex = 3;
        }
        o = self.operators[maxIndex];

        self._remove(maxIndex);
        self._bubbleDownMax(maxIndex);
    }

    /// @notice Returns the minimum operator from the heap.
    /// @param self The heap.
    function getMin(Data memory self) internal pure returns (Operator memory) {
        if (self.isEmpty()) revert HEAP_UNDERFLOW();

        return self.operators[ROOT_INDEX];
    }

    /// @notice Returns the maximum operator from the heap.
    /// @param self The heap.
    function getMax(Data memory self) internal pure returns (Operator memory) {
        if (self.isEmpty()) revert HEAP_UNDERFLOW();

        // If the heap only contains one element, it's both the min and max.
        if (self.count == 1) {
            return self.operators[ROOT_INDEX];
        }

        // If the heap has a second level, find the maximum value in that level.
        uint8 maxIndex = 2;
        if (self.count >= 3 && self.operators[3].utilization > self.operators[2].utilization) {
            maxIndex = 3;
        }
        return self.operators[maxIndex];
    }

    /// @notice Returns the index of the maximum operator from the heap.
    /// @param self The heap.
    function getMaxIndex(Data memory self) internal pure returns (uint8) {
        if (self.isEmpty()) revert HEAP_UNDERFLOW();

        // If the heap only contains one element, it's the root index.
        if (self.count == 1) {
            return ROOT_INDEX;
        }

        // If the heap has a second level, find the maximum value in that level.
        uint8 maxIndex = 2;
        if (self.count >= 3 && self.operators[3].utilization > self.operators[2].utilization) {
            maxIndex = 3;
        }
        return maxIndex;
    }

    /// @dev Adjusts the position of an operator downwards in the heap to ensure the
    /// heap's properties are maintained.
    /// @param self The heap.
    /// @param i The index of the operator to bubble down.
    function _bubbleDown(Data memory self, uint8 i) internal pure {
        if (_isOnMinLevel(i)) {
            self._bubbleDownMin(i);
        } else {
            self._bubbleDownMax(i);
        }
    }

    /// @dev Adjusts the position of an operator downwards in the heap to ensure the
    /// heap's properties are maintained. The operator is assumed to be on a min level.
    /// @param self The heap.
    /// @param i The index of the operator to bubble down.
    function _bubbleDownMin(Data memory self, uint8 i) internal pure {
        if (self._hasChildren(i)) {
            uint8 m = self._getSmallestChildIndexOrGrandchild(i);
            if (_isGrandchild(i, m)) {
                if (self.operators[m].utilization < self.operators[i].utilization) {
                    self._swap(m, i);
                    uint8 parentOfM = m / 2;
                    if (self.operators[m].utilization > self.operators[parentOfM].utilization) {
                        self._swap(m, parentOfM);
                    }
                    self._bubbleDownMin(m);
                }
            } else {
                if (self.operators[m].utilization < self.operators[i].utilization) {
                    self._swap(m, i);
                }
            }
        }
    }

    /// @dev Adjusts the position of an operator downwards in the heap to ensure the
    /// heap's properties are maintained. The operator is assumed to be on a max level.
    /// @param self The heap.
    /// @param i The index of the operator to bubble down.
    function _bubbleDownMax(Data memory self, uint8 i) internal pure {
        if (self._hasChildren(i)) {
            uint8 m = self._getLargestChildIndexOrGrandchild(i);
            if (_isGrandchild(i, m)) {
                if (self.operators[m].utilization > self.operators[i].utilization) {
                    self._swap(m, i);
                    uint8 parentOfM = m / 2;
                    if (self.operators[m].utilization < self.operators[parentOfM].utilization) {
                        self._swap(m, parentOfM);
                    }
                    self._bubbleDownMax(m);
                }
            } else {
                if (self.operators[m].utilization > self.operators[i].utilization) {
                    self._swap(m, i);
                }
            }
        }
    }

    /// @dev Adjusts the position of an operator upwards in the heap to ensure the
    /// heap's properties are maintained.
    /// @param self The heap.
    /// @param i The index of the operator to bubble up.
    function _bubbleUp(Data memory self, uint8 i) internal pure {
        if (i == ROOT_INDEX) return;

        uint8 parentIndex = i / 2;
        if (_isOnMinLevel(i)) {
            if (_hasParent(i) && self.operators[i].utilization > self.operators[parentIndex].utilization) {
                self._swap(i, parentIndex);
                self._bubbleUpMax(parentIndex);
            } else {
                self._bubbleUpMin(i);
            }
        } else {
            if (_hasParent(i) && self.operators[i].utilization < self.operators[parentIndex].utilization) {
                self._swap(i, parentIndex);
                self._bubbleUpMin(parentIndex);
            } else {
                self._bubbleUpMax(i);
            }
        }
    }

    // forgefmt: disable-next-item
    /// @dev Adjusts the position of an operator upwards in the heap to ensure the
    /// heap's properties are maintained. The operator is assumed to be on a min level.
    /// @param self The heap.
    /// @param i The index of the operator to bubble up.
    function _bubbleUpMin(Data memory self, uint8 i) internal pure {
        if (_hasGrandparent(i)) {
            uint8 grandparentIndex = i / 4;
            if (self.operators[i].utilization < self.operators[grandparentIndex].utilization) {
                self._swap(i, grandparentIndex);
                self._bubbleUpMin(grandparentIndex);
            }
        }
    }

    // forgefmt: disable-next-item
    /// @dev Adjusts the position of an operator upwards in the heap to ensure the
    /// heap's properties are maintained. The operator is assumed to be on a max level.
    /// @param self The heap.
    /// @param i The index of the operator to bubble up.
    function _bubbleUpMax(Data memory self, uint8 i) internal pure {
        if (_hasGrandparent(i)) {
            uint8 grandparentIndex = i / 4;
            if (self.operators[i].utilization > self.operators[grandparentIndex].utilization) {
                self._swap(i, grandparentIndex);
                self._bubbleUpMax(grandparentIndex);
            }
        }
    }

    /// @dev Returns whether the node at the specified index has a grandparent.
    /// @param i The index of the node in the heap.
    function _hasGrandparent(uint8 i) internal pure returns (bool) {
        return i > 3;
    }

    /// @dev Returns whether the node at the specified index has a parent.
    /// @param i The index of the node in the heap.
    function _hasParent(uint8 i) internal pure returns (bool) {
        return i > ROOT_INDEX;
    }

    /// @dev Returns whether the node at the specified index has children.
    /// @param i The index of the node in the heap.
    function _hasChildren(Data memory self, uint8 i) internal pure returns (bool) {
        return 2 * i <= self.count;
    }

    /// @dev Returns whether the node at `m` is a grandchild of the node at `i`.
    /// @param i The index of the node in the heap.
    /// @param m The index of the child or grandchild of the node at index `i`.
    function _isGrandchild(uint8 i, uint8 m) internal pure returns (bool) {
        return m > 2 * i + 1;
    }

    /// @dev Finds the index of the operator with the specified ID in the heap.
    /// @param self The heap.
    /// @param id The ID of the operator to find.
    function _findOperatorIndex(Data memory self, uint8 id) internal pure returns (uint8, bool) {
        for (uint8 i = 1; i <= self.count; ++i) {
            if (self.operators[i].id == id) {
                return (i, true);
            }
        }
        return (0, false);
    }

    /// @dev Swaps the operators at the specified indices in the heap.
    /// @param self The heap.
    /// @param index1 The index of the first operator to swap.
    /// @param index2 The index of the second operator to swap.
    function _swap(Data memory self, uint8 index1, uint8 index2) internal pure {
        Operator memory temp = self.operators[index1];
        self.operators[index1] = self.operators[index2];
        self.operators[index2] = temp;
    }

    /// @notice Pushes an operator onto the end of the heap.
    /// @param self The heap.
    /// @param o The operator to push.
    function _push(Data memory self, Operator memory o) internal pure {
        self.operators[++self.count] = o;
    }

    /// @dev Removes the operator at the specified index from the heap by
    /// swapping it with the last operator in the heap.
    /// @param self The heap.
    /// @param i The index of the operator to extract.
    function _remove(Data memory self, uint8 i) internal pure {
        self.operators[i] = self.operators[self.count--];
    }

    /// @dev Returns the index of the smallest child or grandchild of the node at index `i`.
    /// @param self The heap.
    /// @param i The index of the node whose children and grandchildren are to be compared.
    function _getSmallestChildIndexOrGrandchild(Data memory self, uint8 i) internal pure returns (uint8) {
        return self._getExtremeChildIndexOrGrandchild(i, _isSmaller);
    }

    /// @dev Returns the index of the largest child or grandchild of the node at index `i`.
    /// @param self The heap.
    /// @param i The index of the node whose children and grandchildren are to be compared.
    function _getLargestChildIndexOrGrandchild(Data memory self, uint8 i) internal pure returns (uint8) {
        return self._getExtremeChildIndexOrGrandchild(i, _isLarger);
    }

    // forgefmt: disable-next-item
    /// @dev Returns the index of the extreme child or grandchild of the node at index `i`.
    /// @param self The heap.
    /// @param i The index of the node whose children and grandchildren are to be compared.
    /// @param compare The comparison function to use.
    function _getExtremeChildIndexOrGrandchild(
        Data memory self,
        uint8 i,
        function(uint256, uint256) pure returns (bool) compare
    ) internal pure returns (uint8) {
        uint8 extreme = i;
        uint8 leftChild = 2 * i;
        uint8 rightChild = leftChild + 1;

        // Check left child
        if (leftChild <= self.count && compare(self.operators[leftChild].utilization, self.operators[extreme].utilization)) {
            extreme = leftChild;
        }

        // Check right child
        if (rightChild <= self.count && compare(self.operators[rightChild].utilization, self.operators[extreme].utilization)) {
            extreme = rightChild;
        }

        // Check grandchildren for both left and right children
        uint8 grandChild;
        for (uint8 j = 0; j < 4; j++) {
            grandChild = 2 * leftChild + j;
            if (grandChild <= self.count && compare(self.operators[grandChild].utilization, self.operators[extreme].utilization)) {
                extreme = grandChild;
            }
        }
        return extreme;
    }

    /// @dev Comparison function to determine if the first value is smaller than the second.
    /// @param a The first value.
    /// @param b The second value.
    /// @return bool True if `a` is smaller than `b`, false otherwise.
    function _isSmaller(uint256 a, uint256 b) private pure returns (bool) {
        return a < b;
    }

    /// @dev Comparison function to determine if the first value is larger than the second.
    /// @param a The first value.
    /// @param b The second value.
    /// @return bool True if `a` is larger than `b`, false otherwise.
    function _isLarger(uint256 a, uint256 b) private pure returns (bool) {
        return a > b;
    }

    /// @dev Returns whether the node at the specified index is on a min level.
    /// @param index The index of the node in the heap.
    function _isOnMinLevel(uint8 index) private pure returns (bool) {
        return _getLevel(index) % 2 == 0;
    }

    /// @dev Determines the level of a node in a binary heap.
    /// @param index The index of the node in the heap.
    function _getLevel(uint8 index) private pure returns (uint8 level) {
        while (index > 1) {
            index >>= 1;
            level += 1;
        }
    }
}
