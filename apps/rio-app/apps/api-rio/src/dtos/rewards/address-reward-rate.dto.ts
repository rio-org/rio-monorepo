import {
  IsNotEmpty,
  IsString,
  IsEthereumAddress,
  IsAlphanumeric,
} from 'class-validator';
import { ProtocolRewardRateDto } from './protocol-reward-rate.dto';

export class AddressRewardRateDto extends ProtocolRewardRateDto {
  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric()
  @IsEthereumAddress()
  address: string;
}
