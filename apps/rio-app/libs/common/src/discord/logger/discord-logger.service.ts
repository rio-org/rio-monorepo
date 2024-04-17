import { Global, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  EmbedBuilder,
  MessageCreateOptions,
  TextChannel,
  bold,
  codeBlock,
} from 'discord.js';
import { DiscordService } from '../shared/discord.service';
import {
  type DiscordLoggerConfig,
  DiscordLoggerProvider,
} from './discord-logger.types';

@Global()
@Injectable()
export class DiscordLoggerService implements OnModuleInit {
  private warnChannel: TextChannel;
  private errorChannel: TextChannel;
  private serviceName: string = '';

  constructor(
    @Inject(DiscordLoggerProvider.DISCORD_LOGGER_CONFIGURATION)
    private readonly discordLoggerConfig: DiscordLoggerConfig,
    private readonly discord: DiscordService,
  ) {}

  register(serviceName: string) {
    this.serviceName = `[${serviceName}]`;
  }

  async getTextChannel(channelId: string): Promise<TextChannel> {
    const discord = await this.discord.getDiscordClient();
    return discord.channels.cache.get(channelId) as TextChannel;
  }

  async sendMessage(channel: TextChannel, message: string) {
    await channel.send(message);
  }

  async onModuleInit() {
    this.warnChannel = await this.discord.getTextChannel(
      this.discordLoggerConfig.warn,
    );
    this.errorChannel = await this.discord.getTextChannel(
      this.discordLoggerConfig.error,
    );
  }

  async sendErrorMessage(title: string, message: string) {
    await this._sendMessage('error', title, message);
  }

  async sendWarningMessage(title: string, message: string) {
    await this._sendMessage('warn', title, message);
  }

  async sendWarningEmbed(
    title: string,
    options: {
      taskName: string;
      description: string;
      chainId?: string | number;
      operatorId?: number;
      operatorRegistry?: string;
      symbol?: string;
      code?: string;
    },
  ) {
    await this._sendOperatorEmbed('warn', title, options);
  }

  async sendErrorEmbed(
    title: string,
    options: {
      taskName: string;
      description: string;
      chainId?: string | number;
      operatorId?: number;
      operatorRegistry?: string;
      symbol?: string;
      code?: string;
    },
  ) {
    await this._sendOperatorEmbed('error', title, options);
  }

  private async _sendMessage(
    type: 'warn' | 'error',
    title: string,
    message: string,
  ) {
    const channel = type === 'warn' ? this.warnChannel : this.errorChannel;
    await this.discord.sendMessage(
      channel,
      `${bold(
        `${this.serviceName ? `${this.serviceName} ` : ''}${title}`,
      )}\n\n${message}`,
    );
  }
  private async _sendEmbed(
    type: 'warn' | 'error',
    embeds: MessageCreateOptions['embeds'],
  ) {
    const channel = type === 'warn' ? this.warnChannel : this.errorChannel;
    await this.discord.sendMessage(channel, { embeds });
  }

  private async _sendOperatorEmbed(
    type: 'warn' | 'error',
    title: string,
    {
      description,
      taskName,
      chainId,
      symbol,
      operatorRegistry,
      operatorId,
      code,
    }: {
      taskName: string;
      description: string;
      chainId?: string | number;
      operatorRegistry?: string;
      operatorId?: number;
      symbol?: string;
      code?: string;
    },
  ) {
    const color = type === 'warn' ? 0xffaa00 : 0xff0000;
    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle(title)
      .setAuthor({ name: this.serviceName })
      .setDescription(description)
      .addFields(
        ...[
          { name: '\u200B', value: '\u200B' },
          { name: 'Task', value: taskName },
          chainId !== undefined && {
            name: 'Chain ID',
            value: chainId.toString(),
            inline: true,
          },
          symbol && {
            name: 'Liquid Restaking Token',
            value: symbol,
            inline: true,
          },
          operatorId !== undefined && {
            name: 'Operator ID',
            value: operatorId.toString(),
            inline: true,
          },
          operatorRegistry && {
            name: 'Operator Registry',
            value: `\`${operatorRegistry}\``,
            inline: true,
          },
          code && { name: 'Details', value: codeBlock(code) },
        ].filter(Boolean),
      )
      .setTimestamp();

    await this._sendEmbed(type, [embed]);
  }
}
