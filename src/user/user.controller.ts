import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user-dto';
import { PublicUser } from './models/public-user';
import { Response } from '../types/response';
import { PasswordHashingPipe } from 'src/resources/pipes/password-hashing.pipe';

@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Post()
  public async createOneUser(
    @Body() user: CreateUserDto,
    @Body('password', PasswordHashingPipe) hashedPassword: string,
  ): Promise<Response<PublicUser>> {
    const possibleUser = await this._userService.createOne({ user, hashedPassword });
    return {
      message: 'User created successfully',
      data: new PublicUser(possibleUser.name, possibleUser.email, possibleUser.id),
    };
  }

  @Get(':id')
  public async getOneUser(@Param('id') id: string): Promise<Response<PublicUser>> {
    const user = await this._userService.getOne(id);
    return {
      message: 'User retrieved successfully',
      data: new PublicUser(user.name, user.email, user.id),
    };
  }

  @Get(':email')
  public async getOneUserByEmail(@Param('email') email: string): Promise<Response<PublicUser>> {
    const user = await this._userService.getOneByEmail(email);
    return {
      message: 'User retrieved successfully',
      data: new PublicUser(user.name, user.email, user.id),
    };
  }

  @Patch(':id')
  public async updateOneUser(@Body() user: UpdateUserDto, @Param('id') id: string): Promise<Response<PublicUser>> {
    const userUpdated = await this._userService.updateOne({ id, user });
    return {
      message: 'User updated successfully',
      data: new PublicUser(userUpdated.name, userUpdated.email, id),
    };
  }

  @Delete(':id')
  public async deleteOneUser(@Param('id') id: string): Promise<Response<void>> {
    await this._userService.deleteOne(id);
    return {
      message: 'User deleted successfully',
    };
  }
}
