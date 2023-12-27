import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from 'typeorm';

@Entity()
export class Board {
    @PrimaryGeneratedColumn({
        name: 'board_num',
    })
    boardNum: number;

    @Column({
        name: 'board_title',
    })
    boardTitle: string;

    @Column({
        name: 'board_content',
    })
    boardContent: string;

    @CreateDateColumn({
        name: 'board_regdate',
        default: () => 'CURRENT_TIMESTAMP',
    })
    boardRegdate: Date;

    @Column({
        name: 'board_mdate',
        nullable: true,
    })
    boardMdate: Date;

    @Column({
        name: 'user_num',
    })
    userNum: number;

    @Column({
        name: 'board_secret',
    })
    boardSecret: number;
}
