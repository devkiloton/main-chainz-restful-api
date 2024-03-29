import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { isNil } from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { isNotNil } from 'ramda';
import { CreateUserDto } from './dto/create-user.dto';
import { BitcoinService } from '../bitcoin/bitcoin.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly _userRepository: Repository<UserEntity>,
    private readonly _bitcoinService: BitcoinService,
  ) {}

  public async create(data: { user: CreateUserDto; password: string }): Promise<UserEntity> {
    const userObj = new UserEntity();
    userObj.name = data.user.name;
    userObj.email = data.user.email;
    userObj.password = data.password;
    const possibleUser = await this._userRepository.save(userObj);
    this._bitcoinService.createWallet({ userId: possibleUser.id });
    return possibleUser;
  }

  public async find(id: string, relation?: string): Promise<UserEntity> {
    const options = { where: { id }, relations: relation ? [relation] : undefined };
    const possibleUser = await this._userRepository.findOne(options);
    if (isNil(possibleUser)) {
      throw new NotFoundException('User not found');
    }
    return possibleUser;
  }

  public async findOneByEmail(email: string, relation?: Array<string>): Promise<UserEntity | null> {
    const options = { where: { email }, relations: isNil(relation?.length) ? undefined : relation };
    const possibleUser = await this._userRepository.findOne(options);
    return possibleUser;
  }

  public async update(data: { id: string; user: UpdateUserDto }): Promise<UserEntity> {
    const user = new UserEntity();
    user.name = data.user.name;
    user.email = data.user.email;
    user.isEmailVerified = data.user.isEmailVerified;
    await this._userRepository.update(data.id, user);
    const updatedUser = await this.find(data.id);
    return updatedUser;
  }

  public async updatePassword(data: { id: string; password: string }): Promise<boolean> {
    const user = new UserEntity();
    user.password = data.password;
    const updateOperation = await this._userRepository.update(data.id, user);
    return isNotNil(updateOperation.affected);
  }

  public async remove(id: string): Promise<void> {
    const options = { where: { id } };
    const possibleUser = await this._userRepository.findOne(options);
    if (isNil(possibleUser)) {
      throw new NotFoundException('Not possible to complete the operation');
    }
    await this._userRepository.delete(id);
  }
}
