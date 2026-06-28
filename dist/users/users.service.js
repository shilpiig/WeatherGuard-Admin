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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../schemas/user.schema");
let UsersService = class UsersService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async findOrCreateUser(createUserDto) {
        let user = await this.userModel.findOne({
            email: createUserDto.email,
        });
        if (!user) {
            user = await this.userModel.create(createUserDto);
        }
        return user;
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email });
    }
    async findById(id) {
        return this.userModel.findById(id);
    }
    async findByProviderId(providerId, provider) {
        return this.userModel.findOne({ providerId, provider });
    }
    async getPendingRequests() {
        return this.userModel
            .find({ status: user_schema_1.UserStatus.PENDING })
            .sort({ createdAt: -1 });
    }
    async getApprovedUsers() {
        return this.userModel
            .find({ status: user_schema_1.UserStatus.APPROVED })
            .sort({ approvedAt: -1 });
    }
    async getAllUsers() {
        return this.userModel.find().sort({ createdAt: -1 });
    }
    async approveUser(userId, adminId) {
        return this.userModel.findByIdAndUpdate(userId, {
            status: user_schema_1.UserStatus.APPROVED,
            approvedAt: new Date(),
            approvedBy: adminId,
        }, { new: true });
    }
    async rejectUser(userId, adminId) {
        return this.userModel.findByIdAndUpdate(userId, {
            status: user_schema_1.UserStatus.REJECTED,
            rejectedAt: new Date(),
            rejectedBy: adminId,
        }, { new: true });
    }
    async updateUser(userId, updateUserDto) {
        return this.userModel.findByIdAndUpdate(userId, updateUserDto, {
            new: true,
        });
    }
    async updateTelegramInfo(userId, telegramChatId, telegramUsername) {
        return this.userModel.findByIdAndUpdate(userId, {
            telegramChatId,
            telegramUsername,
        }, { new: true });
    }
    mapToResponseDto(user) {
        return {
            id: user._id.toString(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            status: user.status,
            role: user.role,
            profilePicture: user.profilePicture,
            telegramUsername: user.telegramUsername,
            createdAt: user.createdAt,
            approvedAt: user.approvedAt,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map