import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { Board } from './board.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { ConfigModule } from '@nestjs/config';
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.development.env'],
        }),
        TypeOrmModule.forFeature([Board, User]),
    ],
    controllers: [BoardController],
    providers: [BoardService, Repository, UserService],
    exports: [BoardService],
})
export class BoardModule {}
