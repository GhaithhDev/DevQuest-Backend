import { IsString, MinLength } from 'class-validator';

export class CreateListItemDto {
    @IsString()
    @MinLength(1)
    text!: string;
}
