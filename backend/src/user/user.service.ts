import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRegisterDto } from './dto/user.register.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

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

        const saltRound = 10;
        const password = await bcrypt.hash(userDTO.userPw, saltRound);

        userDTO.userPw = password;

        const user = await this.userRepository.save(userDTO);
        console.log(`Insert User : user_name = ${user.userName}`);
        return user;
    }

    public async getUser(userId: string): Promise<User> {
        const user = await this.userRepository.findOneBy({
            userId: userId,
        });

        return user;
    }
}
