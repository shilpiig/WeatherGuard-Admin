import { Controller, Get, UseGuards, Req, Res, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Google auth guard initiates the OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req, @Res() res) {
    const user = req.user;
    const token = this.authService.generateJwt(user);
    const userDto = await this.authService.validateUser(user);

    // Redirect to frontend with token
    const frontend_url = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(
      `${frontend_url}/auth/callback?token=${token}&user=${encodeURIComponent(
        JSON.stringify(userDto),
      )}`,
    );
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth(@Req() req) {
    // GitHub auth guard initiates the OAuth flow
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req, @Res() res) {
    const user = req.user;
    const token = this.authService.generateJwt(user);
    const userDto = await this.authService.validateUser(user);

    // Redirect to frontend with token
    const frontend_url = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(
      `${frontend_url}/auth/callback?token=${token}&user=${encodeURIComponent(
        JSON.stringify(userDto),
      )}`,
    );
  }

  @Post('logout')
  async logout(@Res() res) {
    res.clearCookie('jwt');
    return res.json({ message: 'Logged out successfully' });
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getCurrentUser(@Req() req) {
    return this.authService.validateUser(req.user);
  }
}
