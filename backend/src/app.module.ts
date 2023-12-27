import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './user/user.entity';
import { BoardModule } from './board/board.module';
@Module({
    imports: [
        AuthModule,
        UserModule,
        ConfigModule.forRoot({
            envFilePath: ['.development.env'],
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: [User],
            synchronize: true,
        }),
        BoardModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
