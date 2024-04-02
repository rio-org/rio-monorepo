import { Controller, Get } from '@nestjs/common';
import { RewardsService } from './';

@Controller('test')
export class RewardsController {
  constructor(private rewardsService: RewardsService) {
    console.log('dsfsd' + rewardsService);
  }

  @Get('/')
  getHello22ffdsf(): string {
    console.log('hofshfohsdf' + this.rewardsService);
    return this.rewardsService.getHello();
  }
}
