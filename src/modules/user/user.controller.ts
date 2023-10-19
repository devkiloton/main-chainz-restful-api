import { Body, Controller, Delete, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordHashingPipe } from 'src/resources/pipes/password-hashing.pipe';
import { Response } from 'src/types/response';
import { UserEntity } from './entities/user.entity';
import { UserReq } from 'src/types/user-req';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard';

@ApiTags('/user')
@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  public async find(
    @Req()
    req: UserReq,
  ): Promise<Response<UserEntity>> {
    const id = req.user.sub;
    const possibleUser = await this._userService.find(id);
    return {
      message: 'User retrieved successfully',
      data: possibleUser,
    };
  }

  @UseGuards(AccessTokenGuard)
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

  @UseGuards(AccessTokenGuard)
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

  @UseGuards(AccessTokenGuard)
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
