import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { AuthRepository } from './auth.repository';
import { UserEntity } from './entities/user.entity';
import { v4 as uuid } from 'uuid';
import { UpdateUserDto } from './dto/update-user-dto';
import { PublicUserDto } from './dto/public-user-dto';
import { Response } from '../types/response';

@Controller('auth')
export class AuthController {
  constructor(private readonly _walletService: AuthRepository) {}

  @Post()
  public async createOneUser(@Body() user: CreateUserDto): Promise<Response<PublicUserDto>> {
    const userObj = new UserEntity(user.name, user.email, user.password, new Date(), uuid());
    await this._walletService.createOne(userObj);
    return {
      message: 'User created successfully',
      data: new PublicUserDto(userObj.name, userObj.email, userObj.id),
    };
  }

  @Get('/:id')
  public async getOneUser(@Param('id') id: string): Promise<Response<PublicUserDto>> {
    const user = await this._walletService.getOne(id);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    return {
      message: 'User retrieved successfully',
      data: new PublicUserDto(user.name, user.email, user.id),
    };
  }

  @Patch('/:id')
  public async updateOneUser(@Body() user: UpdateUserDto, @Param('id') id: string): Promise<Response<PublicUserDto>> {
    const userObj = new UpdateUserDto(user.name, user.email);
    const userUpdated = await this._walletService.updateOne({ id, user: userObj });

    if (!userUpdated) {
      throw new HttpException('User not found', 404);
    }
    return {
      message: 'User updated successfully',
      data: new PublicUserDto(userUpdated.name, userUpdated.email, id),
    };
  }

  @Delete('/:id')
  public async deleteOneUser(@Param('id') id: string): Promise<Response<null>> {
    const result = await this._walletService.deleteOne(id);

    if (!result) {
      throw new HttpException('User not found', 404);
    }
    return {
      message: 'User deleted successfully',
    };
  }
}
