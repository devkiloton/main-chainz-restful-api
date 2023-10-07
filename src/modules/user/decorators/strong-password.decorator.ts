import { ValidationOptions, registerDecorator } from 'class-validator';
import { StrongPasswordValidator } from '../validators/strong-password.validator';

export const StrongPassword = (validationOptions?: ValidationOptions) => {
  return (target: Object, propertyKey: string): void => {
    registerDecorator({
      name: 'strongPassword',
      target: target.constructor,
      propertyName: propertyKey,
      options: validationOptions,
      validator: StrongPasswordValidator,
      constraints: [],
    });
  };
};
