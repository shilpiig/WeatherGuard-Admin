"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TelegramService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramService = void 0;
const common_1 = require("@nestjs/common");
const telegraf_1 = require("telegraf");
const users_service_1 = require("../users/users.service");
let TelegramService = TelegramService_1 = class TelegramService {
    usersService;
    bot;
    logger = new common_1.Logger(TelegramService_1.name);
    constructor(usersService) {
        this.usersService = usersService;
        this.bot = new telegraf_1.Telegraf(process.env.TELEGRAM_BOT_TOKEN || '');
        this.initializeBot();
    }
    initializeBot() {
        this.bot.start(async (ctx) => {
            const userId = ctx.from?.id;
            const username = ctx.from?.username || 'User';
            ctx.reply(`Welcome to WeatherGuard! 🌦️\n\nYour Telegram ID: ${userId}\n\nPlease link this account in the WeatherGuard app to receive weather alerts.`);
        });
        this.bot.help((ctx) => {
            ctx.reply(`Available commands:\n/start - Start the bot\n/alerts - View active alerts\n/help - Show this help`);
        });
        this.bot.command('alerts', async (ctx) => {
            const userId = ctx.from?.id;
            ctx.reply('Check the WeatherGuard app for your active alerts.');
        });
    }
    async start() {
        try {
            await this.bot.launch();
            this.logger.log('Telegram bot started successfully');
        }
        catch (error) {
            this.logger.error('Failed to start Telegram bot:', error);
        }
    }
    async sendApprovalMessage(chatId) {
        try {
            await this.bot.telegram.sendMessage(chatId, `✅ Congratulations! Your access to WeatherGuard has been approved.\n\nYou will now receive weather alerts for your selected locations. 🌦️`);
        }
        catch (error) {
            this.logger.error(`Failed to send approval message to ${chatId}:`, error);
        }
    }
    async sendWeatherAlert(chatId, city, alertType, temperature, description) {
        try {
            const message = `⚠️ Weather Alert for ${city}\n\nType: ${alertType}\nTemperature: ${temperature}°C\nDescription: ${description}`;
            await this.bot.telegram.sendMessage(chatId, message);
        }
        catch (error) {
            this.logger.error(`Failed to send weather alert to ${chatId}:`, error);
        }
    }
    async sendRejectionMessage(chatId) {
        try {
            await this.bot.telegram.sendMessage(chatId, `❌ Sorry, your access request to WeatherGuard was not approved at this time.\n\nPlease contact support for more information.`);
        }
        catch (error) {
            this.logger.error(`Failed to send rejection message to ${chatId}:`, error);
        }
    }
    async getUserInfo(userId) {
        try {
            return await this.bot.telegram.getChat(userId);
        }
        catch (error) {
            this.logger.error(`Failed to get user info for ${userId}:`, error);
            return null;
        }
    }
    getBot() {
        return this.bot;
    }
};
exports.TelegramService = TelegramService;
exports.TelegramService = TelegramService = TelegramService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map