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
}
