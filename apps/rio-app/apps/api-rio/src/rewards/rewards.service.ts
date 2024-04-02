import { Injectable } from '@nestjs/common';

@Injectable()
export class RewardsService {
  getHello(): string {
    return 'Hello World!';
  }
}
