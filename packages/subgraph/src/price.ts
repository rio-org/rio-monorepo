import { AnswerUpdated } from '../generated/templates/PriceSource/PriceSource';
import { USD_PRICE_FEED_DECIMALS, ZERO_ADDRESS } from './helpers/constants';
import { Asset, PriceFeed, PriceSource } from '../generated/schema';
import { BigDecimal, log } from '@graphprotocol/graph-ts';
import { toUnits } from './helpers/utils';

export function handleAnswerUpdated(event: AnswerUpdated): void {
  const priceSource = PriceSource.load(event.address.toHex());
  if (!priceSource) {
    log.warning("PriceSource not found {}", [event.address.toHexString()]);
    return;
  }

  const priceFeed = PriceFeed.load(priceSource.priceFeed)!;
  priceFeed.price = toUnits(event.params.current.toBigDecimal(), priceFeed.decimals as u8);
  priceFeed.lastUpdatedTimestamp = event.params.updatedAt;

  priceFeed.save();

  const asset = Asset.load(priceFeed.baseAsset)!;
  asset.latestUSDPrice = getUSDPrice(priceFeed.price!, priceFeed.decimals as u8);
  asset.latestUSDPriceTimestamp = event.params.updatedAt;
  asset.save();
}

function getUSDPrice(price: BigDecimal, priceFeedDecimals: u8): BigDecimal | null {
  if (priceFeedDecimals == USD_PRICE_FEED_DECIMALS) {
    return price.truncate(2);
  }

  const etherPriceFeed = PriceFeed.load(ZERO_ADDRESS);
  if (!etherPriceFeed || !etherPriceFeed.price) {
    log.warning("Ether price feed not found or price not set", []);
    return null;
  }
  return price.times(etherPriceFeed.price!).truncate(2);
}
