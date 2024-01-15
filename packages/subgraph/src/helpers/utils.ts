import { Address, BigDecimal, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { Asset, LiquidRestakingToken, User, WithdrawalEpoch } from '../../generated/schema';
import { ETH_ADDRESS, WithdrawalEpochStatus, ZERO_ADDRESS, ZERO_BD, ZERO_BI } from './constants';
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
