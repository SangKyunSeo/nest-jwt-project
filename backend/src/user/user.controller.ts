import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/api/user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('/id/duplicate')
    public async checkIdDuplicate(@Body('memberId') memberId: string) {
        const result = await this.userService.checkIdDuplicate(memberId);

        return result;
    }
}
