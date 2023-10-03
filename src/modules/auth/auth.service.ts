import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { HashService } from 'src/shared/services/hash/hash.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly _userService: UserService,
    private readonly _hashService: HashService,
  ) {}
  public async signIn(data: { email: string; password: string }) {
    const possibleUser = await this._userService.getOneByEmail(data.email);
    if (!possibleUser) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await this._hashService.compareHash(data.password, possibleUser.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
