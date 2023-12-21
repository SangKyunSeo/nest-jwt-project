import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from 'src/user/dto/user.login.dto';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
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

        if (user === null || !isPasswordValidate) {
            throw new UnauthorizedException('Login information does not match');
        } else {
            return user;
        }
    }

    // 로그인
    async jwtLogin(loginDTO: LoginDTO) {
        const user = await this.isUser(loginDTO);
        return this.generateToken(user.userId);
    }

    // Access Token 발급
    async generateToken(userId: string) {
        const payload = { userId };
        return this.jwtService.sign(payload);
    }
}
