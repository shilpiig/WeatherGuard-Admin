"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const schedule_1 = require("@nestjs/schedule");
const weather_service_1 = require("./weather.service");
const weather_controller_1 = require("./weather.controller");
const weather_alert_schema_1 = require("../schemas/weather-alert.schema");
const user_schema_1 = require("../schemas/user.schema");
const telegram_module_1 = require("../telegram/telegram.module");
let WeatherModule = class WeatherModule {
};
exports.WeatherModule = WeatherModule;
exports.WeatherModule = WeatherModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: weather_alert_schema_1.WeatherAlert.name, schema: weather_alert_schema_1.WeatherAlertSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
            ]),
            schedule_1.ScheduleModule.forRoot(),
            telegram_module_1.TelegramModule,
        ],
        providers: [weather_service_1.WeatherService],
        controllers: [weather_controller_1.WeatherController],
        exports: [weather_service_1.WeatherService],
    })
], WeatherModule);
//# sourceMappingURL=weather.module.js.map