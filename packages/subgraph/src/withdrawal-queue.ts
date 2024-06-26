import { EpochQueuedForSettlementFromEigenLayer, EpochQueuedForSettlementFromEigenLayer1 as EpochQueuedForSettlementFromEigenLayerLegacy, EpochSettledFromDepositPool, EpochSettledFromEigenLayer, WithdrawalQueued, WithdrawalQueued1 as WithdrawalQueuedLegacy, WithdrawalsClaimedForEpoch } from '../generated/templates/WithdrawalQueue/RioLRTWithdrawalQueue';
import { findOrCreateAsset, findOrCreateUser, findOrCreateWithdrawalEpoch, getWithdrawalClaimID, getWithdrawalEpochUserSummaryID, getWithdrawalRequestID, toUnits } from './helpers/utils';
import { WithdrawalRequest, WithdrawalQueue, WithdrawalEpochUserSummary, WithdrawalClaim, LiquidRestakingToken } from '../generated/schema';
import { WithdrawalEpochStatus, ZERO_BD } from './helpers/constants';
import { Address, BigInt } from '@graphprotocol/graph-ts';

export function handleWithdrawalQueuedLegacy(event: WithdrawalQueuedLegacy): void {
  const queue = WithdrawalQueue.load(event.address.toHex())!;
  const user = findOrCreateUser(event.params.withdrawer.toHex(), true);

  const userWithdrawalSummary = findOrCreateWithdrawalEpochUserSummary(
    queue.restakingToken, event.params.epoch, event.params.asset, event.params.withdrawer, false
  );

  const sharesOwedUnits = toUnits(event.params.sharesOwed.toBigDecimal());
  const amountInUnits = toUnits(event.params.amountIn.toBigDecimal());

  const asset = findOrCreateAsset(event.params.asset, false);
  const withdrawalEpoch = findOrCreateWithdrawalEpoch(queue.restakingToken, event.params.epoch, asset, true);
  withdrawalEpoch.sharesOwed = withdrawalEpoch.sharesOwed.plus(sharesOwedUnits);
  withdrawalEpoch.amountIn = withdrawalEpoch.amountIn.plus(amountInUnits);
  withdrawalEpoch.requestCount = withdrawalEpoch.requestCount + 1;
  withdrawalEpoch.save();

  const restakingToken = LiquidRestakingToken.load(queue.restakingToken)!;

  const request = new WithdrawalRequest(
    getWithdrawalRequestID(queue.restakingToken, event.params.epoch, asset.id, user.id, userWithdrawalSummary.requestCount)
  );
  request.user = user.id;
  request.sender = event.params.withdrawer;
  request.epoch = withdrawalEpoch.id;
  request.assetOut = asset.id;
  request.amountIn = amountInUnits;
  request.restakingToken = queue.restakingToken;
  request.restakingTokenPriceUSD = restakingToken.exchangeRateUSD;
  request.userBalanceAfter = user.balance;
  request.userBalanceBefore = request.userBalanceAfter.plus(amountInUnits);
  request.timestamp = event.block.timestamp;
  request.blockNumber = event.block.number;
  request.tx = event.transaction.hash;
  request.logIndex = event.logIndex;
  request.isClaimed = false;

  if (restakingToken.exchangeRateUSD) {
    request.valueUSD = restakingToken.exchangeRateUSD!.times(amountInUnits);
  }

  userWithdrawalSummary.requestCount = userWithdrawalSummary.requestCount + 1;
  userWithdrawalSummary.save();

  request.save();
}

export function handleWithdrawalQueued(event: WithdrawalQueued): void {
  const queue = WithdrawalQueue.load(event.address.toHex())!;
  const user = findOrCreateUser(event.params.withdrawer.toHex(), true);

  const userWithdrawalSummary = findOrCreateWithdrawalEpochUserSummary(
    queue.restakingToken, event.params.epoch, event.params.asset, event.params.withdrawer, false
  );

  const amountInUnits = toUnits(event.params.amountIn.toBigDecimal());

  const asset = findOrCreateAsset(event.params.asset, false);
  const withdrawalEpoch = findOrCreateWithdrawalEpoch(queue.restakingToken, event.params.epoch, asset, true);

  withdrawalEpoch.amountIn = withdrawalEpoch.amountIn.plus(amountInUnits);
  withdrawalEpoch.requestCount = withdrawalEpoch.requestCount + 1;
  withdrawalEpoch.save();

  const restakingToken = LiquidRestakingToken.load(queue.restakingToken)!;

  const request = new WithdrawalRequest(
    getWithdrawalRequestID(queue.restakingToken, event.params.epoch, asset.id, user.id, userWithdrawalSummary.requestCount)
  );
  request.user = user.id;
  request.sender = event.params.withdrawer;
  request.epoch = withdrawalEpoch.id;
  request.assetOut = asset.id;
  request.amountIn = amountInUnits;
  request.restakingToken = queue.restakingToken;
  request.restakingTokenPriceUSD = restakingToken.exchangeRateUSD;
  request.userBalanceAfter = user.balance;
  request.userBalanceBefore = request.userBalanceAfter.plus(amountInUnits);
  request.timestamp = event.block.timestamp;
  request.blockNumber = event.block.number;
  request.tx = event.transaction.hash;
  request.logIndex = event.logIndex;
  request.isClaimed = false;

  if (restakingToken.exchangeRateUSD) {
    request.valueUSD = restakingToken.exchangeRateUSD!.times(amountInUnits);
  }

  userWithdrawalSummary.requestCount = userWithdrawalSummary.requestCount + 1;
  userWithdrawalSummary.save();

  request.save();
}

export function handleWithdrawalsClaimedForEpoch(event: WithdrawalsClaimedForEpoch): void {
  const queue = WithdrawalQueue.load(event.address.toHex())!;
  const user = findOrCreateUser(event.params.withdrawer.toHex(), true);
  const userWithdrawalSummary = findOrCreateWithdrawalEpochUserSummary(
    queue.restakingToken, event.params.epoch, event.params.asset, event.params.withdrawer, false
  );

  const restakingToken = LiquidRestakingToken.load(queue.restakingToken)!;

  const asset = findOrCreateAsset(event.params.asset, false);
  const withdrawalEpoch = findOrCreateWithdrawalEpoch(queue.restakingToken, event.params.epoch, asset, true);
  withdrawalEpoch.claimCount = withdrawalEpoch.claimCount + 1;
  withdrawalEpoch.save();

  const claim = new WithdrawalClaim(getWithdrawalClaimID(queue.restakingToken, event.params.epoch, asset.id, user.id));
  claim.user = user.id;
  claim.sender = event.params.withdrawer;
  claim.epoch = withdrawalEpoch.id;
  claim.assetOut = asset.id;
  claim.amountOut = toUnits(event.params.amountOut.toBigDecimal(), asset.decimals as u8);
  claim.restakingToken = queue.restakingToken;
  claim.restakingTokenPriceUSD = restakingToken.exchangeRateUSD;
  claim.timestamp = event.block.timestamp;
  claim.blockNumber = event.block.number;
  claim.tx = event.transaction.hash;

  if (asset.latestUSDPrice) {
    claim.valueUSD = asset.latestUSDPrice!.times(claim.amountOut).truncate(2);
  }
  claim.save();

  for (let i = 0; i < userWithdrawalSummary.requestCount; i++) {
    const request = WithdrawalRequest.load(getWithdrawalRequestID(queue.restakingToken, event.params.epoch, asset.id, user.id, i))!;
    request.isClaimed = true;
    request.claim = claim.id;
    request.save();
  }
}

export function handleEpochSettledFromDepositPool(event: EpochSettledFromDepositPool): void {
  const queue = WithdrawalQueue.load(event.address.toHex())!;
  const asset = findOrCreateAsset(event.params.asset, true);

  const withdrawalEpoch = findOrCreateWithdrawalEpoch(queue.restakingToken, event.params.epoch, asset, true);
  withdrawalEpoch.status = WithdrawalEpochStatus.SETTLED;
  withdrawalEpoch.sharesOwed = ZERO_BD;
  withdrawalEpoch.assetsReceived = toUnits(event.params.assetsReceived.toBigDecimal(), asset.decimals as u8);
  withdrawalEpoch.settledTimestamp = event.block.timestamp;
  withdrawalEpoch.save();
}

export function handleEpochQueuedForSettlementFromEigenLayerLegacy(event: EpochQueuedForSettlementFromEigenLayerLegacy): void {
  const queue = WithdrawalQueue.load(event.address.toHex())!;
  const asset = findOrCreateAsset(event.params.asset, true);

  const withdrawalEpoch = findOrCreateWithdrawalEpoch(queue.restakingToken, event.params.epoch, asset, true);
  withdrawalEpoch.status = WithdrawalEpochStatus.QUEUED;
  withdrawalEpoch.assetsReceived = toUnits(event.params.assetsReceived.toBigDecimal(), asset.decimals as u8);
  withdrawalEpoch.amountToBurnAtSettlement = withdrawalEpoch.amountToBurnAtSettlement.minus(
    toUnits(event.params.restakingTokensBurned.toBigDecimal())
  );
  withdrawalEpoch.aggregateRoot = event.params.aggregateRoot;
  withdrawalEpoch.queuedTimestamp = event.block.timestamp;
  withdrawalEpoch.save();
}

export function handleEpochQueuedForSettlementFromEigenLayer(event: EpochQueuedForSettlementFromEigenLayer): void {
  const queue = WithdrawalQueue.load(event.address.toHex())!;

  const asset = findOrCreateAsset(event.params.asset, true);

  const withdrawalEpoch = findOrCreateWithdrawalEpoch(queue.restakingToken, event.params.epoch, asset, true);
  withdrawalEpoch.status = WithdrawalEpochStatus.QUEUED;
  withdrawalEpoch.assetsReceived = toUnits(event.params.assetsReceived.toBigDecimal(), asset.decimals as u8);
  withdrawalEpoch.sharesOwed = toUnits(
    event.params.totalShareValueAtRebalance.minus(event.params.shareValueOfAssetsReceived).toBigDecimal()
  );
  withdrawalEpoch.amountToBurnAtSettlement = withdrawalEpoch.amountToBurnAtSettlement.minus(
    toUnits(event.params.restakingTokensBurned.toBigDecimal())
  );
  withdrawalEpoch.aggregateRoot = event.params.aggregateRoot;
  withdrawalEpoch.queuedTimestamp = event.block.timestamp;
  withdrawalEpoch.save();
}

export function handleEpochSettledFromEigenLayer(event: EpochSettledFromEigenLayer): void {
  const queue = WithdrawalQueue.load(event.address.toHex())!;

  const asset = findOrCreateAsset(event.params.asset, true);

  const withdrawalEpoch = findOrCreateWithdrawalEpoch(queue.restakingToken, event.params.epoch, asset, true);
  withdrawalEpoch.status = WithdrawalEpochStatus.SETTLED;
  withdrawalEpoch.sharesOwed = ZERO_BD;
  withdrawalEpoch.assetsReceived = withdrawalEpoch.assetsReceived.plus(toUnits(event.params.assetsReceived.toBigDecimal(), asset.decimals as u8));
  withdrawalEpoch.settledTimestamp = event.block.timestamp;
  withdrawalEpoch.save();
}

function findOrCreateWithdrawalEpochUserSummary(restakingToken: string, epoch: BigInt, asset: Address, user: Address, save: boolean = false): WithdrawalEpochUserSummary {
  const id = getWithdrawalEpochUserSummaryID(restakingToken, epoch, asset.toHex(), user.toHex());

  let summary: WithdrawalEpochUserSummary | null = WithdrawalEpochUserSummary.load(id);
  if (summary != null) return summary;

  // If no summary yet, set up with default values.
  summary = new WithdrawalEpochUserSummary(id);
  summary.epoch = epoch.toString();
  summary.asset = asset.toHex();
  summary.user = user.toHex();
  summary.requestCount = 0;

  if (save) summary.save();

  return summary;
}
