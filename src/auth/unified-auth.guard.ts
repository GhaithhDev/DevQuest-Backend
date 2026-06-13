import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { UsersRepository } from './users.repository';

@Injectable()
export class UnifiedAuthGuard implements CanActivate {
    constructor(
        private configService: ConfigService,
        private usersRepository: UsersRepository,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const gameSecret = request.headers['x-game-secret'];

        if (gameSecret) {
            if (gameSecret !== this.configService.get('ROBLOX_GAME_SECRET')) {
                throw new UnauthorizedException('Invalid game secret');
            }
            const robloxId = request.body.robloxId ?? request.params.robloxId;
            if (!robloxId) {
                throw new UnauthorizedException('robloxId is required');
            }
            request.user = await this.usersRepository.findOrCreateByRobloxId(String(robloxId));
            return true;
        }

        return new (AuthGuard('jwt'))().canActivate(context) as Promise<boolean>;
    }
}
