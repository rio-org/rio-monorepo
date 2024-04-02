import { Global, Module } from '@nestjs/common';
import {
  CacheKeyService,
  FormatService,
  NumericService,
  ValidationService,
} from './services';

@Global()
@Module({
  providers: [
    CacheKeyService,
    FormatService,
    NumericService,
    ValidationService,
  ],
  exports: [CacheKeyService, FormatService, NumericService, ValidationService],
})
export class UtilsModule {}
