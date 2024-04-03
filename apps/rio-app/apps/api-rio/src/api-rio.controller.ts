import { Controller, Get } from '@nestjs/common';
import { ApiRioService } from './api-rio.service';

@Controller()
export class ApiRioController {
  constructor(private apiRioService: ApiRioService) {}

  @Get()
  getHello(): string {
    console.log('APP SERVICE 1 -->' + this.apiRioService);
    return this.apiRioService.getHello();
  }
}
