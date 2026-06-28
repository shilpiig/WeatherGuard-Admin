import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
export declare class AuthController {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    googleAuth(req: any): Promise<void>;
    googleCallback(req: any, res: any): Promise<void>;
    githubAuth(req: any): Promise<void>;
    githubCallback(req: any, res: any): Promise<void>;
    logout(res: any): Promise<any>;
    getCurrentUser(req: any): Promise<any>;
}
