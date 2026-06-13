import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class UsersRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async findOrCreateByRobloxId(robloxId: string): Promise<User> {
        let user = await this.findOne({ where: { robloxId } });
        if (!user) {
            user = this.create({ robloxId });
            try {
                await this.save(user);
            } catch (error) {
                throw new InternalServerErrorException();
            }
        }
        return user;
    }
}
