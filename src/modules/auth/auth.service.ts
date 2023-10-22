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

  /**
   * @description - This method will try to find a user with the given email and then will compare the password with the hashed password
   * if the password matches then it will generate a new access token and refresh token and will update the refresh token in the database, then
   * it will send a log in alert to the user and will emit a code to the user email
   * @throws - {@link NotFoundException} If the user is not found
   * @throws - {@link UnauthorizedException} If the user is not found or the password doesn't match
   * @param data - a {@link SignInDto} object containing the `email` and `password`(already hashed) of the user
   */
  public async signIn(data: SignInDto): Promise<void> {
    const possibleUser = await this._userService.findOneByEmail(data.email, ['auth']);
    if (isNil(possibleUser)) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await this._hashService.compareHash(data.password, possibleUser.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens: Auth = await this.getTokens({ user: possibleUser, username: possibleUser.name });
    await this.updateRefreshToken({
      user: possibleUser,
      tokens,
    });
    await this._emailService.logInAlert({ user: possibleUser });
    this.emitCode({ email: possibleUser.email, type: 'sign-general' });
  }

  /**
   * @description - This method will create a new user and will generate a new access token and refresh token with ´isEmailVerified´ set to false in the payload
   * since the user is not verified yet, then it will send a welcome email to the user and will emit a code to the user email
   * @param data - {@link CreateUserDto} object containing the `name`, `email` and `password` of the user
   */
  public async signUp(data: CreateUserDto): Promise<void> {
    const possibleUser = await this._userService.create({ user: data, password: data.password });
    const tokens: Auth = await this.getTokens({ user: possibleUser, username: possibleUser.name });
    await this._createAuth(possibleUser, tokens);
    await this._emailService.sendEmailWelcome({ user: possibleUser });
    await this.emitCode({ email: possibleUser.email, type: 'sign-general' });
  }

  /**
   * @description This method will remove the refresh token and the access token from the database
   * @param id - The id of the user
   */
  public async signOut(id: string) {
    const user = await this._userService.find(id, 'auth');
    await this._authRepository.update(user.auth.id, {
      refreshToken: null,
      accessToken: null,
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

  /**
   * @description - This method will try to find a user with the given email, verify the time(5min limit), and will compare the code with the hashed code,
   * if the code matches then it will update the password of the user and will remove the reset password code from the database
   * @throws Throws a {@link NotFoundException} If the user is not found
   * @throws Throws a {@link UnauthorizedException} If the user is not found or the password doesn't match
   * @throws Throws a {@link ForbiddenException} If the user is not found or the code doesn't match
   * @param data - an object containing the email, the code and the new password of the user
   */
  public async resetPassword(data: ResetPasswordDto) {
    const possibleUser = await this._userService.findOneByEmail(data.email, ['auth']);
    if (isNil(possibleUser)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (possibleUser.auth.resetPasswordCodeUpdatedAt.getTime() + 1000 * 60 * 5 < Date.now())
      throw new ForbiddenException('Access Denied');

    const codeMatches = await this._hashService.compareHash(
      data.code,
      possibleUser.auth.resetPasswordCode ?? 'UNKNOWN',
    );

    if (!codeMatches) throw new ForbiddenException('Access Denied');
    await this._userService.updatePassword({ id: possibleUser.id, password: data.password });
    await this._authRepository.update(possibleUser.auth.id, {
      resetPasswordCode: null,
      accessToken: null,
      refreshToken: null,
    });
  }

  /**
   * @description This method will try to find a user with the given email and will emit a code to the user email, so the user can reset his password
   * @throws Throws a {@link NotFoundException} If the user is not found
   * @param data - an object containing the email of the user
   */
  public async requestResetPassword(email: string): Promise<void> {
    const possibleUser = await this._userService.findOneByEmail(email, ['auth']);
    if (isNil(possibleUser)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    this.emitCode({ email: possibleUser.email, type: 'reset-password' });
  }

  /**
   * @description This method will generate a new access token and refresh token
   * @param data - an object containing the {@link UserEntity} and the username
   * @returns an {@link Auth} object as {@link Promise} containing the access token and the refresh token
   */
  public async getTokens(data: { user: UserEntity; username: string }): Promise<Auth> {
    const payload: UserPayload = {
      sub: data.user.id,
      name: data.username,
      isEmailVerified: data.user.isEmailVerified,
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

  /**
   * @description This method will create a new {@link AuthEntity} object and will save it in the database
   * @param user - The {@link UserEntity} object
   * @param tokens - The {@link Auth} object
   */
  private async _createAuth(user: UserEntity, tokens: Auth): Promise<void> {
    const hashedRefreshToken = await this._hashService.generateHash(tokens.refresh_token);
    const auth = new AuthEntity();
    auth.user = user;
    auth.refreshToken = hashedRefreshToken;
    auth.accessToken = tokens.access_token;
    await this._authRepository.save(auth);
  }

  /**
   * @description - This method will try to find a user with the given userId and will compare the refresh token with the hashed refresh token,
   * if the refresh token matches then it will generate a new access token and refresh token and will update the refresh token in the database
   * @throws Throws a {@link ForbiddenException} If the user is not found or the refresh token doesn't match
   * @throws Throws a {@link ForbiddenException} If the refresh token is not found
   * @param data - An object containing the userId and the refreshToken
   * @returns An {@link Auth} object as {@link Promise} containing the access token and the refresh token
   */
  public async refreshTokens(data: { userId: string; refreshToken: string }): Promise<Auth> {
    const user = await this._userService.find(data.userId, 'auth');
    if (!user || isNil(user.auth.refreshToken)) throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await this._hashService.compareHash(data.refreshToken, user.auth.refreshToken);
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens({ user: user, username: user.name });
    await this.updateRefreshToken({ user, tokens });
    return tokens;
  }

  /**
   * @description This method will update the refresh token and the access token in the database
   * @param data - an object containing the {@link UserEntity} and the {@link Auth} object
   */
  public async updateRefreshToken(data: { user: UserEntity; tokens: Auth }): Promise<void> {
    const hashedRefreshToken = await this._hashService.generateHash(data.tokens.refresh_token);
    await this._authRepository.update(data.user.auth.id, {
      refreshToken: hashedRefreshToken,
      accessToken: data.tokens.access_token,
    });
  }
}
