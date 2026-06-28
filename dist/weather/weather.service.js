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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var WeatherService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const schedule_1 = require("@nestjs/schedule");
const weather_alert_schema_1 = require("../schemas/weather-alert.schema");
const user_schema_1 = require("../schemas/user.schema");
const telegram_service_1 = require("../telegram/telegram.service");
const axios_1 = __importDefault(require("axios"));
let WeatherService = WeatherService_1 = class WeatherService {
    weatherAlertModel;
    userModel;
    telegramService;
    logger = new common_1.Logger(WeatherService_1.name);
    constructor(weatherAlertModel, userModel, telegramService) {
        this.weatherAlertModel = weatherAlertModel;
        this.userModel = userModel;
        this.telegramService = telegramService;
    }
    async createWeatherAlert(userId, city, alertType, temperature, description) {
        const alert = await this.weatherAlertModel.create({
            userId,
            city,
            alertType,
            temperature,
            description,
            severity: this.calculateSeverity(temperature, alertType),
        });
        return alert;
    }
    async getAlertsByUser(userId) {
        return this.weatherAlertModel.find({ userId, active: true });
    }
    async sendPendingAlerts() {
        try {
            const pendingAlerts = await this.weatherAlertModel.find({ sent: false, active: true });
            for (const alert of pendingAlerts) {
                const user = await this.userModel.findById(alert.userId);
                if (user &&
                    user.status === user_schema_1.UserStatus.APPROVED &&
                    user.receiveAlerts &&
                    user.telegramChatId) {
                    await this.telegramService.sendWeatherAlert(user.telegramChatId, alert.city, alert.alertType, alert.temperature, alert.description);
                    await this.weatherAlertModel.updateOne({ _id: alert._id }, {
                        sent: true,
                        sentAt: new Date(),
                    });
                }
            }
        }
        catch (error) {
            this.logger.error('Error sending weather alerts:', error);
        }
    }
    async checkWeatherAndAlert() {
        this.logger.log('Checking weather and sending alerts...');
        await this.sendPendingAlerts();
    }
    async getWeatherData(city) {
        try {
            const apiKey = process.env.OPENWEATHER_API_KEY;
            if (!apiKey) {
                this.logger.warn('OpenWeather API key not configured');
                return null;
            }
            const response = await axios_1.default.get(`https://api.openweathermap.org/data/2.5/weather`, {
                params: {
                    q: city,
                    appid: apiKey,
                    units: 'metric',
                },
            });
            return response.data;
        }
        catch (error) {
            this.logger.error(`Error fetching weather for ${city}:`, error);
            return null;
        }
    }
    calculateSeverity(temperature, alertType) {
        if (alertType === 'extreme' || temperature < -10 || temperature > 40) {
            return 'high';
        }
        if (temperature < 0 || temperature > 35) {
            return 'medium';
        }
        return 'low';
    }
    async simulateWeatherAlert(userId, city = 'London') {
        const user = await this.userModel.findById(userId);
        if (user && user.telegramChatId) {
            await this.telegramService.sendWeatherAlert(user.telegramChatId, city, 'Heavy Rain', 12, 'Heavy rainfall expected in the next 2 hours');
        }
    }
};
exports.WeatherService = WeatherService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_30_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WeatherService.prototype, "checkWeatherAndAlert", null);
exports.WeatherService = WeatherService = WeatherService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(weather_alert_schema_1.WeatherAlert.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        telegram_service_1.TelegramService])
], WeatherService);
//# sourceMappingURL=weather.service.js.map