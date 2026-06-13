import { IsString } from 'class-validator';

export class RobloxAuthDto {
    @IsString()
    code!: string;

    @IsString()
    codeVerifier!: string;

    @IsString()
    redirectUri!: string;
}
