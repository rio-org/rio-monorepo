import {
  IsAlpha,
  IsAlphanumeric,
  IsNotEmpty,
  IsNumberString,
  IsString,
} from 'class-validator';
import {
  IsEthereumTransactionHash,
  SUPPORTED_CHAIN_IDS,
} from '@rio-app/common';

export class DappDepositDto {
  @IsString()
  @IsNotEmpty()
  @IsAlpha()
  token: string;

  @IsNotEmpty()
  @IsNumberString()
  chainId: (typeof SUPPORTED_CHAIN_IDS)[number];

  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric()
  @IsEthereumTransactionHash()
  txHash: string;
}
