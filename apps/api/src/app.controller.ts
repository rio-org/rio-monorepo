import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Get()
  getHello(): string {
    console.log('APP SERVICE 1 -->' + this.appService);
    return this.appService.getHello();
  }
}
