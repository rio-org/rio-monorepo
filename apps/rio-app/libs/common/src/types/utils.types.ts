import BigNumber from 'bignumber.js';
import { DynamicModule, ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { Redis } from '@svtslv/nestjs-ioredis';
import { CacheKeyService } from '../';

//#region Boilerplate

export type ModuleProperties = Partial<
  Pick<ModuleMetadata, 'imports' | 'exports' | 'providers' | 'controllers'>
>;

/* eslint-disable @typescript-eslint/ban-types */
export interface AsyncDynamicModuleOptions<O> {
  moduleOptionsToken: InjectionToken;
  moduleProperties: ModuleProperties;
  asyncModuleOptions: AsyncModuleOptions<O>;
  context: Function;
}

export interface DynamicModuleOptions<O> {
  moduleOptionsToken: InjectionToken;
  moduleProperties: ModuleProperties;
  moduleOptions: O;
  context: Function;
}

/* eslint-enable @typescript-eslint/ban-types */

export type InjectionToken = string | symbol | Type<any>;

export interface ModuleOptionsFactory<O> {
  createModuleOptions(): Promise<O> | O;
}

export interface AsyncModuleOptions<O>
  extends Pick<ModuleMetadata, 'imports' | 'exports'> {
  useExisting?: {
    value: ModuleOptionsFactory<O>;
    provide?: InjectionToken;
  };
  useClass?: Type<ModuleOptionsFactory<O>>;
  useFactory?: (...args: any[]) => Promise<O> | O;
  inject?: any[];
}

export interface IDynamicRootModule<O> {
  new (): Type<any>;

  forRoot(moduleOptions: O): DynamicModule;

  forRootAsync(asyncModuleOptions: AsyncModuleOptions<O>): DynamicModule;
}

export interface IDynamicFeatureModule<O> {
  new (): Type<any>;

  register(moduleOptions: O): DynamicModule;

  registerAsync(asyncModuleOptions: AsyncModuleOptions<O>): DynamicModule;
}

export interface FromBlockFetchConfig {
  redis: Redis;
  cacheKey: CacheKeyService;
  lastEventHeightKey: string;
  deployedBlock?: number;
  startBlock?: number;
}

//#endregion

//#region Services

/**
 * A recursive type used by the 'deepDotKey' format method
 */
export type DeepDotKey<T> = {
  [P in keyof T]: DeepDotKey<T[P]>;
} & (() => string);

export interface ExpirationObserverParams {
  key: string;
  expirationTimeSeconds: BigNumber;
}

//#endregion
