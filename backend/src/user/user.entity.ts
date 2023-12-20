import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn({
        name: 'user_num',
    })
    userNum: number;

    @Column({
        name: 'user_id',
    })
    userId: string;

    @Column({
        name: 'user_pw',
    })
    userPw: string;

    @Column({
        name: 'user_name',
    })
    userName: string;

    @CreateDateColumn({
        name: 'user_regdate',
        default: () => 'CURRENT_TIMESTAMP',
    })
    userRegdate: Date;
}
