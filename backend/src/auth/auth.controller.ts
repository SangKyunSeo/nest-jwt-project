import { Controller, Get, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtRefreshGuard } from './jwt/jwt-refresh-guard';
import { Response } from 'express';
@Controller('/api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('/refresh')
    @UseGuards(JwtRefreshGuard)
    public async refresh(
        @Request() request,
        @Res({ passthrough: true }) response: Response,
    ) {
        // accessToken 재발급
        const userId = request.user.userId;
        const accessToken = await this.authService.generateAccessToken(userId);
        response.cookie('Authorization', accessToken, {
            domain: 'localhost',
            secure: true,
            maxAge: 60 * 60 * 1000,
            path: '/',
            httpOnly: true,
        });

        return true;
    }
}
