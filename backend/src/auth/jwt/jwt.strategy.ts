import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

const fromAuthCookie = () => {
    console.log('cookie 검사 진입');
    return (request) => {
        let token = null;
        if (request && request.cookies) {
            token = request.cookies['Authorization'];
            console.log(`fromAuthCookie token = ${token}`);
        }
        return token;
    };
};
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        console.log('jwt전략 생성자 진입 ' + process.env.JWT_SECRET_KEY);
        super({
            jwtFromRequest: fromAuthCookie(),
            secretOrKey: process.env.JWT_SECRET_KEY,
            ignoreExpiration: false,
        });
    }

    async validate(payload: any) {
        console.log(`jwt validate : payload = ${payload}`);
        const user = this.authService.isRightUser(payload.userId);
        if (!user) {
            return null;
        }
        return user;
    }
}
