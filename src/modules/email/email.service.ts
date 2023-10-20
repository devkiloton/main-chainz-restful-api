import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private readonly _mailerService: MailerService,
    private readonly _configService: ConfigService,
  ) {}
  public async sendEmailResetPasswordCode(data: { receiver: string; code: number }): Promise<void> {
    this._mailerService.sendMail({
      to: data.receiver,
      from: this._configService.get<string>('MAILER_USER'),
      subject: 'Testing Nest MailerModule ✔',
      text: 'welcome',
      html: `<h1>${data.code}</h1>`,
    });
  }
}
