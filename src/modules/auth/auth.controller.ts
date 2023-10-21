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
import { UpdatePasswordDto } from '../user/dto/update-password.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { Throttle } from '@nestjs/throttler';
import { EmitCodeDto } from './dto/emit-code.dto';

@ApiTags('/auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('sign-in')
  async signIn(
    @Body()
    { email, password }: SignInDto,
  ): Promise<Auth> {
    const userWithAuth = await this._authService.signIn({ email, password });
    return userWithAuth;
  }

  @Post('sign-up')
  async signUp(
    @Body()
    { name, email }: CreateUserDto,
    @Body('password', PasswordHashingPipe)
    password: string,
  ): Promise<Auth> {
    const userWithAuth = await this._authService.signUp({ name, email, password });
    return userWithAuth;
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
  // #TODO: Separate the code emissions to specific services, since in the future we might want to emit code for other things
  @Throttle({ default: { limit: 3, ttl: 1000 * 60 * 60 } })
  @Post('emit-code')
  async emitCode(
    @Body()
    { email }: EmitCodeDto,
  ): Promise<Response<void>> {
    // #TODO: Froze any payout for 10 minutes after reset and send email to user advertising the reset with option to froze the whole account
    await this._authService.emitCode(email);
    return {
      message: 'Code emitted successfully',
    };
  }

  @Post('verify-code')
  async verifyCode(
    @Body()
    { email, code }: VerifyCodeDto,
  ): Promise<Response<void>> {
    await this._authService.verifyCode({ email, code });
    return {
      message: 'User verified successfully',
    };
  }

  @Patch('reset-password')
  async resetPassword(
    @Body()
    { email, code }: UpdatePasswordDto,
    @Body('password', PasswordHashingPipe)
    password: string,
  ): Promise<Response<void>> {
    await this._authService.resetPassword({ email, code, password });
    return {
      message: 'Password reset successfully',
    };
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(
    @Req()
    req: UserReqRefresh,
  ) {
    const userId = req.user.sub;
    const refreshToken = req.user.refreshToken;
    return await this._authService.refreshTokens({ userId, refreshToken });
  }
}
