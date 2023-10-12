import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateUserDto {
  @ApiProperty({
    example: 'John Doe',
    required: false,
  })
  @IsNotEmpty({ message: 'Name is required' })
  @IsOptional()
  public name!: string;

  @ApiProperty({
    example: 'john.doe@mail.com',
    required: false,
  })
  @IsEmail({}, { message: 'Invalid email' })
  @IsOptional()
  public email!: string;
}
