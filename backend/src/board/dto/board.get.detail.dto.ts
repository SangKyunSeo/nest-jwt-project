import { User } from 'src/user/user.entity';
export class BoardDetail {
    boardNum: number;
    boardTitle: string;
    boardContent: string;
    boardRegdate: Date;
    boardMdate: Date;
    user: User;
    boardSecret: number;
    boardSecretKey: string;
}
