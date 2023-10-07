import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HashService } from 'src/shared/services/hash/hash.service';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from 'src/types/user-payload';
import { isNil } from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private readonly _userRepository: Repository<UserEntity>,
    private readonly _hashService: HashService,
    private readonly _jwtService: JwtService,
  ) {}
  public async signIn(data: { email: string; password: string }): Promise<{ access_token: string }> {
    const options = { where: { email: data.email } };
    const possibleUser = await this._userRepository.findOne(options);
    if (isNil(possibleUser)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await this._hashService.compareHash(data.password, possibleUser.password);
    if (isNil(isMatch)) {
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
