import { PipeTransform, Injectable } from '@nestjs/common';
import { HashService } from 'src/shared/services/hash/hash.service';

@Injectable()
export class PasswordHashingPipe implements PipeTransform {
  constructor(private readonly _hashService: HashService) {}
  async transform(password: string): Promise<string> {
    const hash = await this._hashService.generateHash(password);
    return hash;
  }
}
