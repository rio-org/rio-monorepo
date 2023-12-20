import { Address } from '@graphprotocol/graph-ts';
import { WrappersDeployed } from '../generated/TokenWrapperFactory/TokenWrapperFactory';
import { ERC20Token } from '../generated/TokenWrapperFactory/ERC20Token';
import { Token, TokenWrapper, TokenWrapperFactory } from '../generated/schema';

export function handleWrappersDeployed(event: WrappersDeployed): void {
  const factory = findOrCreateTokenWrapperFactory(event.address, true);

  const wrappedToken = event.params.wrapped;
  const unwrappedToken = event.params.unwrapped;
  for (let i = 0; i < event.params.wrappers.length; i++) {
    const wrapper = event.params.wrappers[i];

    findOrCreateTokenWrapper(factory.id, wrapper, wrappedToken, unwrappedToken, true);
  }
}

function findOrCreateTokenWrapperFactory(address: Address, save: boolean = false): TokenWrapperFactory {
  let factory: TokenWrapperFactory | null = TokenWrapperFactory.load('TOKEN_WRAPPER_FACTORY');
  if (factory != null) return factory;

  // If no issuer yet, set up with default values.
  factory = new TokenWrapperFactory('TOKEN_WRAPPER_FACTORY');
  factory.address = address;

  if (save) factory.save();

  return factory;
}

function findOrCreateTokenWrapper(
  factory: string,
  address: Address,
  wrappedTokenAddress: Address,
  unwrappedTokenAddress: Address,
  save: boolean = false
): TokenWrapper {
  let wrapper: TokenWrapper | null = TokenWrapper.load(address.toHex());
  if (wrapper != null) return wrapper;

  const wrappedToken = findOrCreateToken(wrappedTokenAddress, true);
  const unwrappedToken = findOrCreateToken(unwrappedTokenAddress, true);

  wrapper = new TokenWrapper(address.toHex());
  wrapper.address = address;
  wrapper.factory = factory;
  wrapper.wrappedToken = wrappedTokenAddress.toHex();
  wrapper.unwrappedToken = unwrappedTokenAddress.toHex();

  if (save) wrapper.save();

  wrappedToken.wrapper = wrapper.id;
  wrappedToken.save();

  unwrappedToken.wrapper = wrapper.id;
  unwrappedToken.save();

  return wrapper;
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
