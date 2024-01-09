import {
  LiquidRestakingToken as LiquidRestakingTokenTemplate,
  Gateway as GatewayTemplate,
} from '../generated/templates';
import { Gateway, Issuer, LiquidRestakingToken, Token, UnderlyingToken } from '../generated/schema';
import { LiquidRestakingTokenIssued } from '../generated/RioLRTIssuer/RioLRTIssuer';
import { ERC20Token } from '../generated/RioLRTIssuer/ERC20Token';
import { ZERO_ADDRESS, ZERO_BD } from './helpers/constants';
import { Address, Bytes } from '@graphprotocol/graph-ts';
import { toUnits } from './helpers/utils';

export function handleLiquidRestakingTokenIssued(event: LiquidRestakingTokenIssued): void {
  const restakingToken = new LiquidRestakingToken(event.params.deployment.token.toHex());

  const gateway = new Gateway(event.params.deployment.gateway.toHex());
  gateway.address = event.params.deployment.gateway;
  gateway.restakingToken = restakingToken.id;
  gateway.save();
  
  restakingToken.symbol = event.params.symbol;
  restakingToken.name = event.params.name;
  restakingToken.address = event.params.deployment.token;
  restakingToken.createdTimestamp = event.block.timestamp.toI32();
  restakingToken.gateway = gateway.id;
  restakingToken.poolId = event.params.poolId.toHex();
  restakingToken.totalSupply = ZERO_BD;

  for (let i = 0; i < event.params.config.tokens.length; i++) {
    const token = findOrCreateToken(event.params.config.tokens[i], true);
    const underlyingToken = new UnderlyingToken(`${restakingToken.id}-${token.id}`);
    
    underlyingToken.address = token.address;
    underlyingToken.restakingToken = restakingToken.id;
    underlyingToken.token = token.id;
    underlyingToken.index = i + 1; // Account for BPT at index 0.
    underlyingToken.weight = toUnits(
      event.params.config.normalizedWeights[i].toBigDecimal()
    );
    underlyingToken.balance = toUnits(
      event.params.config.amountsIn[i].toBigDecimal(), token.decimals as u8,
    );
    underlyingToken.cashBalance = underlyingToken.balance;
    underlyingToken.managedBalance = ZERO_BD;

    underlyingToken.strategy = event.params.config.strategies[i];

    underlyingToken.save();
  }
  
  // Create ETH as a token.
  const eth = new Token(ZERO_ADDRESS);
  eth.symbol = 'ETH';
  eth.name = 'Ether';
  eth.decimals = 18;
  eth.address = Bytes.fromHexString(ZERO_ADDRESS);
  eth.save();

  const issuer = findOrCreateIssuer(event.address);
  issuer.tokensIssued += 1;
  issuer.save();

  restakingToken.issuer = issuer.id;
  LiquidRestakingTokenTemplate.create(event.params.deployment.token);
  GatewayTemplate.create(event.params.deployment.gateway);

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

function findOrCreateToken(address: Address, save: boolean = false): Token {
  let token: Token | null = Token.load(address.toHex());
  if (token != null) return token;

  const contract = ERC20Token.bind(address);

  token = new Token(address.toHex());
  token.symbol = contract.symbol();
  token.name = contract.name();
  token.decimals = contract.decimals();
  token.address = address;

  if (save) token.save();

  return token;
}
