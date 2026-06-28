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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherAlertSchema = exports.WeatherAlert = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let WeatherAlert = class WeatherAlert extends mongoose_2.Document {
    userId;
    city;
    alertType;
    temperature;
    description;
    severity;
    sent;
    sentAt;
    telegramMessageId;
    active;
};
exports.WeatherAlert = WeatherAlert;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], WeatherAlert.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], WeatherAlert.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], WeatherAlert.prototype, "alertType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], WeatherAlert.prototype, "temperature", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], WeatherAlert.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], WeatherAlert.prototype, "severity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], WeatherAlert.prototype, "sent", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], WeatherAlert.prototype, "sentAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], WeatherAlert.prototype, "telegramMessageId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], WeatherAlert.prototype, "active", void 0);
exports.WeatherAlert = WeatherAlert = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], WeatherAlert);
exports.WeatherAlertSchema = mongoose_1.SchemaFactory.createForClass(WeatherAlert);
exports.WeatherAlertSchema.index({ userId: 1 });
exports.WeatherAlertSchema.index({ city: 1 });
exports.WeatherAlertSchema.index({ sent: 1 });
//# sourceMappingURL=weather-alert.schema.js.map