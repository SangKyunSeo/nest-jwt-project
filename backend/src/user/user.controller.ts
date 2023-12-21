import { Body, Controller, Post, Res } from '@nestjs/common';
import { UserRegisterDto } from './dto/user.register.dto';
import { LoginDTO } from './dto/user.login.dto';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';

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
        @Res() response: Response,
    ) {
        const accessToken = await this.authService.jwtLogin(loginDTO);
        console.log(`AccessToken : ${accessToken}`);

        return response.status;
    }
}
