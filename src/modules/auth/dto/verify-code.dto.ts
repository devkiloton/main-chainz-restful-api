import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class VerifyCodeDto {
  @ApiProperty({
    example: 'john.doe@mail.com',
    required: true,
  })
  @IsEmail(undefined, { message: 'Invalid email' })
  public email!: string;

  @ApiProperty({
    example: 'XXXXXX',
    required: true,
    description: 'must be at least 6 characters long',
  })
  @IsNotEmpty({ message: 'Code is required' })
  @MaxLength(6, { message: 'Code must be at least 6 characters long' })
  public code!: string;
}
