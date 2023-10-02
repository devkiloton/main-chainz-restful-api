import { Injectable, NotFoundException } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { UserService } from '../user.service';

@Injectable()
@ValidatorConstraint({ name: 'uniqueEmail', async: true })
export class UniqueEmailValidator implements ValidatorConstraintInterface {
  constructor(private readonly _userService: UserService) {}

  public async validate(_value: any, _validationArguments: ValidationArguments): Promise<boolean> {
    try {
      await this._userService.getOneByEmail(_value);
      return false;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return true;
      }

      throw error;
    }
  }
}
