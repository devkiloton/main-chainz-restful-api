import { ValidationOptions, registerDecorator } from 'class-validator';
import { UniqueEmailValidator } from '../validators/unique-email.validator';

export const UniqueEmail = (validationOptions?: ValidationOptions) => {
  return (target: Object, propertyKey: string): void => {
    registerDecorator({
      name: 'uniqueEmail',
      target: target.constructor,
      propertyName: propertyKey,
      options: validationOptions,
      validator: UniqueEmailValidator,
      constraints: [],
    });
  };
};
