import { JoinedTokensExactIn, RequestedExitTokenExactIn } from '../generated/templates/Gateway/RioLRTGateway';
import { Exit, Gateway, Join, Token, UnderlyingToken, User } from '../generated/schema';
import { Address, BigDecimal } from '@graphprotocol/graph-ts';
import { ExitType, JoinType, ZERO_BD } from './helpers/constants';
import { toUnits } from './helpers/utils';

export function handleJoinedTokensExactIn(event: JoinedTokensExactIn): void {
  const gateway = Gateway.load(event.address.toHex())!;
  const user = findOrCreateUser(event.params.user.toHex(), true);

  const amountOutUnits = toUnits(event.params.amountOut.toBigDecimal());

  const join = new Join(`${event.transaction.hash.toHex()}-${event.logIndex.toString()}`);
  join.type = JoinType.TOKENS_EXACT_IN;
  join.tx = event.transaction.hash;
  join.timestamp = event.block.timestamp;
  join.blockNumber = event.block.number;
  join.restakingToken = gateway.restakingToken;
  join.sender = event.params.user;
  join.user = user.id;
  join.userBalanceBefore = user.balance;
  join.userBalanceAfter = join.userBalanceBefore.plus(amountOutUnits);

  user.balance = join.userBalanceAfter;
  user.save();

  let tokensIn: string[] = [];
  let amountsIn: BigDecimal[] = [];
  for (let i = 0; i < event.params.tokensIn.length; i++) {
    const tokenIn = event.params.tokensIn[i].toHex();
    const amountIn = event.params.amountsIn[i];
    if (amountIn.isZero()) {
      continue;
    }

    const decimals = Token.load(tokenIn)!.decimals as u8;
    const amountInUnits = toUnits(amountIn.toBigDecimal(), decimals);

    tokensIn.push(tokenIn);
    amountsIn.push(amountInUnits);
  }
  join.tokensIn = tokensIn;
  join.amountsIn = amountsIn;
  join.amountOut = amountOutUnits;

  join.save();
}

export function handleRequestedExitTokenExactIn(event: RequestedExitTokenExactIn): void {
  const gateway = Gateway.load(event.address.toHex())!;
  const user = findOrCreateUser(event.params.user.toHex(), true);

  const amountInUnits = toUnits(event.params.amountIn.toBigDecimal());

  const exit = new Exit(`${event.transaction.hash.toHex()}-${event.logIndex.toString()}`);
  exit.type = ExitType.TOKEN_EXACT_IN;
  exit.tx = event.transaction.hash;
  exit.timestamp = event.block.timestamp;
  exit.blockNumber = event.block.number;
  exit.restakingToken = gateway.restakingToken;
  exit.sender = event.params.user;
  exit.user = user.id;
  exit.userBalanceBefore = user.balance;
  exit.userBalanceAfter = exit.userBalanceBefore.minus(amountInUnits);

  user.balance = exit.userBalanceAfter;
  user.save();

  const tokenOut = event.params.tokenOut.toHex();
  const decimals = Token.load(tokenOut)!.decimals as u8;
  const amountOutUnits = toUnits(event.params.amountOut.toBigDecimal(), decimals);

  exit.tokensOut = [tokenOut];
  exit.amountsOut = [amountOutUnits];
  exit.sharesOwed = [toUnits(event.params.sharesOwed.toBigDecimal())];

  exit.amountIn = amountInUnits;

  exit.save();
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
