import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { isNil } from 'lodash';

@Injectable()
@ValidatorConstraint({ name: 'uniqueEmail', async: true })
export class UniqueEmailValidator implements ValidatorConstraintInterface {
  constructor(@InjectRepository(UserEntity) private readonly _userRepository: Repository<UserEntity>) {}

  public async validate(_value: any, _validationArguments: ValidationArguments): Promise<boolean> {
    const options = { where: { email: _value } };
    const user = await this._userRepository.findOne(options);
    if (isNil(user)) {
      return true;
    }
    return false;
  }
}
