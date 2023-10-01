export class PublicUserDto {
  constructor(name: string, email: string, id: string) {
    this.name = name;
    this.email = email;
    this.id = id;
  }
  public name!: string;
  public email!: string;
  public id!: string;
}
