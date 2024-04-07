// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {IRioLRTOperatorDelegator} from 'contracts/interfaces/IRioLRTOperatorDelegator.sol';
import {IDelegationManager} from 'contracts/interfaces/eigenlayer/IDelegationManager.sol';
import {IBeaconChainProofs} from 'contracts/interfaces/eigenlayer/IBeaconChainProofs.sol';
import {IStrategyManager} from 'contracts/interfaces/eigenlayer/IStrategyManager.sol';
import {IEigenPodManager} from 'contracts/interfaces/eigenlayer/IEigenPodManager.sol';
import {ISignatureUtils} from 'contracts/interfaces/eigenlayer/ISignatureUtils.sol';
import {IEigenPod} from 'contracts/interfaces/eigenlayer/IEigenPod.sol';
import {RioLRTCore} from 'contracts/restaking/base/RioLRTCore.sol';
import {Memory} from 'contracts/utils/Memory.sol';
import {Array} from 'contracts/utils/Array.sol';
import {Asset} from 'contracts/utils/Asset.sol';
import {
    BEACON_CHAIN_STRATEGY,
    BLS_PUBLIC_KEY_LENGTH,
    BLS_SIGNATURE_LENGTH,
    ETH_ADDRESS,
    ETH_DEPOSIT_SIZE,
    ETH_DEPOSIT_SIZE_IN_GWEI_LE64
} from 'contracts/utils/Constants.sol';

contract RioLRTOperatorDelegator is IRioLRTOperatorDelegator, RioLRTCore {
    using SafeERC20 for IERC20;
    using Asset for *;
    using Array for *;

    /// @dev The withdrawal credentials prefix, which signals that withdrawals are enabled.
    bytes1 internal constant WITHDRAWALS_ENABLED_PREFIX = 0x01;

    /// @dev The minimum amount of excess ETH from full withdrawals that can be scraped from the EigenPod.
    uint256 internal constant MIN_EXCESS_FULL_WITHDRAWAL_ETH_FOR_SCRAPE = 1 ether;

    /// @notice The primary entry and exit-point for funds into and out of EigenLayer.
    IStrategyManager public immutable strategyManager;

    /// @notice The contract used for creating and managing EigenPods.
    IEigenPodManager public immutable eigenPodManager;

    /// @notice The primary delegation contract for EigenLayer.
    IDelegationManager public immutable delegationManager;

    /// @notice The operator delegator's EigenPod.
    IEigenPod public eigenPod;

    /// @notice Credentials to withdraw ETH on Consensus Layer via the EigenPod.
    bytes32 public withdrawalCredentials;

    /// @notice The amount of ETH queued for withdrawal to the withdrawal queue, intended for settling
    /// user withdrawals, in gwei.
    uint64 public ethQueuedForUserSettlementGwei;

    /// @notice The amount of ETH queued for withdrawal to the deposit pool, specifically for facilitating
    /// operator exits and excess full withdrawal scrapes, in gwei.
    uint64 public ethQueuedForOperatorExitsAndScrapesGwei;

    /// @notice The mapping of withdrawal roots to the address that's allowed to claim them.
    mapping(bytes32 root => address claimer) public authorizedClaimerByWithdrawalRoot;

    /// @param issuer_ The issuer of the LRT instance that this contract is deployed for.
    /// @param strategyManager_ The primary entry and exit-point for funds into and out of EigenLayer.
    /// @param eigenPodManager_ The contract used for creating and managing EigenPods.
    /// @param delegationManager_ The primary delegation contract for EigenLayer.
    constructor(address issuer_, address strategyManager_, address eigenPodManager_, address delegationManager_)
        RioLRTCore(issuer_)
    {
        strategyManager = IStrategyManager(strategyManager_);
        eigenPodManager = IEigenPodManager(eigenPodManager_);
        delegationManager = IDelegationManager(delegationManager_);
    }

    // forgefmt: disable-next-item
    /// @notice Initializes the contract by delegating to the provided EigenLayer operator.
    /// @param token_ The address of the liquid restaking token.
    /// @param operator The operator's address.
    function initialize(address token_, address operator) external initializer {
        __RioLRTCore_init_noVerify(token_);

        if (msg.sender != address(operatorRegistry())) revert ONLY_OPERATOR_REGISTRY();

        IDelegationManager.OperatorDetails memory operatorDetails = delegationManager.operatorDetails(operator);
        if (operatorDetails.earningsReceiver != address(rewardDistributor())) revert INVALID_EARNINGS_RECEIVER();
        if (operatorDetails.delegationApprover != address(0)) revert INVALID_DELEGATION_APPROVER();
        if (operatorDetails.stakerOptOutWindowBlocks < operatorRegistry().minStakerOptOutBlocks()) {
            revert INVALID_STAKER_OPT_OUT_BLOCKS();
        }

        delegationManager.delegateTo(
            operator,
            ISignatureUtils.SignatureWithExpiry(new bytes(0), 0),
            bytes32(0)
        );

        // Deploy an EigenPod and set the withdrawal credentials to its address.
        address eigenPodAddress = eigenPodManager.createPod();

        eigenPod = IEigenPod(eigenPodAddress);
        withdrawalCredentials = _computeWithdrawalCredentials(eigenPodAddress);
    }

    /// @notice Returns the number of shares in the operator delegator's EigenPod.
    function getEigenPodShares() public view returns (int256) {
        return eigenPodManager.podOwnerShares(address(this));
    }

    /// @notice The amount of ETH queued for withdrawal from EigenLayer, in wei.
    function getETHQueuedForWithdrawal() public view returns (uint256) {
        uint256 ethQueuedSlotData;
        assembly {
            ethQueuedSlotData := sload(ethQueuedForUserSettlementGwei.slot)
        }

        uint64 userSettlementGwei = uint64(ethQueuedSlotData);
        uint64 operatorExitAndScrapeGwei = uint64(ethQueuedSlotData >> 64);

        return (userSettlementGwei + operatorExitAndScrapeGwei).toWei();
    }

    /// @notice Returns the total amount of ETH under management by the operator delegator.
    /// @dev This includes EigenPod shares (verified validator balances minus queued withdrawals)
    /// and ETH queued for withdrawal from EigenLayer. Returns `0` if the total is negative.
    function getETHUnderManagement() external view returns (uint256) {
        int256 aum = getEigenPodShares() + int256(getETHQueuedForWithdrawal());
        if (aum < 0) return 0;

        return uint256(aum);
    }

    /// @notice Verifies withdrawal credentials of validator(s) owned by this operator.
    /// It also verifies the effective balance of the validator(s).
    /// @param oracleTimestamp The Beacon Chain timestamp whose state root the `proof` will be proven against.
    /// @param stateRootProof Proves a `beaconStateRoot` against a block root fetched from the oracle.
    /// @param validatorIndices The list of indices of the validators being proven, refer to consensus specs.
    /// @param validatorFieldsProofs Proofs against the `beaconStateRoot` for each validator in `validatorFields`.
    /// @param validatorFields The fields of the "Validator Container", refer to consensus specs.
    function verifyWithdrawalCredentials(
        uint64 oracleTimestamp,
        IBeaconChainProofs.StateRootProof calldata stateRootProof,
        uint40[] calldata validatorIndices,
        bytes[] calldata validatorFieldsProofs,
        bytes32[][] calldata validatorFields
    ) external onlyOperatorRegistry {
        eigenPod.verifyWithdrawalCredentials(
            oracleTimestamp, stateRootProof, validatorIndices, validatorFieldsProofs, validatorFields
        );
    }

    /// @notice Scrapes non-beacon chain ETH sitting in the operator delegator's
    /// EigenPod to the reward distributor.
    /// @dev Anyone can call this function.
    function scrapeNonBeaconChainETHFromEigenPod() external {
        eigenPod.withdrawNonBeaconChainETHBalanceWei(
            address(rewardDistributor()), eigenPod.nonBeaconChainETHBalanceWei()
        );
    }

    /// @notice Scrapes excess full withdrawal ETH from the operator delegator's EigenPod
    /// to the deposit pool. ETH from full withdrawals may accumulate in the EigenPod over
    /// time as full withdrawals contain more ETH than was requested from the withdrawal queue.
    /// @dev Anyone can call this function.
    function scrapeExcessFullWithdrawalETHFromEigenPod() external {
        uint256 ethWithdrawable = eigenPod.withdrawableRestakedExecutionLayerGwei().toWei();
        uint256 ethQueuedForWithdrawal = getETHQueuedForWithdrawal();
        if (ethWithdrawable <= ethQueuedForWithdrawal + MIN_EXCESS_FULL_WITHDRAWAL_ETH_FOR_SCRAPE) {
            revert INSUFFICIENT_EXCESS_FULL_WITHDRAWAL_ETH();
        }
        _queueWithdrawalForOperatorExitOrScrape(BEACON_CHAIN_STRATEGY, ethWithdrawable - ethQueuedForWithdrawal);
    }

    // forgefmt: disable-next-item
    /// @notice Approve EigenLayer to spend an ERC20 token, then stake it into an EigenLayer strategy.
    /// @param strategy The strategy to stake the tokens into.
    /// @param token_ The token to stake.
    /// @param amount The amount of tokens to stake.
    function stakeERC20(address strategy, address token_, uint256 amount) external onlyDepositPool returns (uint256 shares) {
        if (IERC20(token_).allowance(address(this), address(strategyManager)) < amount) {
            IERC20(token_).forceApprove(address(strategyManager), type(uint256).max);
        }
        shares = strategyManager.depositIntoStrategy(strategy, token_, amount);
    }

    // forgefmt: disable-next-item
    /// Stake ETH via the operator delegator's EigenPod, using the provided validator information.
    /// @param validatorCount The number of validators to deposit into.
    /// @param pubkeyBatch Batched validator public keys.
    /// @param signatureBatch Batched validator signatures.
    function stakeETH(uint256 validatorCount, bytes calldata pubkeyBatch, bytes calldata signatureBatch) external payable onlyDepositPool {
        if (validatorCount == 0 || msg.value / ETH_DEPOSIT_SIZE != validatorCount) revert INVALID_VALIDATOR_COUNT();
        if (pubkeyBatch.length != BLS_PUBLIC_KEY_LENGTH * validatorCount) {
            revert INVALID_PUBLIC_KEYS_BATCH_LENGTH(pubkeyBatch.length, BLS_PUBLIC_KEY_LENGTH * validatorCount);
        }
        if (signatureBatch.length != BLS_SIGNATURE_LENGTH * validatorCount) {
            revert INVALID_SIGNATURES_BATCH_LENGTH(signatureBatch.length, BLS_SIGNATURE_LENGTH * validatorCount);
        }

        bytes32 depositDataRoot;
        bytes32 withdrawalCredentials_ = withdrawalCredentials;
        bytes memory publicKey = Memory.unsafeAllocateBytes(BLS_PUBLIC_KEY_LENGTH);
        bytes memory signature = Memory.unsafeAllocateBytes(BLS_SIGNATURE_LENGTH);
        for (uint256 i = 0; i < validatorCount; ++i) {
            Memory.copyBytes(pubkeyBatch, publicKey, i * BLS_PUBLIC_KEY_LENGTH, 0, BLS_PUBLIC_KEY_LENGTH);
            Memory.copyBytes(signatureBatch, signature, i * BLS_SIGNATURE_LENGTH, 0, BLS_SIGNATURE_LENGTH);
            depositDataRoot = _computeDepositDataRoot(withdrawalCredentials_, publicKey, signature);

            eigenPodManager.stake{value: ETH_DEPOSIT_SIZE}(publicKey, signature, depositDataRoot);
        }
    }

    // forgefmt: disable-next-item
    /// @notice Queues a withdrawal of the specified amount of `shares` from the given `strategy` for claim by the
    /// withdrawal queue, intended for settling user withdrawals.
    /// @param strategy The strategy from which to withdraw.
    /// @param shares The amount of shares to withdraw.
    function queueWithdrawalForUserSettlement(address strategy, uint256 shares) external onlyCoordinator returns (bytes32 root) {
        if (strategy == BEACON_CHAIN_STRATEGY) {
            _increaseETHQueuedForUserSettlement(shares);
        }
        root = _queueWithdrawal(strategy, shares);

        // Only the withdrawal queue is allowed to claim this withdrawal.
        authorizedClaimerByWithdrawalRoot[root] = address(withdrawalQueue());
    }

    // forgefmt: disable-next-item
    /// @notice Queues a withdrawal of the specified amount of `shares` from the given `strategy` for claim by the
    /// deposit pool, specifically for facilitating operator exits.
    /// @param strategy The strategy from which to withdraw.
    /// @param shares The amount of shares to withdraw.
    function queueWithdrawalForOperatorExit(address strategy, uint256 shares) external onlyOperatorRegistry returns (bytes32 root) {
        root = _queueWithdrawalForOperatorExitOrScrape(strategy, shares);
    }

    /// @notice Completes a queued withdrawal of the specified `queuedWithdrawal` for the given `asset`.
    /// @param queuedWithdrawal The withdrawal to complete.
    /// @param asset The asset to withdraw.
    /// @param middlewareTimesIndex The index of the middleware times to use for the withdrawal.
    function completeQueuedWithdrawal(
        IDelegationManager.Withdrawal calldata queuedWithdrawal,
        address asset,
        uint256 middlewareTimesIndex
    ) external returns (bytes32 root) {
        root = _computeWithdrawalRoot(queuedWithdrawal);

        address authorizedClaimer = authorizedClaimerByWithdrawalRoot[root];
        if (msg.sender != authorizedClaimer) revert UNAUTHORIZED_CLAIMER();

        // Decrease the amount of ETH queued for withdrawal, if applicable.
        if (queuedWithdrawal.strategies[0] == BEACON_CHAIN_STRATEGY) {
            if (asset != ETH_ADDRESS) revert INVALID_ASSET_FOR_BEACON_CHAIN_STRATEGY();

            if (authorizedClaimer == address(withdrawalQueue())) {
                _decreaseETHQueuedForUserSettlement(queuedWithdrawal.shares[0]);
            } else if (authorizedClaimer == address(depositPool())) {
                _decreaseETHQueuedForOperatorExitOrScrape(queuedWithdrawal.shares[0]);
            }
        }
        delegationManager.completeQueuedWithdrawal(queuedWithdrawal, asset.toArray(), middlewareTimesIndex, true);

        // Forward the withdrawn asset to the claimer.
        asset.transferTo(authorizedClaimer, asset.getSelfBalance());
    }

    /// @notice Forwards ETH rewards to the reward distributor. We consider any ETH sent from
    /// the delayed withdrawal router as a reward - this includes partial withdrawals, any
    /// amount in excess of 32 ETH for full withdrawals, and non-beacon chain ETH.
    receive() external payable {
        if (msg.sender == eigenPod.delayedWithdrawalRouter()) {
            address(rewardDistributor()).transferETH(msg.value);
        }
    }

    // forgefmt: disable-next-item
    /// @dev Queues a withdrawal of the specified amount of `shares` from the given `strategy` for claim by the
    /// deposit pool, specifically for facilitating operator exits or excess full withdrawal scrapes.
    /// @param strategy The strategy from which to withdraw.
    /// @param shares The amount of shares to withdraw.
    function _queueWithdrawalForOperatorExitOrScrape(address strategy, uint256 shares) internal returns (bytes32 root) {
        if (strategy == BEACON_CHAIN_STRATEGY) {
            _increaseETHQueuedForOperatorExitOrScrape(shares);
        }
        root = _queueWithdrawal(strategy, shares);

        // Only the deposit pool is allowed to claim this withdrawal.
        authorizedClaimerByWithdrawalRoot[root] = address(depositPool());
    }

    // forgefmt: disable-next-item
    /// @dev Queue a withdrawal of the given amount of `shares` to the `withdrawer` from the provided `strategy`.
    /// @param strategy The strategy to withdraw from.
    /// @param shares The amount of shares to withdraw.
    /// @dev EigenLayer enforces that the `withdrawer` is the `staker` (this contract).
    function _queueWithdrawal(address strategy, uint256 shares) internal returns (bytes32 root) {
        IDelegationManager.QueuedWithdrawalParams[] memory withdrawalParams = new IDelegationManager.QueuedWithdrawalParams[](1);
        withdrawalParams[0] = IDelegationManager.QueuedWithdrawalParams({
            strategies: strategy.toArray(),
            shares: shares.toArray(),
            withdrawer: address(this)
        });
        root = delegationManager.queueWithdrawals(withdrawalParams)[0];
    }

    /// @dev Increase the amount of ETH queued from EigenLayer for user settlement.
    /// @param amountWei The amount of ETH to increase by, in wei.
    function _increaseETHQueuedForUserSettlement(uint256 amountWei) internal {
        ethQueuedForUserSettlementGwei += amountWei.toGwei();
    }

    /// @dev Decrease the amount of ETH queued from EigenLayer for user settlement.
    /// @param amountWei The amount of ETH to decrease by, in wei.
    function _decreaseETHQueuedForUserSettlement(uint256 amountWei) internal {
        ethQueuedForUserSettlementGwei -= amountWei.toGwei();
    }

    /// @dev Increase the amount of ETH queued for operator exit or excess full withdrawal scrape
    /// from EigenLayer.
    /// @param amountWei The amount of ETH to increase by, in wei.
    function _increaseETHQueuedForOperatorExitOrScrape(uint256 amountWei) internal {
        ethQueuedForOperatorExitsAndScrapesGwei += amountWei.toGwei();
    }

    /// @dev Decrease the amount of ETH queued for operator exit or excess full withdrawal scrape
    /// from EigenLayer.
    /// @param amountWei The amount of ETH to decrease by, in wei.
    function _decreaseETHQueuedForOperatorExitOrScrape(uint256 amountWei) internal {
        ethQueuedForOperatorExitsAndScrapesGwei -= amountWei.toGwei();
    }

    /// @dev Compute withdrawal credentials for the given EigenPod.
    /// @param pod The EigenPod to compute the withdrawal credentials for.
    function _computeWithdrawalCredentials(address pod) internal pure returns (bytes32) {
        return WITHDRAWALS_ENABLED_PREFIX | bytes32(uint256(uint160(pod)));
    }

    // forgefmt: disable-next-item
    /// @dev Returns the keccak256 hash of an EigenLayer `withdrawal`.
    /// @param withdrawal The withdrawal.
    function _computeWithdrawalRoot(IDelegationManager.Withdrawal calldata withdrawal) internal pure returns (bytes32) {
        return keccak256(abi.encode(withdrawal));
    }

    // forgefmt: disable-next-item
    /// @dev Computes the deposit_root_hash required by the Beacon Deposit contract.
    /// @param withdrawalCredentials_ Credentials to withdraw ETH on Consensus Layer.
    /// @param publicKey A BLS12-381 public key.
    /// @param signature A BLS12-381 signature.
    function _computeDepositDataRoot(bytes32 withdrawalCredentials_, bytes memory publicKey, bytes memory signature) internal pure returns (bytes32) {
        // Compute the deposit data root (`DepositData` hash tree root) according to deposit_contract.sol
        bytes memory sigPart1 = Memory.unsafeAllocateBytes(64);
        bytes memory sigPart2 = Memory.unsafeAllocateBytes(32);

        Memory.copyBytes(signature, sigPart1, 0, 0, 64);
        Memory.copyBytes(signature, sigPart2, 64, 0, 32);

        bytes32 publicKeyRoot = sha256(abi.encodePacked(publicKey, bytes16(0)));
        bytes32 signatureRoot =
            sha256(abi.encodePacked(sha256(abi.encodePacked(sigPart1)), sha256(abi.encodePacked(sigPart2, bytes32(0)))));

        return sha256(
            abi.encodePacked(
                sha256(abi.encodePacked(publicKeyRoot, withdrawalCredentials_)),
                sha256(abi.encodePacked(ETH_DEPOSIT_SIZE_IN_GWEI_LE64, bytes24(0), signatureRoot))
            )
        );
    }
}
