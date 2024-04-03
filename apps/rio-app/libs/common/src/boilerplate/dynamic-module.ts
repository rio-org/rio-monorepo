import { DynamicModule, Provider, Type } from '@nestjs/common';
import { get } from 'lodash';
import {
  AsyncDynamicModuleOptions,
  AsyncModuleOptions,
  DynamicModuleOptions,
  IDynamicFeatureModule,
  IDynamicRootModule,
  InjectionToken,
  ModuleOptionsFactory,
  ModuleProperties,
} from '../';

/**
 * Create a provider that populates the module options
 * @param provide The module options provider token
 * @param options The async module options
 */
export function createModuleOptionsProvider<O>(
  provide: InjectionToken,
  options: AsyncModuleOptions<O>,
): Provider[] {
  if (options.useFactory) {
    return [
      {
        provide,
        useFactory: options.useFactory,
        inject: options.inject || [],
      },
    ];
  }

  const optionsProvider = {
    provide,
    useFactory: async (moduleOptionsFactory: ModuleOptionsFactory<O>) => {
      return moduleOptionsFactory.createModuleOptions();
    },
    inject: [
      options.useClass ||
        get(
          options,
          'useExisting.provide',
          (options.useExisting as any).value.constructor.name,
        ),
    ],
  };

  if (options.useClass) {
    return [
      optionsProvider,
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }
  if (options.useExisting) {
    return [
      optionsProvider,
      {
        provide:
          options.useExisting.provide ||
          options.useExisting.value.constructor.name,
        useValue: options.useExisting.value,
      },
    ];
  }
  return [];
}

/**
 * Build an async dynamic module
 * @param options The async module options
 */
function createAsyncDynamicModule<O>(
  options: AsyncDynamicModuleOptions<O>,
): DynamicModule {
  const { asyncModuleOptions, moduleProperties, moduleOptionsToken, context } =
    options;
  return {
    module: context as Type<any>,
    imports: [
      ...(asyncModuleOptions.imports || []),
      ...(moduleProperties.imports || []),
    ],
    exports: [
      ...(asyncModuleOptions.exports || []),
      ...(moduleProperties.exports || []),
    ],
    controllers: [...(moduleProperties.controllers || [])],
    providers: [
      ...createModuleOptionsProvider(moduleOptionsToken, asyncModuleOptions),
      ...(moduleProperties.providers || []),
    ],
  };
}

/**
 * Build a dynamic module
 * @param options The module options
 */
function createDynamicModule<O>(
  options: DynamicModuleOptions<O>,
): DynamicModule {
  const { moduleProperties, moduleOptionsToken, moduleOptions, context } =
    options;
  return {
    module: context as Type<any>,
    imports: [...(moduleProperties.imports || [])],
    exports: [...(moduleProperties.exports || [])],
    controllers: [...(moduleProperties.controllers || [])],
    providers: [
      {
        provide: moduleOptionsToken,
        useValue: moduleOptions,
      },
      ...(moduleProperties.providers || []),
    ],
  };
}

/**
 * A helper method used to register a global dynamic module
 * @param moduleOptionsToken The module options provider token
 * @param moduleProperties Module imports, exports, providers, or controllers
 */
export function createDynamicRootModule<O>(
  moduleOptionsToken: InjectionToken,
  moduleProperties: ModuleProperties = {
    imports: [],
    exports: [],
    providers: [],
  },
): IDynamicRootModule<O> {
  abstract class DynamicRootModule {
    static forRootAsync(
      asyncModuleOptions: AsyncModuleOptions<O>,
    ): DynamicModule {
      return createAsyncDynamicModule({
        moduleOptionsToken,
        moduleProperties,
        asyncModuleOptions,
        context: this,
      });
    }

    static forRoot(moduleOptions: O): DynamicModule {
      return createDynamicModule({
        moduleOptionsToken,
        moduleProperties,
        moduleOptions,
        context: this,
      });
    }
  }

  return DynamicRootModule as IDynamicRootModule<O>;
}

/**
 * A helper method used to register a non-global dynamic module
 * @param moduleOptionsToken The module options provider token
 * @param moduleProperties Module imports, exports, providers, or controllers
 */
export function createDynamicFeatureModule<O>(
  moduleOptionsToken: InjectionToken,
  moduleProperties: ModuleProperties = {
    imports: [],
    exports: [],
    providers: [],
  },
): IDynamicFeatureModule<O> {
  abstract class DynamicFeatureModule {
    static registerAsync(
      asyncModuleOptions: AsyncModuleOptions<O>,
    ): DynamicModule {
      return createAsyncDynamicModule({
        moduleOptionsToken,
        moduleProperties,
        asyncModuleOptions,
        context: this,
      });
    }

    static register(moduleOptions: O): DynamicModule {
      return createDynamicModule({
        moduleOptionsToken,
        moduleProperties,
        moduleOptions,
        context: this,
      });
    }
  }

  return DynamicFeatureModule as IDynamicFeatureModule<O>;
}
