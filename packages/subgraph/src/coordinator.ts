import { Deposited } from '../generated/templates/Coordinator/RioLRTCoordinator';
import { Asset, Coordinator, Deposit } from '../generated/schema';
import { findOrCreateUser, toUnits } from './helpers/utils';

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
