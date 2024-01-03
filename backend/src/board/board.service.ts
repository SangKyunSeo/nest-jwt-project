import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './board.entity';
import { CreateBoardDTO } from './dto/board.create.dto';
import { GetBoardListDTO } from './dto/board.get.dto';
import { UserService } from 'src/user/user.service';
import { BoardDetail } from './dto/board.get.detail.dto';
import { UpdateBoardDTO } from './dto/board.update.dto';
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
                'b.boardSecretKey',
            ])
            .leftJoin('b.user', 'u')
            .getMany();
        console.log(
            `board : ${JSON.stringify(boardList[boardList.length - 1])}`,
        );
        return boardList;
    }

    // 게시글 상세 조회
    public async getBoardDetail(boardNum: number): Promise<BoardDetail> {
        const boardDetail: BoardDetail = await this.boardRepository
            .createQueryBuilder('b')
            .where('b.boardNum = :boardNum', { boardNum: boardNum })
            .select([
                'b.boardNum',
                'b.boardTitle',
                'b.boardContent',
                'b.boardRegdate',
                'b.boardMdate',
                'u.userName',
                'u.userNum',
                'b.boardSecret',
                'b.boardSecretKey',
            ])
            .leftJoin('b.user', 'u')
            .getOne();

        return boardDetail;
    }

    // 게시글 수정
    public async updateBoard(updateBoardDTO: UpdateBoardDTO): Promise<boolean> {
        const result = await this.boardRepository.update(
            {
                boardNum: updateBoardDTO.boardNum,
            },
            {
                boardTitle: updateBoardDTO.boardTitle,
                boardContent: updateBoardDTO.boardContent,
                boardMdate: new Date(),
                boardSecret: updateBoardDTO.boardSecret,
                boardSecretKey: updateBoardDTO.boardSecretKey,
            },
        );

        return result.affected ? true : false;
    }
}
