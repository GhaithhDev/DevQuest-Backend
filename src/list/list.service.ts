import { Injectable } from '@nestjs/common';
import { ListRepository } from './list.repository';
import { CreateListItemDto } from './dto/create-list-item.dto';
import { ListItemResponse } from './list-item.response';
import { ListGateway } from './list.gateway';

@Injectable()
export class ListService {
    constructor(
        private listRepository: ListRepository,
        private listGateway: ListGateway,
    ) {}

    async getList(robloxId: string): Promise<ListItemResponse[]> {
        const items = await this.listRepository.getItemsByRobloxId(robloxId);
        return items.map(({ id, text }) => ({ id, text }));
    }

    async addItem(createListItemDto: CreateListItemDto, robloxId: string): Promise<ListItemResponse> {
        const item = await this.listRepository.addItem(createListItemDto.text, robloxId);
        const response = { id: item.id, text: item.text };
        this.listGateway.emitItemAdded(robloxId, response);
        return response;
    }

    async removeItem(id: string, robloxId: string): Promise<void> {
        await this.listRepository.removeItem(id, robloxId);
        this.listGateway.emitItemRemoved(robloxId, id);
    }
}
