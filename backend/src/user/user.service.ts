import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRegisterDto } from './dto/user.register.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    public async checkIdDuplicate(userId: string): Promise<boolean> {
        const user = await this.userRepository.findOneBy({
            userId: userId,
        });

        console.log(`user : ${user},`);
        return user === null ? false : true;
    }

    public async createUser(userDTO: UserRegisterDto): Promise<User> {
        console.log(`userDTO : ${userDTO}`);
        const user = await this.userRepository.save(userDTO);
        console.log(`Insert User : user_name = ${user.userName}`);
        return user;
    }
}
