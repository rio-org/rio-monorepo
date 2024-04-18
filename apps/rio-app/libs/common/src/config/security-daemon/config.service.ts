import { Injectable } from '@nestjs/common';
import { SharedConfigService } from '../shared';
import { SecurityDaemonServiceConfig } from './config.types';
import { SecurityDaemonCronTask, SecurityDaemonCronTaskName } from '../..';
import { FormatService } from '../../utils';
import { ConfigService } from '@nestjs/config';

/**
 * Convenience service used to access task-sync-db service configuration values
 */
@Injectable()
export class SecurityDaemonConfigService extends SharedConfigService<SecurityDaemonServiceConfig> {
  constructor(
    protected readonly configService: ConfigService,
    protected readonly formatService: FormatService,
  ) {
    super(configService, formatService);
  }

  /**
   * List of available cron tasks
   */
  public get tasks(): SecurityDaemonCronTask[] | undefined {
    return this.configService.get<SecurityDaemonCronTask[]>(
      this._accessor.tasks(),
    );
  }

  /**
   * Gets the properties of the specified cron task
   * @param taskName name of the cron task whose properties to get
   */
  public getTask(
    taskName: SecurityDaemonCronTaskName,
  ): SecurityDaemonCronTask | undefined {
    return this.tasks?.find((task) => task.task === taskName);
  }

  /**
   * Gets the private key for the security daemon
   */
  public get privateKey(): string {
    return this.configService.get<string>(this._accessor.privateKey());
  }

  /**
   * Gets the discord channels for the security daemon
   */
  public get discordLogger(): {
    warn: string;
    error: string;
  } {
    return this.configService.get<{
      warn: string;
      error: string;
    }>(this._accessor.discordLogger());
  }
}
