import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userNum: number;

    @Column()
    userId: string;

    @Column()
    userPw: string;

    @Column()
    userName: string;

    @CreateDateColumn()
    userRegdate: Date;
}
