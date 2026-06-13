import { Injectable } from '@nestjs/common';
import { ListRepository } from './list.repository';
import { CreateListItemDto } from './dto/create-list-item.dto';
import { ListItemResponse } from './list-item.response';

@Injectable()
export class ListService {
    constructor(private listRepository: ListRepository) {}

    async getList(robloxId: string): Promise<ListItemResponse[]> {
        const items = await this.listRepository.getItemsByRobloxId(robloxId);
        return items.map(({ id, text }) => ({ id, text }));
    }

    async addItem(createListItemDto: CreateListItemDto, robloxId: string): Promise<ListItemResponse> {
        const item = await this.listRepository.addItem(createListItemDto.text, robloxId);
        return { id: item.id, text: item.text };
    }

    async removeItem(id: string, robloxId: string): Promise<void> {
        return this.listRepository.removeItem(id, robloxId);
    }
}
