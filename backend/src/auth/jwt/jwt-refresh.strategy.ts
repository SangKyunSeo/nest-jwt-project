import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';
const fromAuthCookie = () => {
    return (request) => {
        let token = null;
        if (request && request.cookies) {
            token = request.cookies['RefreshToken'];
            console.log(`RefreshToken : ${token}`);
        }
        return token;
    };
};

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh-token',
) {
    constructor(private readonly userService: UserService) {
        super({
            jwtFromRequest: fromAuthCookie(),
            secretOrKey: process.env.JWT_REFRESH_KEY,
            ignoreExpiration: false,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: any) {
        const refreshToken = req.cookies['RefreshToken'];
        return this.userService.refreshTokenMatch(refreshToken, payload.userId);
    }
}
