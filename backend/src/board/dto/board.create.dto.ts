import { User } from 'src/user/user.entity';

export class CreateBoardDTO {
    boardTitle: string;
    boardContent: string;
    userNum: number;
    boardSecret: number;
    user: User;
}
