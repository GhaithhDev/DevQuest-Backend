import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListItemDto } from './dto/create-list-item.dto';
import { ListItemResponse } from './list-item.response';
import { UnifiedAuthGuard } from 'src/auth/unified-auth.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('list')
@UseGuards(UnifiedAuthGuard)
export class ListController {
    constructor(private listService: ListService) {}

    @Get()
    getList(@GetUser() user: User): Promise<ListItemResponse[]> {
        return this.listService.getList(user.robloxId);
    }

    @Post()
    addItem(
        @Body() createListItemDto: CreateListItemDto,
        @GetUser() user: User,
    ): Promise<ListItemResponse> {
        return this.listService.addItem(createListItemDto, user.robloxId);
    }

    @Delete(':id')
    removeItem(@Param('id') id: string, @GetUser() user: User): Promise<void> {
        return this.listService.removeItem(id, user.robloxId);
    }
}
