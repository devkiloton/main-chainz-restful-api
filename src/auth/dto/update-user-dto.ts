import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { UniqueEmail } from '../decorators/unique-email.decorator';

export class UpdateUserDto {
  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
  @IsNotEmpty({ message: 'Name is required' })
  @IsOptional()
  public name!: string;

  @IsEmail({}, { message: 'Invalid email' })
  @UniqueEmail({ message: 'Email already exists' })
  @IsOptional()
  public email!: string;
}
