import { User } from 'src/user/user.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
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

    // @Column({
    //     name: 'user_num',
    // })
    // userNum: number;

    @Column({
        name: 'board_secret',
    })
    boardSecret: number;

    @Column({
        name: 'board_secret_key',
        nullable: true,
    })
    boardSecretKey: string;

    @ManyToOne(() => User, (user) => user.boards)
    user: User;
}
