import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../user/entities/user.entity';
import { welcomeEmail } from './templates/welcome-email';
import { confirmationCode } from './templates/confirmation-code';
import { loginAttempt } from './templates/login-attempt';

@Injectable()
export class EmailService {
  constructor(
    private readonly _mailerService: MailerService,
    private readonly _configService: ConfigService,
  ) {}
  public async sendEmailResetPasswordCode(data: { receiver: string; code: string }): Promise<void> {
    this._mailerService.sendMail({
      to: data.receiver,
      from: this._configService.get<string>('MAILER_USER'),
      subject: 'MY_COMPANY: Confirmation code',
      html: confirmationCode({ code: data.code }),
    });
  }

  public async sendEmailWelcome(data: { user: UserEntity }): Promise<void> {
    this._mailerService.sendMail({
      to: data.user.email,
      from: this._configService.get<string>('MAILER_USER'),
      subject: `MY_COMPANY: Welcome ${data.user.name}!`,
      html: welcomeEmail({ name: data.user.name }),
    });
  }

  public async logInAlert(data: { user: UserEntity }): Promise<void> {
    this._mailerService.sendMail({
      to: data.user.email,
      from: this._configService.get<string>('MAILER_USER'),
      subject: `MY_COMPANY: New log-in attempt detected`,
      html: loginAttempt(),
    });
  }
}
