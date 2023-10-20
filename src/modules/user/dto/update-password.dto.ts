import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { StrongPassword } from '../decorators/strong-password.decorator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdatePasswordDto {
  @ApiProperty({
    example: 'AAaa11!!',
    required: true,
    description:
      'must be at least 8 characters long, contain at least 1 lowercase letter, 1 uppercase letter, 1 numeric character, and one special character.',
  })
  @StrongPassword({ message: 'Password is too weak' })
  public password!: string;

  @IsNotEmpty({ message: 'Code is required' })
  @MaxLength(255, { message: 'Code must be at least 6 characters long' })
  public code!: string;

  @ApiProperty({
    example: 'john.doe@mail.com',
    required: false,
  })
  @IsEmail({}, { message: 'Invalid email' })
  public email!: string;
}
