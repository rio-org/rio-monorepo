import { IsAlpha, IsAlphanumeric, IsNotEmpty, IsString } from 'class-validator';
import { SUPPORTED_CHAIN_IDS, SUPPORTED_CHAIN_NAMES } from '@rio-app/common';

export class DappDepositDto {
  @IsString()
  @IsNotEmpty()
  @IsAlpha()
  token: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  chain:
    | (typeof SUPPORTED_CHAIN_IDS)[number]
    | (typeof SUPPORTED_CHAIN_NAMES)[number];

  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric()
  txHash: string;
}
