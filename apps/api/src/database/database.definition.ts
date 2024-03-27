import { ConfigurableModuleBuilder } from '@nestjs/common';
import { SharedConfigAdapter } from '@/config/shared-config.adapter';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<SharedConfigAdapter>()
  .setExtras({ tag: 'default' }, (definition, extras) => ({
    ...definition,
    tag: extras.tag,
  }))
  .build();
