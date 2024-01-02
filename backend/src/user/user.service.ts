import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRegisterDto } from './dto/user.register.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly config: ConfigService,
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

    public async getUserByNum(userNum: number): Promise<User> {
        const user = await this.userRepository.findOneBy({
            userNum: userNum,
        });

        return user;
    }

    public async setRefreshToken(refreshToken: string, userId: string) {
        const hasedRefreshToken = await this.tokenEncryption(refreshToken);
        const refreshTokenExp = await this.getRefreshTokenExp();
        await this.userRepository.update(
            { userId: userId },
            {
                userRefreshToken: hasedRefreshToken,
                userRefreshTokenExp: refreshTokenExp,
            },
        );
    }

    public async refreshTokenMatch(refreshToken: string, userId: string) {
        const user = await this.getUser(userId);

        const isRefreshTokenMatch = await bcrypt.compare(
            refreshToken,
            user.userRefreshToken,
        );
        if (isRefreshTokenMatch) return user;
    }

    public async tokenEncryption(refreshToken: string) {
        const saltRound = 10;
        const hashedRefreshToken = await bcrypt.hash(refreshToken, saltRound);
        return hashedRefreshToken;
    }

    public async getRefreshTokenExp() {
        const currentDate = new Date();
        const refreshTokenExp = new Date(
            currentDate.getTime() +
                parseInt(this.config.get<string>('JWT_REFRESH_EXP')),
        );

        return refreshTokenExp;
    }

    public async setRefreshInit(userNum: number) {
        console.log(userNum);
        const user = await this.userRepository.update(
            { userNum: userNum },
            {
                userRefreshToken: null,
                userRefreshTokenExp: null,
            },
        );
        console.log(user);
        return user;
    }
}
