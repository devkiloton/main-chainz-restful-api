import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthDto {
  @IsEmail(undefined, { message: 'O e-mail informado é inválido' })
  public email!: string;

  @IsNotEmpty({ message: 'A senha não pode estar vazia' })
  public password!: string;
}
