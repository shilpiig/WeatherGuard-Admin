import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserStatus } from '../schemas/user.schema';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOrCreateUser(createUserDto: CreateUserDto): Promise<User> {
    let user = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (!user) {
      user = await this.userModel.create(createUserDto);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id);
  }

  async findByProviderId(providerId: string, provider: string): Promise<User> {
    return this.userModel.findOne({ providerId, provider });
  }

  async getPendingRequests(): Promise<User[]> {
    return this.userModel
      .find({ status: UserStatus.PENDING })
      .sort({ createdAt: -1 });
  }

  async getApprovedUsers(): Promise<User[]> {
    return this.userModel
      .find({ status: UserStatus.APPROVED })
      .sort({ approvedAt: -1 });
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().sort({ createdAt: -1 });
  }

  async approveUser(userId: string, adminId: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      {
        status: UserStatus.APPROVED,
        approvedAt: new Date(),
        approvedBy: adminId,
      },
      { new: true },
    );
  }

  async rejectUser(userId: string, adminId: string): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      {
        status: UserStatus.REJECTED,
        rejectedAt: new Date(),
        rejectedBy: adminId,
      },
      { new: true },
    );
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel.findByIdAndUpdate(userId, updateUserDto, {
      new: true,
    });
  }

  async updateTelegramInfo(
    userId: string,
    telegramChatId: string,
    telegramUsername: string,
  ): Promise<User> {
    return this.userModel.findByIdAndUpdate(
      userId,
      {
        telegramChatId,
        telegramUsername,
      },
      { new: true },
    );
  }

  mapToResponseDto(user: User): UserResponseDto {
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
}
