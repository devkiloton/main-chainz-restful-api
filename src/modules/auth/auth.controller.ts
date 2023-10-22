import { Controller, Post, Body, Req, UseGuards, Get, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'src/types/response';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from './types/auth';
import { SignInDto } from './dto/sign-in.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { PasswordHashingPipe } from 'src/resources/pipes/password-hashing.pipe';
import { UserReq } from 'src/types/user-req';
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard';
import { RefreshTokenGuard } from 'src/shared/guards/refresh-token.guard';
import { UserReqRefresh } from 'src/types/user-req-refresh';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { EmitCodeDto } from './dto/emit-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('/auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('sign-in')
  async signIn(
    @Body()
    { email, password }: SignInDto,
  ): Promise<Response<void>> {
    await this._authService.signIn({ email, password });
    return {
      message: 'Confirmation email sent',
    };
  }

  @Post('sign-up')
  async signUp(
    @Body()
    { name, email }: CreateUserDto,
    @Body('password', PasswordHashingPipe)
    password: string,
  ): Promise<Response<void>> {
    await this._authService.signUp({ name, email, password });
    return {
      message: 'Confirmation email sent',
    };
  }

  @UseGuards(AccessTokenGuard)
  @Post('sign-out')
  async signOut(
    @Req()
    req: UserReq,
  ): Promise<Response<void>> {
    await this._authService.signOut(req.user.sub);
    return {
      message: 'User logged out successfully',
    };
  }

  // 3 requests per hour
  @Throttle({ default: { limit: 3, ttl: 1000 * 60 * 60 } })
  @Post('request-reset-password')
  async requestResetPassword(
    @Body()
    { email }: EmitCodeDto,
  ): Promise<Response<void>> {
    await this._authService.requestResetPassword({ email });
    return {
      message: 'Reset password email sent',
    };
  }

  @Throttle({ default: { limit: 3, ttl: 1000 * 60 * 60 } })
  @Patch('reset-password')
  async resetPassword(
    @Body()
    { email, code }: ResetPasswordDto,
    @Body('password', PasswordHashingPipe)
    password: string,
  ): Promise<Response<void>> {
    await this._authService.resetPassword({ email, code, password });
    return {
      message: 'Password changed successfully',
    };
  }

  @Post('verify-sign-general')
  async verifySignGenerel(
    @Body()
    { email, code }: VerifyCodeDto,
  ): Promise<Auth> {
    const tokens = await this._authService.verifySignGeneral({ email, code });
    return tokens;
  }

  // 5 requests per hour
  @Throttle({ default: { limit: 5, ttl: 1000 * 60 * 60 } })
  @Post('verify-reset-password')
  async verifyResetPasswordCode(
    @Body()
    { email, code }: VerifyCodeDto,
  ): Promise<boolean> {
    const isValid = await this._authService.verifyResetPasswordCode({ email, code });
    return isValid;
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(
    @Req()
    req: UserReqRefresh,
  ): Promise<Auth> {
    const userId = req.user.sub;
    const refreshToken = req.user.refreshToken;
    return await this._authService.refreshTokens({ userId, refreshToken });
  }
}
