import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

const fromAuthCookie = () => {
    return (request) => {
        let token = null;
        if (request && request.cookies) {
            token = request.cookie['Authorization'];
        }
        return token;
    };
};
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: fromAuthCookie(),
            secretOrKey: process.env.JWT_SECRET_KEY,
            ignoreExpiration: false,
        });
    }

    async validate(payload: any) {
        const user = this.authService.isRightUser(payload.userId);
        if (!user) {
            return null;
        }
        return user;
    }
}
