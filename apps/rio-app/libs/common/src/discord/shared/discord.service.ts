import { Global, Injectable } from '@nestjs/common';
import {
  Client as DiscordClient,
  Events,
  GatewayIntentBits,
  TextChannel,
} from 'discord.js';
import { LoggerService } from '../../logger';
import { SharedConfig, SharedConfigService } from '../../config';

@Global()
@Injectable()
export class DiscordService {
  public _discord: Promise<DiscordClient>;

  private messageBacklogQueque;

  constructor(
    private readonly logger: LoggerService,
    private readonly config: SharedConfigService<SharedConfig>,
  ) {
    this.logger.setContext(this.constructor.name);

    this._discord = new Promise((resolve, reject) => {
      const client = new DiscordClient({
        intents: [GatewayIntentBits.Guilds],
      });

      try {
        client.once(Events.ClientReady, async (readyClient) => {
          resolve(readyClient);
        });

        client.login(this.config.discord.token);
      } catch (error) {
        this.logger.error('Error starting discord client', error);
        reject(client);
      }
    });
  }

  async getDiscordClient() {
    return this._discord;
  }

  async getTextChannel(channelId: string): Promise<TextChannel> {
    const discord = await this.getDiscordClient();
    return discord.channels.cache.get(channelId) as TextChannel;
  }

  async sendMessage(
    channel: TextChannel,
    options: Parameters<TextChannel['send']>[0],
  ) {
    await channel.send(options);
  }
}
