import { JwtService } from '@nestjs/jwt';
import { User } from '../schemas/user.schema';
export declare class AuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    generateJwt(user: User): string;
    validateUser(user: User): Promise<any>;
}
