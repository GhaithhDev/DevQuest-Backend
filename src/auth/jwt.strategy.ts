import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from "./users.repository";
import { JwtPayload } from "./jwt.payload.object";
import { User } from "./user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private usersRepository: UsersRepository,
        configService: ConfigService,
    ) {
        super({
            secretOrKey: configService.getOrThrow('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { robloxId } = payload;
        const user: User | null = await this.usersRepository.findOne({
            where: { robloxId }
        });
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}