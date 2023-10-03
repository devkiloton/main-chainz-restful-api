import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  constructor(private readonly _configService: ConfigService) {}

  public async generateHash(plainText: string): Promise<string> {
    const salt = this._configService.get<string>('SALT');
    const hash = await bcrypt.hash(plainText, salt!);
    return hash;
  }

  public async compareHash(plainText: string, hash: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(plainText, hash);
    return isMatch;
  }
}
