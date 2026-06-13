import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import { UsersRepository } from './users.repository';
import { Authenticated } from './authenticated.object';
import { JwtPayload } from './jwt.payload.object';
import { RobloxAuthDto } from './dto/roblox-auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersRepository: UsersRepository,
        private jwtService: JwtService,
        private httpService: HttpService,
        private configService: ConfigService,
    ) {}

    async robloxAuth(robloxAuthDto: RobloxAuthDto): Promise<Authenticated> {
        const robloxId = await this.getRobloxId(robloxAuthDto);
        await this.usersRepository.findOrCreateByRobloxId(robloxId);
        return {
            robloxId,
            accessToken: await this.getAccessToken(robloxId),
        };
    }

    private async getRobloxId(robloxAuthDto: RobloxAuthDto): Promise<string> {
        const { code, codeVerifier, redirectUri } = robloxAuthDto;

        try {
            const tokenResponse = await firstValueFrom(
                this.httpService.post(
                    'https://apis.roblox.com/oauth/v1/token',
                    new URLSearchParams({
                        grant_type: 'authorization_code',
                        code,
                        code_verifier: codeVerifier,
                        redirect_uri: redirectUri,
                        client_id: this.configService.getOrThrow('ROBLOX_CLIENT_ID'),
                        client_secret: this.configService.getOrThrow('ROBLOX_CLIENT_SECRET'),
                    }),
                    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
                ),
            );

            const accessToken = tokenResponse.data.access_token;

            const userInfoResponse = await firstValueFrom(
                this.httpService.get('https://apis.roblox.com/oauth/v1/userinfo', {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }),
            );

            return String(userInfoResponse.data.sub);
        } catch {
            throw new UnauthorizedException('Roblox authentication failed');
        }
    }

    private async getAccessToken(robloxId: string): Promise<string> {
        const payload: JwtPayload = { robloxId };
        return this.jwtService.sign(payload);
    }
}
