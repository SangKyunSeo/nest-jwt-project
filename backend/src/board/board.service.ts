import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './board.entity';
import { CreateBoardDTO } from './dto/board.create.dto';
import { GetBoardListDTO } from './dto/board.get.dto';
import { UserService } from 'src/user/user.service';
import { BoardDetail } from './dto/board.get.detail.dto';
import { UpdateBoardDTO } from './dto/board.update.dto';
import * as bcrypt from 'bcryptjs';
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

        if (createBoardDTO.boardSecret === 1) {
            createBoardDTO.boardSecretKey = this.keyEcryption(
                createBoardDTO.boardSecretKey,
            );
        }
        const board = await this.boardRepository.save(createBoardDTO);
        console.log(`createBoard board = ${board}`);
        return board;
    }

    // 비밀글 키 암호화
    public keyEcryption(key: string): string {
        const saltRound = 10;
        return bcrypt.hashSync(key, saltRound);
    }

    // 게시글 리스트 조회
    public async getBoardList(): Promise<GetBoardListDTO[]> {
        const boardList: GetBoardListDTO[] = await this.boardRepository
            .createQueryBuilder('b')
            .select([
                'b.boardNum as boardNum',
                'b.boardTitle as boardTitle',
                'b.boardContent as boardContent',
                `date_format(b.boardRegdate, '%Y-%m-%d') AS boardRegdate`,
                `date_format('b.boardMdate', '%Y-%m-%d') AS boardMdate`,
                'u.userName as userName',
                'b.boardSecret as boardSecret',
                'b.boardSecretKey as boardSecretKey',
            ])
            .leftJoin('b.user', 'u')
            .getRawMany();

        console.log(`boardList: ${boardList}`);
        this.setSecretBoard(boardList);
        console.log(
            `board : ${JSON.stringify(boardList[boardList.length - 1])}`,
        );
        return boardList;
    }
    // 비밀글의 경우 값을 전부 null로 변경
    public setSecretBoard(boardList: GetBoardListDTO[]): void {
        for (const e of boardList) {
            if (e.boardSecret === 1) {
                e.boardTitle = null;
                e.boardContent = null;
                e.boardRegdate = null;
                e.boardMdate = null;
                e.user = null;
                e.boardSecretKey = null;
            }
        }
    }

    // 비밀글 비밀번호 비교
    public async keyCheck(boardNum: number, key: string): Promise<boolean> {
        const board = await this.boardRepository.findOneBy({
            boardNum: boardNum,
        });
        console.log(board);
        console.log(`key = ${key} , secretKey = ${board.boardSecretKey}`);
        const check = await bcrypt.compare(key, board.boardSecretKey);
        console.log(check);
        return check;
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

    // 게시글 삭제
    public async deleteBoard(boardNum: number): Promise<boolean> {
        const result = await this.boardRepository.delete(boardNum);
        return result.affected ? true : false;
    }
}
