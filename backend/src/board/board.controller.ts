import {
    Body,
    Controller,
    Post,
    UseGuards,
    Request,
    Get,
    Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BoardService } from './board.service';
import { CreateBoardDTO } from './dto/board.create.dto';
import { BoardDetail } from './dto/board.get.detail.dto';
import { GetBoardListDTO } from './dto/board.get.dto';
@Controller('api/board')
export class BoardController {
    constructor(private readonly boardService: BoardService) {}

    @UseGuards(AuthGuard('jwt'))
    @Post('/create')
    public async createBoard(
        @Request() req,
        @Body('createBoardDTO') createBoardDTO: CreateBoardDTO,
    ): Promise<boolean> {
        console.log(`Board Controller request board = ${createBoardDTO}`);
        const board = await this.boardService.createBoard(createBoardDTO);
        console.log(`Board Controller resposne board = ${board}`);

        return board === null ? false : true;
    }

    @Get('/list')
    public async getBoardList(): Promise<GetBoardListDTO[]> {
        const boardList = await this.boardService.getBoardList();
        return boardList;
    }

    @Get('/detail')
    public async getBoardDetail(
        @Query('boardNum') boardNum: number,
    ): Promise<BoardDetail> {
        const boardDetail = await this.boardService.getBoardDetail(boardNum);
        return boardDetail;
    }
}
