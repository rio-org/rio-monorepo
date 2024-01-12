import { Deposited, WithdrawalRequested } from '../generated/templates/Coordinator/RioLRTCoordinator';
import { Asset, Coordinator, Deposit, Withdrawal, User } from '../generated/schema';
import { Address } from '@graphprotocol/graph-ts';
import { ZERO_BD } from './helpers/constants';
import { toUnits } from './helpers/utils';

export function handleDeposited(event: Deposited): void {
  const coordinator = Coordinator.load(event.address.toHex())!;
  const user = findOrCreateUser(event.params.user.toHex(), true);

  const assetIn = Asset.load(event.params.asset.toHex())!;

  const amountInUnits = toUnits(event.params.amountIn.toBigDecimal(), assetIn.decimals as u8);
  const amountOutUnits = toUnits(event.params.amountOut.toBigDecimal());

  const deposit = new Deposit(`${event.transaction.hash.toHex()}-${event.logIndex.toString()}`);
  deposit.user = user.id;
  deposit.sender = event.params.user;
  deposit.assetIn = assetIn.id;
  deposit.amountIn = amountInUnits;
  deposit.amountOut = amountOutUnits;
  deposit.restakingToken = coordinator.restakingToken;
  deposit.userBalanceBefore = user.balance;
  deposit.userBalanceAfter = deposit.userBalanceBefore.plus(amountOutUnits);
  deposit.timestamp = event.block.timestamp;
  deposit.blockNumber = event.block.number;
  deposit.tx = event.transaction.hash;

  user.balance = deposit.userBalanceAfter;
  user.save();

  deposit.save();
}

export function handleWithdrawalRequested(event: WithdrawalRequested): void {
  const coordinator = Coordinator.load(event.address.toHex())!;
  const user = findOrCreateUser(event.params.user.toHex(), true);

  const sharesOwedUnits = toUnits(event.params.sharesOwed.toBigDecimal());
  const amountInUnits = toUnits(event.params.amountIn.toBigDecimal());

  const withdrawal = new Withdrawal(`${event.transaction.hash.toHex()}-${event.logIndex.toString()}`);
  withdrawal.user = user.id;
  withdrawal.sender = event.params.user;
  withdrawal.assetOut = event.params.asset.toHex();
  withdrawal.sharesOwed = sharesOwedUnits;
  withdrawal.amountIn = amountInUnits;
  withdrawal.restakingToken = coordinator.restakingToken;
  withdrawal.userBalanceBefore = user.balance;
  withdrawal.userBalanceAfter = withdrawal.userBalanceBefore.minus(amountInUnits);
  withdrawal.timestamp = event.block.timestamp;
  withdrawal.blockNumber = event.block.number;
  withdrawal.requestTx = event.transaction.hash;

  user.balance = withdrawal.userBalanceAfter;
  user.save();

  withdrawal.save();
}

function findOrCreateUser(address: string, save: boolean = false): User {
  let user: User | null = User.load(address);
  if (user != null) return user;

  user = new User(address);
  user.address = Address.fromString(address);
  user.balance = ZERO_BD;

  if (save) user.save();
  return user;
}
