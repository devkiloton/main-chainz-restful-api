export class UserEntity {
  public readonly id!: string;
  public readonly name!: string;
  public readonly email!: string;
  public readonly password!: string;
  public readonly createdAt!: Date;

  constructor(name: string, email: string, password: string, createdAt: Date, id: string) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.id = id;
  }
}
