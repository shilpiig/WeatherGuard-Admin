import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/user.dto';
import { TelegramService } from '../telegram/telegram.service';
export declare class UsersController {
    private readonly usersService;
    private readonly telegramService;
    constructor(usersService: UsersService, telegramService: TelegramService);
    getPendingRequests(req: any): Promise<import("./dtos/user.dto").UserResponseDto[]>;
    getApprovedUsers(req: any): Promise<import("./dtos/user.dto").UserResponseDto[]>;
    getAllUsers(req: any): Promise<import("./dtos/user.dto").UserResponseDto[]>;
    approveUser(userId: string, req: any): Promise<import("./dtos/user.dto").UserResponseDto>;
    rejectUser(userId: string, req: any): Promise<import("./dtos/user.dto").UserResponseDto>;
    updateUser(updateUserDto: UpdateUserDto, req: any): Promise<import("./dtos/user.dto").UserResponseDto>;
    getProfile(req: any): Promise<import("./dtos/user.dto").UserResponseDto>;
    getUserById(id: string): Promise<import("./dtos/user.dto").UserResponseDto>;
}
