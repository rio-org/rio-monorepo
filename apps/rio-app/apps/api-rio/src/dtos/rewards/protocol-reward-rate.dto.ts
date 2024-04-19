import { SUPPORTED_CHAIN_IDS, SUPPORTED_CHAIN_NAMES } from '@rio-app/common';
import { IsAlpha, IsAlphanumeric, IsNotEmpty, IsString } from 'class-validator';

export class ProtocolRewardRateDto {
  @IsString()
  @IsNotEmpty()
  @IsAlpha()
  token: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  chain:
    | (typeof SUPPORTED_CHAIN_IDS)[number]
    | (typeof SUPPORTED_CHAIN_NAMES)[number];
}
