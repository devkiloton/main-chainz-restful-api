import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class EmitCodeDto {
  @ApiProperty({
    example: 'john.doe@mail.com',
    required: true,
  })
  @IsEmail(undefined, { message: 'Invalid email' })
  public email!: string;
}
