import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { pickBy } from 'lodash';

@Injectable()
export class AuthRepository {
  private _users: Array<UserEntity> = [];

  public async createOne(user: UserEntity): Promise<void> {
    this._users.push(user);
    this._users.find(user => user.id === user.id);
  }

  public async getOne(id: string): Promise<UserEntity | null> {
    const user = this._users.find(user => user.id === id);
    return user ?? null;
  }

  public async getOneByEmail(email: string): Promise<UserEntity | null> {
    const user = this._users.find(user => user.email === email);
    return user ?? null;
  }

  public async updateOne(data: { id: string; user: Partial<UserEntity> }): Promise<UserEntity | null> {
    const userObj = await this.getOne(data.id);
    const userIndex = this._users.findIndex(user => user.id === data.id);
    if (userObj) {
      const user = pickBy(data.user, field => field !== undefined);
      this._users[userIndex] = { ...userObj, ...user };
    }
    return this._users[userIndex] ?? null;
  }

  public async deleteOne(id: string): Promise<UserEntity | null> {
    const user = await this.getOne(id);
    this._users = this._users.filter(user => user.id !== id);
    return user ?? null;
  }
}
