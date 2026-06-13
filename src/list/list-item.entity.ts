import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ListItem {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    text!: string;

    @Column()
    robloxId!: string;
}
