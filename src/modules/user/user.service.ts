import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { isNil, pickBy } from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user-dto';
import { CreateUserDto } from './dto/create-user-dto';
import { UuidService } from 'src/shared/services/uuid/uuid.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly _userRepository: Repository<UserEntity>,
    private readonly _uuidService: UuidService,
  ) {}

  public async createOne(data: { user: CreateUserDto; password: string }): Promise<UserEntity> {
    const uuid = this._uuidService.generateUuid();
    const userObj = new UserEntity(uuid, data.user.name, data.user.email, data.password, new Date(), new Date());
    const possibleUser = await this._userRepository.save(userObj);
    if (!possibleUser) {
      throw new HttpException('User not created', 500);
    }
    return possibleUser;
  }

  public async getOne(id: string): Promise<UserEntity> {
    const options = { where: { id } };
    const possibleUser = await this._userRepository.findOne(options);
    if (!possibleUser) {
      throw new NotFoundException('User not found 1');
    }
    return possibleUser;
  }

  public async getOneByEmail(email: string): Promise<UserEntity> {
    const options = { where: { email } };
    const possibleUser = await this._userRepository.findOne(options);
    if (!possibleUser) {
      throw new NotFoundException('User not found 2');
    }
    return possibleUser;
  }

  public async updateOne(data: { id: string; user: UpdateUserDto }): Promise<UserEntity> {
    const user = new UpdateUserDto(data.user.name, data.user.email);
    const options = { where: { id: data.id } };
    const possibleUser = await this._userRepository.findOne(options);
    if (!possibleUser) {
      throw new NotFoundException('User not found 4');
    }
    await this._userRepository.update(data.id, user);
    const updated = pickBy({ ...possibleUser, ...user }, value => !isNil(value));
    return updated as object as UserEntity;
  }

  public async deleteOne(id: string): Promise<boolean> {
    const options = { where: { id } };
    const possibleUser = await this._userRepository.findOne(options);
    if (!possibleUser) {
      throw new NotFoundException('User not found 5');
    }
    return isNil(possibleUser);
  }
}
