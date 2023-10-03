import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('signin')
  signIn(@Body() { email, password }: AuthDto) {
    return this._authService.signIn({ email, password });
  }
}
