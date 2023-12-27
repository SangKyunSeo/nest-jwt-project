import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './board.entity';
import { CreateBoardDTO } from './dto/board.create.dto';
@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(Board)
        private readonly boardRepository: Repository<Board>,
    ) {}

    // 글쓰기
    public async createBoard(createBoardDTO: CreateBoardDTO): Promise<Board> {
        console.log(`CreateBoard createBoardDTO : ${createBoardDTO}`);

        const board = await this.boardRepository.save(createBoardDTO);

        console.log(`createBoard board = ${board}`);
        return board;
    }
}
