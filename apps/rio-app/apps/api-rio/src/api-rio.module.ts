import { Module } from '@nestjs/common';
import { ApiRioController } from './api-rio.controller';
import { ApiRioService } from './api-rio.service';
import { RewardsModule } from './rewards';
import { ApiRioConfigModule, ApiRioConfigService } from '@rio-app/config';
import { LoggerModule, LoggerService, HealthModule } from '@rio-app/common';

@Module({
  imports: [
    ApiRioConfigModule,
    HealthModule.forRootAsync({
      useFactory: ({ database, redis }) => {
        return {
          database,
          redis,
        };
      },
      inject: [ApiRioConfigService],
    }),
    LoggerModule.forRootAsync({
      useFactory: ({ logger }: ApiRioConfigService) => logger,
      inject: [ApiRioConfigService],
      exports: [LoggerService],
    }),

    RewardsModule,
    HealthModule,
  ],
  controllers: [ApiRioController],
  providers: [ApiRioService],
  exports: [ApiRioService],
})
export class ApiRioModule {}
