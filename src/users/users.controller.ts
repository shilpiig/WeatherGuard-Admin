import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { ApproveUserDto, UpdateUserDto } from './dtos/user.dto';
import { User, UserRole } from '../schemas/user.schema';
import { TelegramService } from '../telegram/telegram.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly telegramService: TelegramService,
  ) {}

  @Get('pending')
  @UseGuards(AuthGuard('jwt'))
  async getPendingRequests(@Request() req) {
    const admin = req.user;
    if (admin.role !== UserRole.ADMIN) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const users = await this.usersService.getPendingRequests();
    return users.map((u) => this.usersService.mapToResponseDto(u));
  }

  @Get('approved')
  @UseGuards(AuthGuard('jwt'))
  async getApprovedUsers(@Request() req) {
    const admin = req.user;
    if (admin.role !== UserRole.ADMIN) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const users = await this.usersService.getApprovedUsers();
    return users.map((u) => this.usersService.mapToResponseDto(u));
  }

  @Get('all')
  @UseGuards(AuthGuard('jwt'))
  async getAllUsers(@Request() req) {
    const admin = req.user;
    if (admin.role !== UserRole.ADMIN) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    const users = await this.usersService.getAllUsers();
    return users.map((u) => this.usersService.mapToResponseDto(u));
  }

  @Post('approve/:userId')
  @UseGuards(AuthGuard('jwt'))
  async approveUser(@Param('userId') userId: string, @Request() req) {
    const admin = req.user;
    if (admin.role !== UserRole.ADMIN) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const user = await this.usersService.approveUser(userId, admin._id);
    
    // Send Telegram approval message
    if (user.telegramChatId) {
      await this.telegramService.sendApprovalMessage(user.telegramChatId);
    }

    return this.usersService.mapToResponseDto(user);
  }

  @Post('reject/:userId')
  @UseGuards(AuthGuard('jwt'))
  async rejectUser(@Param('userId') userId: string, @Request() req) {
    const admin = req.user;
    if (admin.role !== UserRole.ADMIN) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const user = await this.usersService.rejectUser(userId, admin._id);
    
    // Send Telegram rejection message
    if (user.telegramChatId) {
      await this.telegramService.sendRejectionMessage(user.telegramChatId);
    }

    return this.usersService.mapToResponseDto(user);
  }

  @Post('update')
  @UseGuards(AuthGuard('jwt'))
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    const user = await this.usersService.updateUser(req.user._id, updateUserDto);
    return this.usersService.mapToResponseDto(user);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req) {
    return this.usersService.mapToResponseDto(req.user);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return this.usersService.mapToResponseDto(user);
  }
}
