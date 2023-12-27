import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BoardService } from './board.service';
import { CreateBoardDTO } from './dto/board.create.dto';

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
}
