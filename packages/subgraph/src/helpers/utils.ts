import { Address, BigDecimal, BigInt, Bytes, Entity, Value, dataSource, store } from '@graphprotocol/graph-ts';
import { AVSRegistry, Asset, AssetRegistry, Coordinator, DepositPool, OperatorRegistry, PriceFeed, PriceSource, RewardDistributor, User, WithdrawalEpoch, WithdrawalQueue } from '../../generated/schema';
import { CHAINLINK_FEED_TYPE, ETH_ADDRESS, ETH_USD_CHAINLINK_FEEDS, SupportingContractName, USD_PRICE_FEED_DECIMALS, WithdrawalEpochStatus, ZERO_ADDRESS, ZERO_BD } from './constants';
import { PriceFeed as PriceFeedContract } from '../../generated/RioLRTIssuer/PriceFeed';
import { PriceSource as PriceSourceTemplate } from '../../generated/templates';
import { ERC20Token } from '../../generated/RioLRTIssuer/ERC20Token';

/**
 * Convert a base unit value to units (e.g. 1e18 to 1).
 * @param value The value in base units.
 * @param decimals The number of decimals.
 */
export function toUnits(value: BigDecimal, decimals: u8 = 18): BigDecimal {
  return value.div(BigInt.fromI32(10).pow(decimals).toBigDecimal());
}

/**
 * A native helper function to get the IPFS content ID from an IPFS gateway URL
 * without regex.
 * @param gatewayURL The IPFS gateway URL.
 */
export function getIPFSContentID(gatewayURL: string): string | null {
  const parts = gatewayURL.split('/');
  if (!parts.length) {
    if (gatewayURL.length < 46) {
      return null;
    }
    return gatewayURL;
  }
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].length >= 46) {
      return parts[i];
    }
  }
  return null;
}

/**
 * Create a supporting contract entity.
 * @param entityName The supporting contract entity name.
 * @param address The address of the supporting contract.
 * @param restakingTokenId The ID of the restaking token.
 */
export function createSupportingContract(entityName: string, address: Address, restakingTokenId: string): void {
  let entity: Entity;
  if (entityName == SupportingContractName.COORDINATOR) {
    entity = new Coordinator(address.toHex());
  } else if (entityName == SupportingContractName.ASSET_REGISTRY) {
    entity = new AssetRegistry(address.toHex());
  } else if (entityName == SupportingContractName.OPERATOR_REGISTRY) {
    entity = new OperatorRegistry(address.toHex());
  } else if (entityName == SupportingContractName.AVS_REGISTRY) {
    entity = new AVSRegistry(address.toHex());
  } else if (entityName == SupportingContractName.DEPOSIT_POOL) {
    entity = new DepositPool(address.toHex());
  } else if (entityName == SupportingContractName.WITHDRAWAL_QUEUE) {
    entity = new WithdrawalQueue(address.toHex());
  } else if (entityName == SupportingContractName.REWARD_DISTRIBUTOR) {
    entity = new RewardDistributor(address.toHex());
  } else {
    throw new Error(`Unexpected supporting contract: ${entityName}`);
  }

  entity.set('address', Value.fromBytes(address));
  entity.set('restakingToken', Value.fromString(restakingTokenId));
  store.set(entityName, address.toHex(), entity);
}

/**
 * Find or create a user by their address.
 * @param address The address of the user.
 * @param save Whether to save the user.
 */
export function findOrCreateUser(address: string, save: boolean = false): User {
  let user: User | null = User.load(address);
  if (user != null) return user;

  user = new User(address);
  user.address = Address.fromString(address);
  user.balance = ZERO_BD;

  if (save) user.save();
  return user;
}

/**
 * Find or create an asset by its address.
 * @param address The address of the asset.
 * @param save Whether to save the asset.
 */
export function findOrCreateAsset(address: Address, save: boolean = false): Asset {
  let asset: Asset | null = Asset.load(address.toHex());
  if (asset != null) return asset;

  asset = new Asset(address.toHex());
  if (asset.id == ETH_ADDRESS) {
    asset.symbol = 'ETH';
    asset.name = 'Ether';
    asset.decimals = 18;
    asset.address = Bytes.fromHexString(ZERO_ADDRESS);

    if (save) asset.save();

    return asset;
  }

  const contract = ERC20Token.bind(address);

  asset.symbol = contract.symbol();
  asset.name = contract.name();
  asset.decimals = contract.decimals();
  asset.address = address;

  if (save) asset.save();

  return asset;
}

/**
 * Find or create a withdrawal epoch.
 * @param restakingToken The address of the restaking token.
 * @param epoch The epoch ID.
 * @param asset The address of the asset.
 * @param save Whether to save the withdrawal epoch.
 */
export function findOrCreateWithdrawalEpoch(restakingToken: string, epoch: BigInt, asset: Asset, save: boolean = false): WithdrawalEpoch {
  const id = getWithdrawalEpochID(restakingToken, epoch, asset.id);

  let withdrawalEpoch: WithdrawalEpoch | null = WithdrawalEpoch.load(id);
  if (withdrawalEpoch != null) return withdrawalEpoch;

  withdrawalEpoch = new WithdrawalEpoch(id);
  withdrawalEpoch.epoch = epoch;
  withdrawalEpoch.asset = asset.id;
  withdrawalEpoch.status = WithdrawalEpochStatus.ACTIVE;
  withdrawalEpoch.restakingToken = restakingToken;
  withdrawalEpoch.sharesOwed = ZERO_BD;
  withdrawalEpoch.assetsReceived = ZERO_BD;
  withdrawalEpoch.shareValueOfAssetsReceived = ZERO_BD;
  withdrawalEpoch.amountToBurnAtSettlement = ZERO_BD;
  withdrawalEpoch.requestCount = 0;
  withdrawalEpoch.claimCount = 0;

  if (save) withdrawalEpoch.save();

  return withdrawalEpoch;
}

/**
 * Find or create a price feed.
 * @param restakingToken The address of the restaking token that added the price feed.
 * @param address The address of the price feed.
 * @param asset The address of the base asset.
 * @param save Whether to save the price feed.
 */
export function findOrCreatePriceFeed(restakingToken: Bytes, address: Address, asset: Asset, save: boolean = false): PriceFeed {
  let priceFeed: PriceFeed | null = PriceFeed.load(address.toHex());
  if (priceFeed != null) {
    if (!priceFeed.usedBy.includes(restakingToken.toHex())) {
      // Assignment required to update the array.
      const usedBy = priceFeed.usedBy;
      usedBy.push(restakingToken.toHex());

      priceFeed.usedBy = usedBy;
      priceFeed.save();
    }
    return priceFeed;
  }

  // If ETH is provided, we use a pseudo address as it's not used onchain.
  if (asset.id == ETH_ADDRESS) {
    priceFeed = new PriceFeed(ZERO_ADDRESS);
    priceFeed.address = Bytes.fromHexString(ZERO_ADDRESS);
    priceFeed.feedType = CHAINLINK_FEED_TYPE;
    priceFeed.description = 'ETH / USD';
    priceFeed.decimals = USD_PRICE_FEED_DECIMALS as i32;
    priceFeed.baseAsset = asset.id;
    priceFeed.quoteAssetSymbol = getQuoteAssetSymbol(USD_PRICE_FEED_DECIMALS);
    priceFeed.assetPair = getAssetPair(asset, USD_PRICE_FEED_DECIMALS);
    priceFeed.usedBy = [restakingToken.toHex()];

    if (save) priceFeed.save();

    // Ensure the price source is created.
    const priceSource = Bytes.fromHexString(ETH_USD_CHAINLINK_FEEDS.get(dataSource.network()));
    findOrCreatePriceSource(changetype<Address>(priceSource), priceFeed, true);

    return priceFeed;
  }

  const contract = PriceFeedContract.bind(address);
  const priceSource = contract.source();

  priceFeed = new PriceFeed(address.toHex());
  priceFeed.address = address;
  priceFeed.feedType = contract.FEED_TYPE();
  priceFeed.description = contract.description();
  priceFeed.decimals = contract.decimals();
  priceFeed.baseAsset = asset.id;
  priceFeed.quoteAssetSymbol = getQuoteAssetSymbol(priceFeed.decimals as u8);
  priceFeed.assetPair = getAssetPair(asset, priceFeed.decimals as u8);
  priceFeed.usedBy = [restakingToken.toHex()];

  if (save) priceFeed.save();

  // Ensure the price source is created.
  findOrCreatePriceSource(priceSource, priceFeed, true);

  return priceFeed;
}

/**
 * Find or create a price source.
 * @param address The address of the underlying price source.
 * @param priceFeed The price feed.
 * @param save Whether to save the price source.
 */
function findOrCreatePriceSource(address: Address, priceFeed: PriceFeed, save: boolean = false): PriceSource {
  let priceSource: PriceSource | null = PriceSource.load(address.toHex());
  if (priceSource != null) return priceSource;

  priceSource = new PriceSource(address.toHex());
  priceSource.address = address;
  priceSource.priceFeed = priceFeed.id;

  if (save) priceSource.save();

  PriceSourceTemplate.create(address);

  return priceSource;
}

/**
 * Get the liquid restaking token to USD exchange rate.
 * @param asset The quote asset address.
 * @param exchangeRateETH The exchange rate to ETH.
 * @param price The price of the provided asset.
 */
export function getExchangeRateUSD(asset: Asset, exchangeRateETH: BigDecimal | null, price: BigDecimal | null): BigDecimal | null {
  if (asset.id == ETH_ADDRESS && exchangeRateETH && price) {
    return exchangeRateETH.times(price); 
  }
  return null;
}

/**
 * Get the asset pair in the format of BASE-QUOTE.
 * @param asset The address of the asset.
 * @param priceFeedDecimals The number of decimals for the price feed.
 */
function getAssetPair(asset: Asset, priceFeedDecimals: u8): string {
  return `${asset.symbol}-${getQuoteAssetSymbol(priceFeedDecimals)}`;
}

/**
 * Get the quote asset symbol.
 * @param priceFeedDecimals The number of decimals for the price feed.
 */
function getQuoteAssetSymbol(priceFeedDecimals: u8): string {
  return priceFeedDecimals == 18 ? 'ETH' : 'USD'
}

/**
 * Get the ID for a withdrawal epoch.
 * @param restakingToken The address of the restaking token.
 * @param epoch The epoch ID.
 * @param asset The address of the asset.
 */
export function getWithdrawalEpochID(restakingToken: string, epoch: BigInt, asset: string): string {
  return `${restakingToken}-${epoch.toString()}-${asset}`;
}

/**
 * Get the ID for a withdrawal epoch user summary.
 * @param restakingToken The address of the restaking token.
 * @param epoch The epoch ID.
 * @param asset The address of the asset.
 * @param user The address of the user.
 */
export function getWithdrawalEpochUserSummaryID(restakingToken: string, epoch: BigInt, asset: string, user: string): string {
  return `${getWithdrawalEpochID(restakingToken, epoch, asset)}-${user}`;
}

/**
 * Get the ID for a withdrawal request.
 * @param restakingToken The address of the restaking token.
 * @param epoch The epoch ID.
 * @param asset The address of the asset.
 * @param user The address of the user.
 * @param requestIndex The index of the withdrawal request.
 */
export function getWithdrawalRequestID(restakingToken: string, epoch: BigInt, asset: string, user: string, requestIndex: number): string {
  return `${getWithdrawalEpochUserSummaryID(restakingToken, epoch, asset, user)}-request-${requestIndex}`;
}

/**
 * Get the ID for a withdrawal claim.
 * @param restakingToken The address of the restaking token.
 * @param epoch The epoch ID.
 * @param asset The address of the asset.
 * @param user The address of the user.
 */
export function getWithdrawalClaimID(restakingToken: string, epoch: BigInt, asset: string, user: string): string {
  return `${getWithdrawalEpochUserSummaryID(restakingToken, epoch, asset, user)}-claim`;
}
