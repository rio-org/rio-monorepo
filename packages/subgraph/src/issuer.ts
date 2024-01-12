import {
  LiquidRestakingToken as LiquidRestakingTokenTemplate,
  Coordinator as CoordinatorTemplate,
} from '../generated/templates';
import { Asset, Coordinator, Issuer, LiquidRestakingToken, UnderlyingAsset } from '../generated/schema';
import { LiquidRestakingTokenIssued } from '../generated/RioLRTIssuer/RioLRTIssuer';
import { ERC20Token } from '../generated/RioLRTIssuer/ERC20Token';
import { ETH_ADDRESS, ZERO_ADDRESS, ZERO_BD } from './helpers/constants';
import { Address, Bytes } from '@graphprotocol/graph-ts';
import { toUnits } from './helpers/utils';

export function handleLiquidRestakingTokenIssued(event: LiquidRestakingTokenIssued): void {
  const restakingToken = new LiquidRestakingToken(event.params.deployment.token.toHex());

  const coordinator = new Coordinator(event.params.deployment.coordinator.toHex());
  coordinator.address = event.params.deployment.coordinator;
  coordinator.restakingToken = restakingToken.id;
  coordinator.save();
  
  restakingToken.address = event.params.deployment.token;
  restakingToken.symbol = event.params.symbol;
  restakingToken.name = event.params.name;
  restakingToken.createdTimestamp = event.block.timestamp.toI32();
  restakingToken.totalSupply = ZERO_BD;

  restakingToken.coordinator = coordinator.id;

  for (let i = 0; i < event.params.config.assets.length; i++) {
    const assetConfig = event.params.config.assets[i];

    const asset = findOrCreateAsset(assetConfig.asset, true);
    const underlyingAsset = new UnderlyingAsset(`${restakingToken.id}-${asset.id}`);
    
    underlyingAsset.address = asset.address;
    underlyingAsset.restakingToken = restakingToken.id;
    underlyingAsset.asset = asset.id;
    underlyingAsset.strategy = assetConfig.strategy;
    underlyingAsset.depositCap = toUnits(assetConfig.depositCap.toBigDecimal(), asset.decimals as u8);
    underlyingAsset.priceFeed = assetConfig.priceFeed;
    underlyingAsset.balance = ZERO_BD;
    underlyingAsset.balanceInDepositPool = ZERO_BD;
    underlyingAsset.balanceInEigenLayer = ZERO_BD;

    underlyingAsset.save();
  }

  const issuer = findOrCreateIssuer(event.address);
  issuer.tokensIssued += 1;
  issuer.save();

  restakingToken.issuer = issuer.id;
  LiquidRestakingTokenTemplate.create(event.params.deployment.token);
  CoordinatorTemplate.create(event.params.deployment.coordinator);

  restakingToken.save();
}

function findOrCreateIssuer(address: Address, save: boolean = false): Issuer {
  let issuer: Issuer | null = Issuer.load('ISSUER');
  if (issuer != null) return issuer;

  // If no issuer yet, set up with default values.
  issuer = new Issuer('ISSUER');
  issuer.address = address;
  issuer.tokensIssued = 0;

  if (save) issuer.save();

  return issuer;
}

function findOrCreateAsset(address: Address, save: boolean = false): Asset {
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
