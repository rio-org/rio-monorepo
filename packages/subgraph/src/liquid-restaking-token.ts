import { log } from '@graphprotocol/graph-ts';
import { LiquidRestakingToken, TokenTransfer, User } from '../generated/schema';
import { Transfer } from '../generated/templates/LiquidRestakingToken/RioLRT';
import { ZERO_ADDRESS } from './helpers/constants';
import { findOrCreateUser, toUnits } from './helpers/utils';

export function handleLiquidRestakingTokenTransfer(event: Transfer): void {
  // Mint
  if (event.params.from.toHex() == ZERO_ADDRESS) {
    return handleMint(event);
  }

  // Burn
  if (event.params.to.toHex() == ZERO_ADDRESS) {
    return handleBurn(event);
  }

  // Transfer
  if (event.params.to.toHex() != ZERO_ADDRESS && event.params.from.toHex() != ZERO_ADDRESS) {
    return handleTransfer(event);
  }
}

function handleMint(event: Transfer): void {
    const token = LiquidRestakingToken.load(event.address.toHex());
    if (!token) return logIfTokenIsNull('Mint', event);

    token.totalSupply = token.totalSupply.plus(toUnits(event.params.value.toBigDecimal()));
    token.save();
}

function handleBurn(event: Transfer): void {
    const token = LiquidRestakingToken.load(event.address.toHex());
    if (!token) return logIfTokenIsNull('Burn', event);

    token.totalSupply = token.totalSupply.minus(toUnits(event.params.value.toBigDecimal()));
    token.save();
}

function handleTransfer(event: Transfer): void {
  const token = LiquidRestakingToken.load(event.address.toHex());
  const sender = User.load(event.params.from.toHex());
  const receiver = findOrCreateUser(event.params.to.toHex());

  if (!token) return logIfTokenIsNull('Transfer', event);
  if (!sender) return logIfSenderIsNull('Transfer', event);

  const tokenTransfer = new TokenTransfer(`${event.transaction.hash.toHex()}-${event.logIndex.toString()}`);

  tokenTransfer.receiver = receiver.id;
  tokenTransfer.sender = sender.id;
  tokenTransfer.amount = toUnits(event.params.value.toBigDecimal());
  tokenTransfer.restakingToken = token.id;
  tokenTransfer.restakingTokenPriceUSD = token.exchangeRateUSD;
  tokenTransfer.senderBalanceBefore = sender.balance;
  tokenTransfer.senderBalanceAfter = tokenTransfer.senderBalanceBefore.minus(tokenTransfer.amount);
  tokenTransfer.receiverBalanceBefore = receiver.balance;
  tokenTransfer.receiverBalanceAfter = tokenTransfer.receiverBalanceBefore.plus(tokenTransfer.amount);
  tokenTransfer.timestamp = event.block.timestamp;
  tokenTransfer.blockNumber = event.block.number;
  tokenTransfer.tx = event.transaction.hash;

  if (token.exchangeRateUSD !== null) {
    tokenTransfer.valueUSD = token.exchangeRateUSD!.times(tokenTransfer.amount);
  }

  sender.balance = tokenTransfer.senderBalanceAfter;
  receiver.balance = tokenTransfer.receiverBalanceAfter;

  sender.save();
  receiver.save();
  tokenTransfer.save();
}

function logIfTokenIsNull(type: string, event: Transfer): void {
  log.error('[handleLiquidRestakingTokenTransfer] ({}) Token not found: {}. Transfer Hash: {}', [
    type,
    event.address.toHex(),
    event.transaction.hash.toHex(),
  ]);
}

function logIfSenderIsNull(type: string, event: Transfer): void {
  log.error('[handleLiquidRestakingTokenTransfer] ({}) User not found: {}', [
    type,
    event.params.from.toHex(),
  ]);
}