export declare class CreateUserDto {
    email: string;
    firstName: string;
    lastName: string;
    provider: string;
    providerId: string;
    profilePicture?: string;
}
export declare class UpdateUserDto {
    firstName?: string;
    lastName?: string;
    telegramUsername?: string;
    cities?: string[];
    alertTypes?: string[];
}
export declare class ApproveUserDto {
    userId: string;
}
export declare class UserResponseDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    status: string;
    role: string;
    profilePicture?: string;
    telegramUsername?: string;
    createdAt: Date;
    approvedAt?: Date;
}
