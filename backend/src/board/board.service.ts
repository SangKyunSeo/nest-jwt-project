import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './board.entity';
import { CreateBoardDTO } from './dto/board.create.dto';
import { GetBoardListDTO } from './dto/board.get.dto';
import { UserService } from 'src/user/user.service';
@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(Board)
        private readonly boardRepository: Repository<Board>,
        private readonly userService: UserService,
    ) {}

    // 글쓰기
    public async createBoard(createBoardDTO: CreateBoardDTO): Promise<Board> {
        console.log(`CreateBoard createBoardDTO : ${createBoardDTO}`);
        const user = await this.userService.getUserByNum(
            createBoardDTO.userNum,
        );
        createBoardDTO.user = user;
        const board = await this.boardRepository.save(createBoardDTO);
        console.log(`createBoard board = ${board}`);
        return board;
    }

    // 게시글 리스트 조회
    public async getBoardList(): Promise<GetBoardListDTO[]> {
        const boardList: GetBoardListDTO[] = await this.boardRepository
            .createQueryBuilder('b')
            .select([
                'b.boardNum',
                'b.boardTitle',
                'b.boardContent',
                'b.boardRegdate',
                'b.boardMdate',
                'u.userName',
                'b.boardSecret',
            ])
            .leftJoin('b.user', 'u')
            .getMany();
        console.log(
            `board : ${JSON.stringify(boardList[boardList.length - 1])}`,
        );
        return boardList;
    }
}
