import {
  LiquidRestakingToken as LiquidRestakingTokenTemplate,
  Coordinator as CoordinatorTemplate,
  WithdrawalQueue as WithdrawalQueueTemplate,
  OperatorRegistry as OperatorRegistryTemplate,
} from '../generated/templates';
import { Coordinator, Issuer, LiquidRestakingToken, UnderlyingAsset, WithdrawalQueue, OperatorRegistry } from '../generated/schema';
import { findOrCreateAsset, findOrCreatePriceFeed, findOrCreateWithdrawalEpoch, toUnits } from './helpers/utils';
import { LiquidRestakingTokenIssued } from '../generated/RioLRTIssuer/RioLRTIssuer';
import { ZERO_BD, ZERO_BI } from './helpers/constants';
import { Address } from '@graphprotocol/graph-ts';

export function handleLiquidRestakingTokenIssued(event: LiquidRestakingTokenIssued): void {
  const restakingToken = new LiquidRestakingToken(event.params.deployment.token.toHex());

  const coordinator = new Coordinator(event.params.deployment.coordinator.toHex());
  coordinator.address = event.params.deployment.coordinator;
  coordinator.restakingToken = restakingToken.id;
  coordinator.save();

  const withdrawalQueue = new WithdrawalQueue(event.params.deployment.withdrawalQueue.toHex());
  withdrawalQueue.address = event.params.deployment.withdrawalQueue;
  withdrawalQueue.restakingToken = restakingToken.id;
  withdrawalQueue.save();

  const operatorRegistry = new OperatorRegistry(event.params.deployment.operatorRegistry.toHex());
  operatorRegistry.address = event.params.deployment.operatorRegistry;
  operatorRegistry.restakingToken = restakingToken.id;
  operatorRegistry.save();
  
  restakingToken.address = event.params.deployment.token;
  restakingToken.symbol = event.params.symbol;
  restakingToken.name = event.params.name;
  restakingToken.createdTimestamp = event.block.timestamp;
  restakingToken.totalSupply = ZERO_BD;

  restakingToken.coordinator = coordinator.id;
  restakingToken.withdrawalQueue = withdrawalQueue.id;

  for (let i = 0; i < event.params.config.assets.length; i++) {
    const assetConfig = event.params.config.assets[i];

    const asset = findOrCreateAsset(assetConfig.asset, true);
    findOrCreateWithdrawalEpoch(restakingToken.id, ZERO_BI, asset, true);

    const priceFeed = findOrCreatePriceFeed(restakingToken.address, assetConfig.priceFeed, asset, true);

    const underlyingAsset = new UnderlyingAsset(`${restakingToken.id}-${asset.id}`);
    
    underlyingAsset.address = asset.address;
    underlyingAsset.restakingToken = restakingToken.id;
    underlyingAsset.asset = asset.id;
    underlyingAsset.strategy = assetConfig.strategy;
    underlyingAsset.depositCap = toUnits(assetConfig.depositCap.toBigDecimal(), asset.decimals as u8);
    underlyingAsset.priceFeed = priceFeed.id;
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
  WithdrawalQueueTemplate.create(event.params.deployment.withdrawalQueue);
  OperatorRegistryTemplate.create(event.params.deployment.operatorRegistry);

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
