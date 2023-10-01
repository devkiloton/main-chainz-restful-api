import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { isNil } from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthRepository {
  constructor(@InjectRepository(UserEntity) private readonly _userRepository: Repository<UserEntity>) {}

  public async createOne(user: UserEntity): Promise<void> {
    await this._userRepository.save(user);
  }

  public async getOne(id: string): Promise<UserEntity | null> {
    const options = { where: { id } };
    const user = await this._userRepository.findOne(options);
    return user ?? null;
  }

  public async getOneByEmail(email: string): Promise<UserEntity | null> {
    const options = { where: { email } };
    const user = await this._userRepository.findOne(options);
    return user ?? null;
  }

  public async updateOne(data: { id: string; user: Partial<UserEntity> }): Promise<UserEntity | null> {
    const userObj = await this._userRepository.update(data.id, data.user);
    console.log(userObj);
    return userObj.raw ?? null;
  }

  public async deleteOne(id: string): Promise<boolean> {
    const user = await this._userRepository.delete(id);
    return isNil(user);
  }
}
