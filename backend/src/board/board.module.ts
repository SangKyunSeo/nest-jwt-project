import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { Board } from './board.entity';
import { Repository } from 'typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Board])],
    controllers: [BoardController],
    providers: [BoardService, Repository],
})
export class BoardModule {}
