import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    public async checkIdDuplicate(memberId: string): Promise<boolean> {
        const user = await this.userRepository.findOneBy({
            userId: memberId,
        });

        console.log(`user : ${user},`);
        return user === null ? false : true;
    }
}
