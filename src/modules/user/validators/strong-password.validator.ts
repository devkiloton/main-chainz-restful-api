import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { STRONG_PASSWORD } from 'src/resources/regex/strong-password';

@Injectable()
@ValidatorConstraint({ name: 'uniqueEmail', async: true })
export class StrongPasswordValidator implements ValidatorConstraintInterface {
  public async validate(value: unknown, _validationArguments: ValidationArguments): Promise<boolean> {
    const password = value as string;

    return STRONG_PASSWORD.test(password);
  }
}
