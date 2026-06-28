import { Model } from 'mongoose';
import { WeatherAlert } from '../schemas/weather-alert.schema';
import { User } from '../schemas/user.schema';
import { TelegramService } from '../telegram/telegram.service';
export declare class WeatherService {
    private weatherAlertModel;
    private userModel;
    private readonly telegramService;
    private readonly logger;
    constructor(weatherAlertModel: Model<WeatherAlert>, userModel: Model<User>, telegramService: TelegramService);
    createWeatherAlert(userId: string, city: string, alertType: string, temperature: number, description: string): Promise<WeatherAlert>;
    getAlertsByUser(userId: string): Promise<WeatherAlert[]>;
    sendPendingAlerts(): Promise<void>;
    checkWeatherAndAlert(): Promise<void>;
    getWeatherData(city: string): Promise<any>;
    private calculateSeverity;
    simulateWeatherAlert(userId: string, city?: string): Promise<void>;
}
