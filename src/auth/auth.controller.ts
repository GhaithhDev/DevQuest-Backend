import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RobloxAuthDto } from './dto/roblox-auth.dto';
import { Authenticated } from './authenticated.object';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('roblox')
    robloxAuth(@Body() robloxAuthDto: RobloxAuthDto): Promise<Authenticated> {
        return this.authService.robloxAuth(robloxAuthDto);
    }
}
