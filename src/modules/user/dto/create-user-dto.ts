import { IsEmail, IsNotEmpty } from 'class-validator';
import { UniqueEmail } from '../decorators/unique-email.decorator';
import { StrongPassword } from '../decorators/strong-password.decorator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  public name!: string;

  @IsEmail({}, { message: 'Invalid email' })
  @UniqueEmail({ message: 'Email already exists' })
  public email!: string;

  @StrongPassword({ message: 'Password is too weak' })
  public password!: string;
}
