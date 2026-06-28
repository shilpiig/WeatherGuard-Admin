import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dtos/user.dto';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<User>);
    findOrCreateUser(createUserDto: CreateUserDto): Promise<User>;
    findByEmail(email: string): Promise<User>;
    findById(id: string): Promise<User>;
    findByProviderId(providerId: string, provider: string): Promise<User>;
    getPendingRequests(): Promise<User[]>;
    getApprovedUsers(): Promise<User[]>;
    getAllUsers(): Promise<User[]>;
    approveUser(userId: string, adminId: string): Promise<User>;
    rejectUser(userId: string, adminId: string): Promise<User>;
    updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User>;
    updateTelegramInfo(userId: string, telegramChatId: string, telegramUsername: string): Promise<User>;
    mapToResponseDto(user: User): UserResponseDto;
}
