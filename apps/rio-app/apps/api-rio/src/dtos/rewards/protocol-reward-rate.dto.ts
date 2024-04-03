import { IsAlpha, IsNotEmpty, IsString } from 'class-validator';

export class ProtocolRewardRateDto {
  @IsString()
  @IsNotEmpty()
  @IsAlpha()
  token: string;
}
