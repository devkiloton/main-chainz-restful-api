import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user-dto';
import { PasswordHashingPipe } from 'src/resources/pipes/password-hashing.pipe';
import { Response } from 'src/types/response';
import { UserEntity } from './entities/user.entity';
import { AuthorizationGuard } from 'src/shared/guards/authorization.guard';
import { UserReq } from 'src/types/user-req';
import { UpdatePasswordDto } from './dto/update-password-dto';

@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Post()
  public async createOneUser(
    @Body()
    user: CreateUserDto,
    @Body('password', PasswordHashingPipe)
    password: string,
  ): Promise<Response<UserEntity>> {
    const possibleUser = await this._userService.createOne({ user, password });
    return {
      message: 'User created successfully',
      data: possibleUser,
    };
  }

  @UseGuards(AuthorizationGuard)
  @Get(':id')
  public async getOneUser(
    @Param('id')
    id: string,
  ): Promise<Response<UserEntity>> {
    const possibleUser = await this._userService.getOne(id);
    return {
      message: 'User retrieved successfully',
      data: possibleUser,
    };
  }

  @UseGuards(AuthorizationGuard)
  @Get(':email')
  public async getOneUserByEmail(
    @Param('email')
    email: string,
  ): Promise<Response<UserEntity>> {
    const possibleUser = await this._userService.getOneByEmail(email);
    return {
      message: 'User retrieved successfully',
      data: possibleUser,
    };
  }

  @UseGuards(AuthorizationGuard)
  @Patch()
  public async updateOneUser(
    @Req()
    req: UserReq,
    @Body()
    user: UpdateUserDto,
  ): Promise<Response<UserEntity>> {
    const possibleUser = await this._userService.updateOne({ id: req.user.sub, user });
    return {
      message: 'User updated successfully',
      data: possibleUser,
    };
  }

  @UseGuards(AuthorizationGuard)
  @Patch('change-password')
  public async changePassword(
    @Req()
    req: UserReq,
    @Body()
    _dto: UpdatePasswordDto,
    @Body('password', PasswordHashingPipe)
    password: string,
  ): Promise<Response<void>> {
    await this._userService.changePassword({ id: req.user.sub, password });
    return {
      message: 'Password changed successfully',
    };
  }

  @UseGuards(AuthorizationGuard)
  @Delete()
  public async deleteOneUser(
    @Req()
    req: UserReq,
  ): Promise<Response<void>> {
    await this._userService.deleteOne(req.user.sub);
    return {
      message: 'User deleted successfully',
    };
  }
}
