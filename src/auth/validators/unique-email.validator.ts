import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { AuthService } from '../auth.service';

@Injectable()
@ValidatorConstraint({ name: 'uniqueEmail', async: true })
export class UniqueEmailValidator implements ValidatorConstraintInterface {
  constructor(private readonly _authService: AuthService) {}

  public async validate(_value: any, _validationArguments: ValidationArguments): Promise<boolean> {
    const exists = await this._authService.getOneByEmail(_value);
    return exists ? false : true;
  }
}
