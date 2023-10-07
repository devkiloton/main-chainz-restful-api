import { Body, Controller, Delete, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
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
  public async createOne(
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
  @Get('me')
  public async findMe(
    @Req()
    req: UserReq,
  ): Promise<Response<UserEntity>> {
    const id = req.user.sub;
    const possibleUser = await this._userService.findMe(id);
    return {
      message: 'User retrieved successfully',
      data: possibleUser,
    };
  }

  @UseGuards(AuthorizationGuard)
  @Patch()
  public async updateOne(
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
  @Patch('update-password')
  public async updatePassword(
    @Req()
    req: UserReq,
    @Body()
    _dto: UpdatePasswordDto,
    @Body('password', PasswordHashingPipe)
    password: string,
  ): Promise<Response<void>> {
    await this._userService.updatePassword({ id: req.user.sub, password });
    return {
      message: 'Password changed successfully',
    };
  }

  @UseGuards(AuthorizationGuard)
  @Delete()
  public async deleteOne(
    @Req()
    req: UserReq,
  ): Promise<Response<void>> {
    await this._userService.removeOne(req.user.sub);
    return {
      message: 'User deleted successfully',
    };
  }
}
