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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const users_service_1 = require("./users.service");
const user_dto_1 = require("./dtos/user.dto");
const user_schema_1 = require("../schemas/user.schema");
const telegram_service_1 = require("../telegram/telegram.service");
let UsersController = class UsersController {
    usersService;
    telegramService;
    constructor(usersService, telegramService) {
        this.usersService = usersService;
        this.telegramService = telegramService;
    }
    async getPendingRequests(req) {
        const admin = req.user;
        if (admin.role !== user_schema_1.UserRole.ADMIN) {
            throw new common_1.HttpException('Forbidden', common_1.HttpStatus.FORBIDDEN);
        }
        const users = await this.usersService.getPendingRequests();
        return users.map((u) => this.usersService.mapToResponseDto(u));
    }
    async getApprovedUsers(req) {
        const admin = req.user;
        if (admin.role !== user_schema_1.UserRole.ADMIN) {
            throw new common_1.HttpException('Forbidden', common_1.HttpStatus.FORBIDDEN);
        }
        const users = await this.usersService.getApprovedUsers();
        return users.map((u) => this.usersService.mapToResponseDto(u));
    }
    async getAllUsers(req) {
        const admin = req.user;
        if (admin.role !== user_schema_1.UserRole.ADMIN) {
            throw new common_1.HttpException('Forbidden', common_1.HttpStatus.FORBIDDEN);
        }
        const users = await this.usersService.getAllUsers();
        return users.map((u) => this.usersService.mapToResponseDto(u));
    }
    async approveUser(userId, req) {
        const admin = req.user;
        if (admin.role !== user_schema_1.UserRole.ADMIN) {
            throw new common_1.HttpException('Forbidden', common_1.HttpStatus.FORBIDDEN);
        }
        const user = await this.usersService.approveUser(userId, admin._id);
        if (user.telegramChatId) {
            await this.telegramService.sendApprovalMessage(user.telegramChatId);
        }
        return this.usersService.mapToResponseDto(user);
    }
    async rejectUser(userId, req) {
        const admin = req.user;
        if (admin.role !== user_schema_1.UserRole.ADMIN) {
            throw new common_1.HttpException('Forbidden', common_1.HttpStatus.FORBIDDEN);
        }
        const user = await this.usersService.rejectUser(userId, admin._id);
        if (user.telegramChatId) {
            await this.telegramService.sendRejectionMessage(user.telegramChatId);
        }
        return this.usersService.mapToResponseDto(user);
    }
    async updateUser(updateUserDto, req) {
        const user = await this.usersService.updateUser(req.user._id, updateUserDto);
        return this.usersService.mapToResponseDto(user);
    }
    async getProfile(req) {
        return this.usersService.mapToResponseDto(req.user);
    }
    async getUserById(id) {
        const user = await this.usersService.findById(id);
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        return this.usersService.mapToResponseDto(user);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('pending'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getPendingRequests", null);
__decorate([
    (0, common_1.Get)('approved'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getApprovedUsers", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Post)('approve/:userId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "approveUser", null);
__decorate([
    (0, common_1.Post)('reject/:userId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "rejectUser", null);
__decorate([
    (0, common_1.Post)('update'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserById", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        telegram_service_1.TelegramService])
], UsersController);
//# sourceMappingURL=users.controller.js.map