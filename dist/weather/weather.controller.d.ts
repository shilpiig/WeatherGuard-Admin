import { WeatherService } from './weather.service';
export declare class WeatherController {
    private readonly weatherService;
    constructor(weatherService: WeatherService);
    getUserAlerts(req: any): Promise<import("../schemas/weather-alert.schema").WeatherAlert[]>;
    simulateAlert(body: {
        city?: string;
    }, req: any): Promise<{
        message: string;
    }>;
    getWeatherData(req: any, city: string): Promise<any>;
}
