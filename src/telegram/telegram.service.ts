import { Injectable, Logger } from '@nestjs/common';
import { Telegraf, Context } from 'telegraf';
import { UsersService } from '../users/users.service';

@Injectable()
export class TelegramService {
  private bot: Telegraf;
  private readonly logger = new Logger(TelegramService.name);

  constructor(private readonly usersService: UsersService) {
    this.bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '');
    this.initializeBot();
  }

  private initializeBot() {
    this.bot.start(async (ctx: Context) => {
      const userId = ctx.from?.id;
      const username = ctx.from?.username || 'User';
      
      ctx.reply(
        `Welcome to WeatherGuard! 🌦️\n\nYour Telegram ID: ${userId}\n\nPlease link this account in the WeatherGuard app to receive weather alerts.`,
      );
    });

    this.bot.help((ctx: Context) => {
      ctx.reply(`Available commands:\n/start - Start the bot\n/alerts - View active alerts\n/help - Show this help`);
    });

    this.bot.command('alerts', async (ctx: Context) => {
      const userId = ctx.from?.id;
      ctx.reply('Check the WeatherGuard app for your active alerts.');
    });
  }

  async start() {
    try {
      await this.bot.launch();
      this.logger.log('Telegram bot started successfully');
    } catch (error) {
      this.logger.error('Failed to start Telegram bot:', error);
    }
  }

  async sendApprovalMessage(chatId: string): Promise<void> {
    try {
      await this.bot.telegram.sendMessage(
        chatId,
        `✅ Congratulations! Your access to WeatherGuard has been approved.\n\nYou will now receive weather alerts for your selected locations. 🌦️`,
      );
    } catch (error) {
      this.logger.error(`Failed to send approval message to ${chatId}:`, error);
    }
  }

  async sendWeatherAlert(
    chatId: string,
    city: string,
    alertType: string,
    temperature: number,
    description: string,
  ): Promise<void> {
    try {
      const message = `⚠️ Weather Alert for ${city}\n\nType: ${alertType}\nTemperature: ${temperature}°C\nDescription: ${description}`;
      await this.bot.telegram.sendMessage(chatId, message);
    } catch (error) {
      this.logger.error(`Failed to send weather alert to ${chatId}:`, error);
    }
  }

  async sendRejectionMessage(chatId: string): Promise<void> {
    try {
      await this.bot.telegram.sendMessage(
        chatId,
        `❌ Sorry, your access request to WeatherGuard was not approved at this time.\n\nPlease contact support for more information.`,
      );
    } catch (error) {
      this.logger.error(`Failed to send rejection message to ${chatId}:`, error);
    }
  }

  async getUserInfo(userId: string): Promise<any> {
    try {
      return await this.bot.telegram.getChat(userId);
    } catch (error) {
      this.logger.error(`Failed to get user info for ${userId}:`, error);
      return null;
    }
  }

  getBot(): Telegraf {
    return this.bot;
  }
}
