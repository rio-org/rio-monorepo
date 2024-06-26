import { Deposited } from '../generated/templates/Coordinator/RioLRTCoordinator';
import { Asset, Coordinator, Deposit, LiquidRestakingToken } from '../generated/schema';
import { findOrCreateUser, getExchangeRateUSD, toUnits } from './helpers/utils';
import { ETH_ADDRESS, STAT_UPDATE_MIN_TRADE, ZERO_BD } from './helpers/constants';
import { BigDecimal } from '@graphprotocol/graph-ts';

export function handleDeposited(event: Deposited): void {
  const coordinator = Coordinator.load(event.address.toHex())!;
  const user = findOrCreateUser(event.params.user.toHex(), true);

  const assetIn = Asset.load(event.params.asset.toHex())!;

  const amountInUnits = toUnits(event.params.amountIn.toBigDecimal(), assetIn.decimals as u8);
  const amountOutUnits = toUnits(event.params.amountOut.toBigDecimal());

  const restakingToken = LiquidRestakingToken.load(coordinator.restakingToken)!;

  // Update exchange rates if enough of the LRT was minted to avoid precision loss.
  if (amountOutUnits.ge(STAT_UPDATE_MIN_TRADE)) {
    restakingToken.exchangeRateETH = getExchangeRateETH(assetIn, amountInUnits, amountOutUnits);
    restakingToken.exchangeRateUSD = getExchangeRateUSD(assetIn, restakingToken.exchangeRateETH, assetIn.latestUSDPrice);
    restakingToken.totalValueETH = restakingToken.exchangeRateETH && restakingToken.totalSupply.times(restakingToken.exchangeRateETH!);
    restakingToken.totalValueUSD = restakingToken.exchangeRateUSD && restakingToken.totalSupply.times(restakingToken.exchangeRateUSD!);
    restakingToken.save();
  }

  const deposit = new Deposit(`${event.transaction.hash.toHex()}-${event.logIndex.toString()}`);
  deposit.user = user.id;
  deposit.sender = event.params.user;
  deposit.assetIn = assetIn.id;
  deposit.amountIn = amountInUnits;
  deposit.amountOut = amountOutUnits;
  deposit.restakingToken = restakingToken.id;
  deposit.restakingTokenPriceUSD = restakingToken.exchangeRateUSD;
  deposit.userBalanceBefore = user.balance;
  deposit.userBalanceAfter = deposit.userBalanceBefore.plus(amountOutUnits);
  deposit.timestamp = event.block.timestamp;
  deposit.blockNumber = event.block.number;
  deposit.tx = event.transaction.hash;

  if (assetIn.latestUSDPrice) {
    deposit.valueUSD = assetIn.latestUSDPrice!.times(amountInUnits).truncate(2);
  }

  user.balance = deposit.userBalanceAfter;
  user.save();

  deposit.save();
}

function getExchangeRateETH(asset: Asset, amountIn: BigDecimal, amountOut: BigDecimal): BigDecimal | null {
  if (asset.id == ETH_ADDRESS) {
    return amountIn.div(amountOut);
  }
  return null;
}
