import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WeatherAlert } from '../schemas/weather-alert.schema';
import { User, UserStatus } from '../schemas/user.schema';
import { TelegramService } from '../telegram/telegram.service';
import axios from 'axios';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  constructor(
    @InjectModel(WeatherAlert.name) private weatherAlertModel: Model<WeatherAlert>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly telegramService: TelegramService,
  ) {}

  async createWeatherAlert(userId: string, city: string, alertType: string, temperature: number, description: string): Promise<WeatherAlert> {
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

  async getAlertsByUser(userId: string): Promise<WeatherAlert[]> {
    return this.weatherAlertModel.find({ userId, active: true });
  }

  async sendPendingAlerts(): Promise<void> {
    try {
      const pendingAlerts = await this.weatherAlertModel.find({ sent: false, active: true });

      for (const alert of pendingAlerts) {
        const user = await this.userModel.findById(alert.userId);

        if (
          user &&
          user.status === UserStatus.APPROVED &&
          user.receiveAlerts &&
          user.telegramChatId
        ) {
          await this.telegramService.sendWeatherAlert(
            user.telegramChatId,
            alert.city,
            alert.alertType,
            alert.temperature,
            alert.description,
          );

          await this.weatherAlertModel.updateOne(
            { _id: alert._id },
            {
              sent: true,
              sentAt: new Date(),
            },
          );
        }
      }
    } catch (error) {
      this.logger.error('Error sending weather alerts:', error);
    }
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async checkWeatherAndAlert(): Promise<void> {
    this.logger.log('Checking weather and sending alerts...');
    await this.sendPendingAlerts();
  }

  async getWeatherData(city: string): Promise<any> {
    try {
      // Using Open Weather Map API (free tier)
      const apiKey = process.env.OPENWEATHER_API_KEY;
      if (!apiKey) {
        this.logger.warn('OpenWeather API key not configured');
        return null;
      }

      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          q: city,
          appid: apiKey,
          units: 'metric',
        },
      });

      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching weather for ${city}:`, error);
      return null;
    }
  }

  private calculateSeverity(temperature: number, alertType: string): string {
    if (alertType === 'extreme' || temperature < -10 || temperature > 40) {
      return 'high';
    }
    if (temperature < 0 || temperature > 35) {
      return 'medium';
    }
    return 'low';
  }

  async simulateWeatherAlert(userId: string, city: string = 'London'): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (user && user.telegramChatId) {
      await this.telegramService.sendWeatherAlert(
        user.telegramChatId,
        city,
        'Heavy Rain',
        12,
        'Heavy rainfall expected in the next 2 hours',
      );
    }
  }
}
