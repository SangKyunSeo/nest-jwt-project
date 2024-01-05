import {
    Body,
    Controller,
    Post,
    UseGuards,
    Request,
    Get,
    Query,
    Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BoardService } from './board.service';
import { CreateBoardDTO } from './dto/board.create.dto';
import { BoardDetail } from './dto/board.get.detail.dto';
import { GetBoardListDTO } from './dto/board.get.dto';
import { UpdateBoardDTO } from './dto/board.update.dto';
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

    @UseGuards(AuthGuard('jwt'))
    @Post('/update')
    public async updateBoard(
        @Body('updateBoardDTO') updateBoardDTO: UpdateBoardDTO,
    ) {
        console.log(
            `Board controller request update board = ${updateBoardDTO}`,
        );
        const result = await this.boardService.updateBoard(updateBoardDTO);
        return result;
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/delete')
    public async deleteBoard(@Body('boardNum') boardNum: number) {
        console.log(`Board delete boardNum = ${boardNum}`);
        const result = await this.boardService.deleteBoard(boardNum);
        return result;
    }
}
