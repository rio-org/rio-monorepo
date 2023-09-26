// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {Clone} from '@solady/utils/Clone.sol';
import {IRioLRTAssetManager} from 'contracts/interfaces/IRioLRTAssetManager.sol';
import {IRioLRTRewardDistributor} from 'contracts/interfaces/IRioLRTRewardDistributor.sol';
import {IPaymentCoordinator} from 'contracts/interfaces/eigenlayer/IPaymentCoordinator.sol';

contract RioLRTRewardDistributor is IRioLRTRewardDistributor, Clone {
    /// @notice The contract used to coordinate payments from AVSs to operators.
    IPaymentCoordinator public immutable paymentCoordinator;

    /// @notice The LRT asset manager.
    function assetManager() public pure returns (IRioLRTAssetManager) {
        return IRioLRTAssetManager(_getArgAddress(0));
    }

    /// @param _paymentCoordinator The contract used to coordinate payments from AVSs to operators.
    constructor(address _paymentCoordinator) {
        paymentCoordinator = IPaymentCoordinator(_paymentCoordinator);
    }

    /// @notice Claim EigenLayer earnings that have been paid to this contract.
    /// @param proofs The proofs for the Merkle trees.
    /// @param rootIndexes The indexes of the Merkle trees.
    /// @param leaves The leaves of the Merkle trees.
    /// @param leafIndexes The indexes of the leaves.
    function proveAndClaimManyEarnings(
        bytes[] calldata proofs,
        uint256[] calldata rootIndexes,
        IPaymentCoordinator.MerkleLeaf[] calldata leaves,
        uint256[] calldata leafIndexes
    ) external {
        for (uint256 i = 0; i < proofs.length; ) {
            paymentCoordinator.proveAndClaimEarnings(
                proofs[i], rootIndexes[i], leaves[i], leafIndexes[i]
            );
            unchecked {
                ++i;
            }
        }
    }
}
