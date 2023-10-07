import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { StrongPassword } from 'src/modules/user/decorators/strong-password.decorator';

export class AuthDto {
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
}
