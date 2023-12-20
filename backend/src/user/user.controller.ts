import { Body, Controller, Post } from '@nestjs/common';
import { UserRegisterDto } from './dto/user.register.dto';
import { UserService } from './user.service';

@Controller('/api/user')
export class UserController {
    constructor(private userService: UserService) {}

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
}
