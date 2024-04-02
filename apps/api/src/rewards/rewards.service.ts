import { Injectable } from '@nestjs/common';

@Injectable()
export class RewardsService {
  getHello(): string {
    console.log('heee');
    return 'Hello World!';
  }
}
