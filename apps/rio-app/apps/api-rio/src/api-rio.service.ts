import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiRioService {
  getHello(): string {
    return 'Hello World!';
  }
}
