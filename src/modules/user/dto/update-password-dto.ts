import { StrongPassword } from '../decorators/strong-password.decorator';
export class UpdatePasswordDto {
  @StrongPassword({ message: 'Password is too weak' })
  public password!: string;
}
