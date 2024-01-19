import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const ETH_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

export const ZERO_BI = BigInt.fromString('0');

export const ZERO_BD = BigDecimal.fromString('0');

export const USD_PRICE_FEED_DECIMALS: u8 = 8;

export const CHAINLINK_FEED_TYPE = 'CHAINLINK';

export const ETH_USD_CHAINLINK_FEEDS = new Map<string,string>();
ETH_USD_CHAINLINK_FEEDS.set('mainnet', '0xE62B71cf983019BFf55bC83B48601ce8419650CC');
ETH_USD_CHAINLINK_FEEDS.set('goerli', '0x9b0FC4bb9981e5333689d69BdBF66351B9861E62');

export const DELEGATION_MANAGERS = new Map<string,string>();
DELEGATION_MANAGERS.set('mainnet', '0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A');
DELEGATION_MANAGERS.set('goerli', '0x1b7b8F6b258f95Cf9596EabB9aa18B62940Eb0a8');

// String enums are not yet supported by AssemblyScript
export namespace WithdrawalEpochStatus {
  export const ACTIVE = 'ACTIVE';
  export const QUEUED = 'QUEUED';
  export const SETTLED = 'SETTLED';
}
