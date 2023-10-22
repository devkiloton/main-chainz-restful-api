import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { StrongPassword } from 'src/modules/user/decorators/strong-password.decorator';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'john.doe@mail.com',
    required: true,
  })
  @IsEmail(undefined, { message: 'Invalid email' })
  public email!: string;

  @ApiProperty({
    example: 'AAaa11!!',
    required: true,
    description:
      'must be at least 8 characters long, contain at least 1 lowercase letter, 1 uppercase letter, 1 numeric character, and one special character.',
  })
  @StrongPassword({ message: 'Invalid password' })
  public password!: string;

  @ApiProperty({
    example: 'XXXXXX',
    required: true,
    description: 'must be at least 6 characters long',
  })
  @IsNotEmpty({ message: 'Code is required' })
  @MaxLength(6, { message: 'Code must be at least 6 characters long' })
  public code!: string;
}
