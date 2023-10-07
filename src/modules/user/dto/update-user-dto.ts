import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
export class UpdateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsOptional()
  public name!: string;

  @IsEmail({}, { message: 'Invalid email' })
  @IsOptional()
  public email!: string;
}
