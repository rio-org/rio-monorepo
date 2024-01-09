import { BigDecimal } from '@graphprotocol/graph-ts';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const ZERO_BD = BigDecimal.fromString('0');

// String enums are not yet supported by AssemblyScript
export namespace JoinType {
  export const TOKENS_EXACT_IN = 'TOKENS_EXACT_IN';
  export const TOKEN_EXACT_OUT = 'TOKEN_EXACT_OUT';
  export const ALL_TOKENS_EXACT_OUT = 'ALL_TOKENS_EXACT_OUT';
}

export namespace ExitType {
  export const TOKEN_EXACT_IN = 'TOKEN_EXACT_IN';
  export const ALL_TOKENS_EXACT_IN = 'ALL_TOKENS_EXACT_IN';
  export const TOKENS_EXACT_OUT = 'TOKENS_EXACT_OUT';
}
