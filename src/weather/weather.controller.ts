import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get('alerts')
  @UseGuards(AuthGuard('jwt'))
  async getUserAlerts(@Request() req) {
    const alerts = await this.weatherService.getAlertsByUser(req.user._id);
    return alerts;
  }

  @Post('simulate-alert')
  @UseGuards(AuthGuard('jwt'))
  async simulateAlert(@Body() body: { city?: string }, @Request() req) {
    await this.weatherService.simulateWeatherAlert(
      req.user._id,
      body.city || 'London',
    );
    return { message: 'Alert sent successfully' };
  }

  @Get('data/:city')
  @UseGuards(AuthGuard('jwt'))
  async getWeatherData(@Request() req, @param('city') city: string) {
    const data = await this.weatherService.getWeatherData(city);
    return data;
  }
}
