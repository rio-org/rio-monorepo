import { DynamicModule, ModuleMetadata, Type } from '@nestjs/common/interfaces';

//#region Boilerplate

export type ModuleProperties = Partial<
  Pick<ModuleMetadata, 'imports' | 'exports' | 'providers' | 'controllers'>
>;

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
  useFactory?: (..._args: any[]) => Promise<O> | O;
  inject?: any[];
}

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

export interface IDynamicRootModule<O> {
  new (): Type<any>;
  forRoot(_moduleOptions: O): DynamicModule;
  forRootAsync(_asyncModuleOptions: AsyncModuleOptions<O>): DynamicModule;
}

export interface IDynamicFeatureModule<O> {
  new (): Type<any>;
  register(_moduleOptions: O): DynamicModule;
  registerAsync(_asyncModuleOptions: AsyncModuleOptions<O>): DynamicModule;
}
