import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { isNil } from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user-dto';
import { CreateUserDto } from './dto/create-user-dto';
import { isNotNil } from 'ramda';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly _userRepository: Repository<UserEntity>) {}

  public async createOne(data: { user: CreateUserDto; password: string }): Promise<UserEntity> {
    const userObj = new UserEntity();
    userObj.name = data.user.name;
    userObj.email = data.user.email;
    userObj.password = data.password;
    const possibleUser = await this._userRepository.save(userObj);
    if (isNil(possibleUser)) {
      throw new HttpException('User not created', 500);
    }
    return possibleUser;
  }

  public async getOne(id: string): Promise<UserEntity> {
    const options = { where: { id } };
    const possibleUser = await this._userRepository.findOne(options);
    if (isNil(possibleUser)) {
      throw new NotFoundException('User not found');
    }
    return possibleUser;
  }

  public async getOneByEmail(email: string): Promise<UserEntity> {
    const options = { where: { email } };
    const possibleUser = await this._userRepository.findOne(options);
    if (isNil(possibleUser)) {
      throw new NotFoundException('User not found');
    }
    return possibleUser;
  }

  public async updateOne(data: { id: string; user: UpdateUserDto }): Promise<UserEntity> {
    const user = new UserEntity();
    user.name = data.user.name;
    user.email = data.user.email;
    const updateOp = await this._userRepository.update(data.id, user);
    if (isNil(updateOp)) {
      throw new HttpException('User not updated', 500);
    }
    const updatedUser = await this.getOne(data.id);
    return updatedUser;
  }

  public async changePassword(data: { id: string; password: string }): Promise<boolean> {
    const user = new UserEntity();
    user.password = data.password;
    const updateOperation = await this._userRepository.update(data.id, user);
    if (isNil(updateOperation)) {
      throw new HttpException('Password not changed', 500);
    }
    return isNotNil(updateOperation.affected);
  }

  public async deleteOne(id: string): Promise<void> {
    const options = { where: { id } };
    const possibleUser = await this._userRepository.findOne(options);
    if (!possibleUser) {
      throw new NotFoundException('Not possible to complete the operation');
    }
  }
}
