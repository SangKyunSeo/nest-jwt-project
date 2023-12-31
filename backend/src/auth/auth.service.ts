import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from 'src/user/dto/user.login.dto';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly config: ConfigService,
    ) {}

    // 유저 아이디 및 비밀번호 체크
    async isUser(loginDTO: LoginDTO) {
        const { userId, userPw } = loginDTO;
        console.log(`isUser method : userId = ${userId}, userPw = ${userPw}`);
        const user = await this.userService.getUser(userId);

        if (user === null) {
            throw new UnauthorizedException('Login information does not match');
        }

        const isPasswordValidate: boolean = await bcrypt.compare(
            userPw,
            user.userPw,
        );

        if (!isPasswordValidate) {
            throw new UnauthorizedException('Login information does not match');
        } else {
            return user;
        }
    }

    // userId를 통해 사용자 인증 처리
    async isRightUser(userId: string) {
        console.log(`JWT Strategy User validation : userId = ${userId}`);
        const user = await this.userService.getUser(userId);
        return user === null ? null : user;
    }

    // 로그인
    async jwtLogin(loginDTO: LoginDTO) {
        const user = await this.isUser(loginDTO);
        return {
            accessToken: await this.generateAccessToken(user.userId),
            refreshToken: await this.generateRefreshToken(user.userId),
        };
    }

    // Access Token 발급
    async generateAccessToken(userId: string) {
        const payload = { userId };
        return this.jwtService.sign(payload);
    }

    // Refresh Token 발급
    async generateRefreshToken(userId: string) {
        const payload = { userId };
        return this.jwtService.sign(payload, {
            secret: this.config.get<string>('JWT_REFRESH_KEY'),
            expiresIn: this.config.get<string>('JWT_REFRESH_EXP'),
        });
    }
}
