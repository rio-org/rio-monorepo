import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';

/**
 * Convert a base unit value to units (e.g. 1e18 to 1)
 * @param value The value in base units
 * @param decimals The number of decimals
 */
export function toUnits(value: BigDecimal, decimals: u8 = 18): BigDecimal {
  return value.div(BigInt.fromI32(10).pow(decimals).toBigDecimal());
}
