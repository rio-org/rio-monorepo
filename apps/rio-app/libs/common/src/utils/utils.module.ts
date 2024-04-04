import { Global, Module } from '@nestjs/common';
import {
  CacheKeyService,
  ChainService,
  DateService,
  FormatService,
  NumericService,
  ValidationService,
} from './services';

@Global()
@Module({
  providers: [
    CacheKeyService,
    ChainService,
    DateService,
    FormatService,
    NumericService,
    ValidationService,
  ],
  exports: [
    CacheKeyService,
    ChainService,
    DateService,
    FormatService,
    NumericService,
    ValidationService,
  ],
})
export class UtilsModule {}
