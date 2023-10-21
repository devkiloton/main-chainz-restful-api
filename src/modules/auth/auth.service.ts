import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { HashService } from 'src/shared/services/hash/hash.service';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from 'src/types/user-payload';
import { isNil } from 'lodash';
import { SignInDto } from './dto/sign-in.dto';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { AuthEntity } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Auth } from './types/auth';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity) private readonly _authRepository: Repository<AuthEntity>,
    private readonly _hashService: HashService,
    private readonly _userService: UserService,
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
    private readonly _emailService: EmailService,
  ) {}

  public async signIn(data: SignInDto): Promise<Auth> {
    const possibleUser = await this._userService.findOneByEmail(data.email, ['auth']);
    if (isNil(possibleUser)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await this._hashService.compareHash(data.password, possibleUser.password);
    if (isNil(isMatch)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens: Auth = await this.getTokens(possibleUser.id, possibleUser.name);
    await this.updateRefreshToken(possibleUser, tokens.refresh_token);
    // #TODO: send email to user alerting him that his account has been logged in
    await this._emailService.sendEmailResetPasswordCode({ receiver: possibleUser.email, code: 123456 });

    return tokens;
  }

  public async signUp(data: CreateUserDto): Promise<Auth> {
    const possibleUser = await this._userService.create({ user: data, password: data.password });
    const tokens: Auth = await this.getTokens(possibleUser.id, possibleUser.name);
    await this.createAuth(possibleUser, tokens);
    // #TODO: send email to user to verify his email
    await this._emailService.sendEmailResetPasswordCode({ receiver: possibleUser.email, code: 123456 });

    return tokens;
  }

  public async updateRefreshToken(user: UserEntity, refreshToken: string) {
    const hashedRefreshToken = await this._hashService.generateHash(refreshToken);
    await this._authRepository.update(user.auth.id, {
      refreshToken: hashedRefreshToken,
    });
  }

  public async emitCode(email: string) {
    // #TODO: create a table to just add the code and the email and the time of the request and then check if the code is valid and the time is valid
    // to avoid error in the request and expose the user to a brute force attack
    const possibleUser = await this._userService.findOneByEmail(email, ['auth']);
    if (isNil(possibleUser)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const code = Math.floor(100000 + Math.random() * 900000);
    const hashedCode = await this._hashService.generateHash(code.toString());
    await this._authRepository.update(possibleUser.auth.id, { authCode: hashedCode, codeUpdatedAt: new Date() });
    await this._emailService.sendEmailResetPasswordCode({ receiver: email, code });
  }

  public async verifyCode(data: { email: string; code: string }) {
    const possibleUser = await this._userService.findOneByEmail(data.email, ['auth']);
    if (isNil(possibleUser)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (possibleUser.auth.codeUpdatedAt.getTime() + 1000 * 60 * 5 < Date.now())
      throw new ForbiddenException('Access Denied');

    const codeMatches = await this._hashService.compareHash(data.code, possibleUser.auth.authCode ?? 'UNKNOWN');
    if (!codeMatches) throw new ForbiddenException('Access Denied');
    this._authRepository.update(possibleUser.auth.id, { authCode: null, accessToken: null, refreshToken: null });
    // #TODO: send email thanking his choice
    await this._emailService.sendEmailResetPasswordCode({ receiver: data.email, code: 123456 });
  }

  public async createAuth(user: UserEntity, tokens: Auth) {
    const hashedRefreshToken = await this._hashService.generateHash(tokens.refresh_token);
    const auth = new AuthEntity();
    auth.user = user;
    auth.refreshToken = hashedRefreshToken;
    auth.accessToken = tokens.access_token;
    await this._authRepository.save(auth);
  }

  public async signOut(id: string) {
    const user = await this._userService.find(id, 'auth');
    await this._authRepository.update(user.auth.id, {
      refreshToken: null,
    });
  }

  public async getTokens(userId: string, username: string): Promise<Auth> {
    const payload: UserPayload = {
      sub: userId,
      name: username,
      message: 'Here you are more than a sub 💟',
    };

    const [access_token, refresh_token] = await Promise.all([
      this._jwtService.signAsync(payload, {
        secret: this._configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '10m',
      }),
      this._jwtService.signAsync(payload, {
        secret: this._configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '2d',
      }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  public async resetPassword(data: { email: string; code: string; password: string }) {
    const possibleUser = await this._userService.findOneByEmail(data.email, ['auth']);
    if (isNil(possibleUser)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (possibleUser.auth.codeUpdatedAt.getTime() + 1000 * 60 * 5 < Date.now())
      throw new ForbiddenException('Access Denied');

    const codeMatches = await this._hashService.compareHash(data.code, possibleUser.auth.authCode ?? 'UNKNOWN');
    if (!codeMatches) throw new ForbiddenException('Access Denied');
    await this._userService.updatePassword({ id: possibleUser.id, password: data.password });
    this._authRepository.update(possibleUser.auth.id, { authCode: null, accessToken: null, refreshToken: null });
  }

  public async refreshTokens(data: { userId: string; refreshToken: string }) {
    const user = await this._userService.find(data.userId, 'auth');
    if (!user || !user.auth.refreshToken) throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await this._hashService.compareHash(data.refreshToken, user.auth.refreshToken);
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.name);
    await this.updateRefreshToken(user, tokens.refresh_token);
    return tokens;
  }
}
