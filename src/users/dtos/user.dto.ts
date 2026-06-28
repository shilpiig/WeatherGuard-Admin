import { IsEmail, IsString, IsOptional, IsArray } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  provider: string;

  @IsString()
  providerId: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  telegramUsername?: string;

  @IsOptional()
  @IsArray()
  cities?: string[];

  @IsOptional()
  @IsArray()
  alertTypes?: string[];
}

export class ApproveUserDto {
  @IsString()
  userId: string;
}

export class UserResponseDto {
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
