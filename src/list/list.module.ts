import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { ListRepository } from './list.repository';
import { ListItem } from './list-item.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([ListItem]), AuthModule],
    controllers: [ListController],
    providers: [ListService, ListRepository],
})
export class ListModule {}
