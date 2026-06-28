import { Telegraf } from 'telegraf';
import { UsersService } from '../users/users.service';
export declare class TelegramService {
    private readonly usersService;
    private bot;
    private readonly logger;
    constructor(usersService: UsersService);
    private initializeBot;
    start(): Promise<void>;
    sendApprovalMessage(chatId: string): Promise<void>;
    sendWeatherAlert(chatId: string, city: string, alertType: string, temperature: number, description: string): Promise<void>;
    sendRejectionMessage(chatId: string): Promise<void>;
    getUserInfo(userId: string): Promise<any>;
    getBot(): Telegraf;
}
