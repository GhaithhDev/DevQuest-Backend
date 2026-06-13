import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ListItem } from './list-item.entity';

@Injectable()
export class ListRepository extends Repository<ListItem> {
    constructor(private dataSource: DataSource) {
        super(ListItem, dataSource.createEntityManager());
    }

    async getItemsByRobloxId(robloxId: string): Promise<ListItem[]> {
        return this.find({ where: { robloxId } });
    }

    async addItem(text: string, robloxId: string): Promise<ListItem> {
        const item = this.create({ text, robloxId });
        try {
            return await this.save(item);
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async removeItem(id: string, robloxId: string): Promise<void> {
        await this.delete({ id, robloxId });
    }
}
