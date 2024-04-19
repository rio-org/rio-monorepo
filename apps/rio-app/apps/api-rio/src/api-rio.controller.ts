import { Controller } from '@nestjs/common';
import { ApiRioService } from './api-rio.service';

@Controller()
export class ApiRioController {
  constructor(private apiRioService: ApiRioService) {}
}
