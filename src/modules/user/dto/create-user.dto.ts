import { IsEmail, IsNotEmpty } from 'class-validator';
import { UniqueEmail } from '../decorators/unique-email.decorator';
import { StrongPassword } from '../decorators/strong-password.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    required: true,
  })
  @IsNotEmpty({ message: 'Name is required' })
  public name!: string;

  @ApiProperty({
    example: 'john.doe@mail.com',
    required: true,
  })
  @IsEmail({}, { message: 'Invalid email' })
  @UniqueEmail({ message: 'Email already exists' })
  public email!: string;

  @ApiProperty({
    example: 'AAaa11!!',
    required: true,
    description:
      'must be at least 8 characters long, contain at least 1 lowercase letter, 1 uppercase letter, 1 numeric character, and one special character.',
  })
  @StrongPassword({ message: 'Password is too weak' })
  public password!: string;
}
