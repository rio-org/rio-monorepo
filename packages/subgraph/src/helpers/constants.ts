import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const ETH_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

export const ZERO_BI = BigInt.fromString('0');

export const ZERO_BD = BigDecimal.fromString('0');

// String enums are not yet supported by AssemblyScript
export namespace WithdrawalEpochStatus {
  export const ACTIVE = 'ACTIVE';
  export const QUEUED = 'QUEUED';
  export const SETTLED = 'SETTLED';
}
