import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { Repository } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtRefreshStrategy } from './jwt/jwt-refresh.strategy';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.development.env'],
        }),
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: { expiresIn: process.env.JWT_ACCESS_EXP },
        }),
        forwardRef(() => UserModule),
    ],
    providers: [AuthService, JwtStrategy, Repository, JwtRefreshStrategy],
    controllers: [AuthController],
    exports: [AuthService, JwtModule, JwtStrategy],
})
export class AuthModule {}
