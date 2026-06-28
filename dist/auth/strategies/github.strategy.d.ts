import { VerifyCallback } from 'passport-github2';
import { UsersService } from '../users/users.service';
declare const GithubStrategy_base: new (...args: any) => any;
export declare class GithubStrategy extends GithubStrategy_base {
    private readonly usersService;
    constructor(usersService: UsersService);
    validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any>;
}
export {};
