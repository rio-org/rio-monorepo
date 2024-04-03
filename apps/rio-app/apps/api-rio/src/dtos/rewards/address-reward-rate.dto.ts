import {
  IsAlpha,
  IsNotEmpty,
  IsString,
  IsEthereumAddress,
} from 'class-validator';
import { ProtocolRewardRateDto } from './protocol-reward-rate.dto';

export class AddressRewardRateDto extends ProtocolRewardRateDto {
  @IsString()
  @IsNotEmpty()
  @IsAlpha()
  @IsEthereumAddress()
  address: string;
}
