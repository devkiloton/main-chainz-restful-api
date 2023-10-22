import { IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateUserDto {
  @ApiProperty({
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  public name!: string;

  @ApiProperty({
    example: 'john.doe@mail.com',
    required: false,
  })
  @IsEmail({}, { message: 'Invalid email' })
  @IsOptional()
  public email!: string;

  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  public isEmailVerified!: boolean;
}
