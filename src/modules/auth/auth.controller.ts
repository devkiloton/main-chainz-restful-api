import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'src/types/response';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('/auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() { email, password }: AuthDto): Promise<Response<{ access_token: string }>> {
    const tokenObj = await this._authService.signIn({ email, password });
    return {
      message: 'User logged in successfully',
      data: tokenObj,
    };
  }
}
