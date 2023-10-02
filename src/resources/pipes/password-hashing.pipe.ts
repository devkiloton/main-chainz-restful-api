import { PipeTransform, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordHashingPipe implements PipeTransform {
  constructor(private readonly _configService: ConfigService) {}
  async transform(password: string): Promise<string> {
    const salt = this._configService.get<string>('SALT');
    const hash = await bcrypt.hash(password, salt!);
    return hash;
  }
}
