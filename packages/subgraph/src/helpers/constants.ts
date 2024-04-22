import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const ETH_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

export const ZERO_BI = BigInt.fromString('0');

export const ZERO_BD = BigDecimal.fromString('0');

export const ONE_BI = BigInt.fromString('1');

export const STAT_UPDATE_MIN_TRADE = BigDecimal.fromString('0.0000000001');

export const RATE_MINIMUM_UPDATE_SECONDS = BigInt.fromString('1800');

export const USD_PRICE_FEED_DECIMALS: u8 = 8;

export const PUBKEY_LENGTH: i32 = 96;

export const CHAINLINK_FEED_TYPE = 'CHAINLINK';

export const ETH_USD_CHAINLINK_FEEDS = new Map<string,string>();
ETH_USD_CHAINLINK_FEEDS.set('mainnet', '0xE62B71cf983019BFf55bC83B48601ce8419650CC');
ETH_USD_CHAINLINK_FEEDS.set('goerli', '0x9b0FC4bb9981e5333689d69BdBF66351B9861E62');
ETH_USD_CHAINLINK_FEEDS.set('holesky', '0x65e7493987b3c2453627a96adc1fa0c23d737307');

export const DELEGATION_MANAGERS = new Map<string,string>();
DELEGATION_MANAGERS.set('mainnet', '0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A');
DELEGATION_MANAGERS.set('goerli', '0x1b7b8F6b258f95Cf9596EabB9aa18B62940Eb0a8');
DELEGATION_MANAGERS.set('holesky', '0xA44151489861Fe9e3055d95adC98FbD462B948e7');

// String enums are not yet supported by AssemblyScript
export namespace WithdrawalEpochStatus {
  export const ACTIVE = 'ACTIVE';
  export const QUEUED = 'QUEUED';
  export const SETTLED = 'SETTLED';
}

export namespace ValidatorStatus {
  export const UNUSED = 'UNUSED';
  export const DEPOSITED = 'DEPOSITED';
  export const EXITED = 'EXITED';
}

export namespace SupportingContractName {
  export const COORDINATOR = 'Coordinator';
  export const ASSET_REGISTRY = 'AssetRegistry';
  export const OPERATOR_REGISTRY = 'OperatorRegistry';
  export const AVS_REGISTRY = 'AVSRegistry';
  export const DEPOSIT_POOL = 'DepositPool';
  export const WITHDRAWAL_QUEUE = 'WithdrawalQueue';
  export const REWARD_DISTRIBUTOR = 'RewardDistributor';
}
