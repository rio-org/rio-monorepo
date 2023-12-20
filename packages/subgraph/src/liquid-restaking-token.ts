import { log } from '@graphprotocol/graph-ts';
import { LiquidRestakingToken } from '../generated/schema';
import { Transfer } from '../generated/templates/LiquidRestakingToken/RioLRT';
import { ZERO_ADDRESS } from './helpers/constants';
import { toUnits } from './helpers/utils';

export function handleLiquidRestakingTokenTransfer(event: Transfer): void {
  // Mint
  if (event.params.from.toHex() == ZERO_ADDRESS) {
    const token = LiquidRestakingToken.load(event.address.toHex());
    if (token == null) {
      log.error('[handleLiquidRestakingTokenTransfer] (Mint) Token not found: {}. Transfer Hash: {}', [
        event.address.toHex(),
        event.transaction.hash.toHex(),
      ]);
      return;
    }

    token.totalSupply = token.totalSupply.plus(toUnits(event.params.value.toBigDecimal()));
    token.save();
    return;
  }

  // Burn
  if (event.params.to.toHex() == ZERO_ADDRESS) {
    const token = LiquidRestakingToken.load(event.address.toHex());
    if (token == null) {
      log.error('[handleLiquidRestakingTokenTransfer] (Burn) Token not found: {}. Transfer Hash: {}', [
        event.address.toHex(),
        event.transaction.hash.toHex(),
      ]);
      return;
    }

    token.totalSupply = token.totalSupply.minus(toUnits(event.params.value.toBigDecimal()));
    token.save();
    return;
  }
}
