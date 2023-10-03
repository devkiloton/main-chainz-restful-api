import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  public async generateHash(plainText: string): Promise<string> {
    const rounds = 10;
    const hash = await bcrypt.hash(plainText, rounds);
    return hash;
  }

  public async compareHash(plainText: string, hash: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(plainText, hash);
    return isMatch;
  }
}
