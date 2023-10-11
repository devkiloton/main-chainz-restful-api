import { Body, Controller, Delete, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordHashingPipe } from 'src/resources/pipes/password-hashing.pipe';
import { Response } from 'src/types/response';
import { UserEntity } from './entities/user.entity';
import { AuthorizationGuard } from 'src/shared/guards/authorization.guard';
import { UserReq } from 'src/types/user-req';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('/user')
@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Post()
  public async create(
    @Body()
    user: CreateUserDto,
    @Body('password', PasswordHashingPipe)
    password: string,
  ): Promise<Response<UserEntity & { access_token: string }>> {
    const possibleUser = await this._userService.create({ user, password });
    return {
      message: 'User created successfully',
      data: { ...possibleUser.entity, access_token: possibleUser.access_token },
    };
  }

  @UseGuards(AuthorizationGuard)
  @Get('me')
  public async find(
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
  public async update(
    @Req()
    req: UserReq,
    @Body()
    user: UpdateUserDto,
  ): Promise<Response<UserEntity>> {
    const possibleUser = await this._userService.update({ id: req.user.sub, user });
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
  public async delete(
    @Req()
    req: UserReq,
  ): Promise<Response<void>> {
    await this._userService.remove(req.user.sub);
    return {
      message: 'User deleted successfully',
    };
  }
}
