import { Body, Controller, Post, Res, Get } from '@nestjs/common';
import { UserRegisterDto } from './dto/user.register.dto';
import { LoginDTO } from './dto/user.login.dto';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';

@Controller('/api/user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {}

    @Post('/id/duplicate')
    public async checkIdDuplicate(
        @Body('userId') userId: string,
    ): Promise<boolean> {
        const result = await this.userService.checkIdDuplicate(userId);

        return result;
    }

    @Post('/register')
    public async createUser(
        @Body('userDTO') userDTO: UserRegisterDto,
    ): Promise<boolean> {
        const user = await this.userService.createUser(userDTO);

        console.log(`user : ${user}`);
        return user === null ? false : true;
    }

    // 로그인
    @Post('/login')
    public async doLogin(
        @Body('loginDTO') loginDTO: LoginDTO,
        @Res({ passthrough: true }) response: Response,
    ) {
        const user = await this.authService.isUser(loginDTO);

        let accessToken = '';
        let refreshToken = '';
        await this.authService.jwtLogin(loginDTO).then((data) => {
            accessToken = data.accessToken;
            refreshToken = data.refreshToken;
        });
        console.log(`AccessToken : ${accessToken}`);
        console.log(`RefreshToken : ${refreshToken}`);
        response.cookie('Authorization', accessToken, {
            domain: 'localhost',
            secure: true,
            maxAge: 60 * 60 * 1000,
            path: '/',
            httpOnly: true,
        });
        response.cookie('RefreshToken', refreshToken, {
            domain: 'localhost',
            secure: true,
            maxAge: 60 * 60 * 1000,
            path: '/',
            httpOnly: true,
        });

        await this.userService.setRefreshToken(refreshToken, user.userId);
        return {
            user: user,
            accessToken: accessToken,
        };
    }

    // 로그아웃
    @Get('/logout')
    public async doLogout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('Authorization');
        response.clearCookie('RefreshToken');
        return true;
    }
}
