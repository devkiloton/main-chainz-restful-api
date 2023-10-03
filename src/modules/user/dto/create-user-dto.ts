import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { UniqueEmail } from '../decorators/unique-email.decorator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  public name!: string;

  @IsEmail({}, { message: 'Invalid email' })
  @UniqueEmail({ message: 'Email already exists' })
  public email!: string;

  @MinLength(6, { message: 'Password must be at least 6 characters' })
  public password!: string;
}
