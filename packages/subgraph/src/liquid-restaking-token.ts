import { BigDecimal, log } from '@graphprotocol/graph-ts';
import { LiquidRestakingToken, TokenTransfer, User } from '../generated/schema';
import { Transfer } from '../generated/templates/LiquidRestakingToken/RioLRT';
import { ZERO_ADDRESS } from './helpers/constants';
import { findOrCreateUser, toUnits } from './helpers/utils';

export function handleLiquidRestakingTokenTransfer(event: Transfer): void {
  // Mint
  if (event.params.from.toHex() == ZERO_ADDRESS) {
    return doMint(event);
  }

  // Burn
  if (event.params.to.toHex() == ZERO_ADDRESS) {
    return doBurn(event);
  }

  // Transfer
  if (event.params.to.toHex() != ZERO_ADDRESS && event.params.from.toHex() != ZERO_ADDRESS) {
    return doUserTransfer(event);
  }
}

const logTokenIsNull = (type: string, event: Transfer): void => {
  log.error(`[handleLiquidRestakingTokenTransfer] ({}) Token not found: {}. Transfer Hash: {}`, [
    type,
    event.address.toHex(),
    event.transaction.hash.toHex(),
  ]);
}

const logUserIsNull = (type: string, event: Transfer): void => {
  log.error(`[handleLiquidRestakingTokenTransfer] ({}) User not found: {}`, [
    type,
    event.params.from.toHex(),
  ]);
}

function doMint(event: Transfer): void {
  const token = LiquidRestakingToken.load(event.address.toHex());
  if (!token) return logTokenIsNull('Mint', event);

  token.totalSupply = token.totalSupply.plus(toUnits(event.params.value.toBigDecimal()));
  token.save();
  return;
}

function doBurn(event: Transfer): void {
  const token = LiquidRestakingToken.load(event.address.toHex());
  if (!token) return logTokenIsNull('Burn', event);

  token.totalSupply = token.totalSupply.minus(toUnits(event.params.value.toBigDecimal()));
  token.save();
  return;
}


function doUserTransfer(event: Transfer): void {
  const token = LiquidRestakingToken.load(event.address.toHex());
  const sender = User.load(event.params.from.toHex());
  const receiver = findOrCreateUser(event.params.to.toHex());

  if (!token) return logTokenIsNull('Transfer', event);
  if (!sender) return logUserIsNull('Transfer', event);

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

  if (token.exchangeRateUSD != null) {
    tokenTransfer.valueUSD = token.exchangeRateUSD.times(tokenTransfer.amount);
  }

  sender.balance = tokenTransfer.senderBalanceAfter;
  receiver.balance = tokenTransfer.receiverBalanceAfter;
  sender.save();
  receiver.save();

  tokenTransfer.save();
}
