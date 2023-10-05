import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { HashService } from 'src/shared/services/hash/hash.service';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from 'src/types/user-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userService: UserService,
    private readonly _hashService: HashService,
    private readonly _jwtService: JwtService,
  ) {}
  public async signIn(data: { email: string; password: string }): Promise<{ access_token: string }> {
    const possibleUser = await this._userService.getOneByEmail(data.email);
    if (!possibleUser) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await this._hashService.compareHash(data.password, possibleUser.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: UserPayload = {
      sub: possibleUser.id,
      name: possibleUser.name,
      message: 'Here you are more than a sub 💟',
    };

    const token = await this._jwtService.signAsync(payload);
    return {
      access_token: token,
    };
  }
}
