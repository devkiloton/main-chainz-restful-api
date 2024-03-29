import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { isNotNil } from 'ramda';
import { UserPayload } from 'src/types/user-payload';
import { UserReq } from 'src/types/user-req';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  constructor(private readonly _jwtService: JwtService) {
    super();
  }

  override async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest<UserReq>();
    const access_token = this._tokenExtractor(request);
    if (!access_token) {
      throw new UnauthorizedException('Not authorized');
    }

    try {
      const payload: UserPayload = await this._jwtService.verifyAsync(access_token);
      request.user = payload;
      if (!payload.isEmailVerified) {
        throw new UnauthorizedException('Not authorized');
      }
    } catch (error) {
      throw new UnauthorizedException('Not authorized');
    }

    return super.canActivate(context);
  }

  private _tokenExtractor(request: Request): string | undefined {
    const authorization = request.headers.authorization;
    const [bearer, token] = authorization?.split(' ') ?? [];
    return bearer === 'Bearer' && isNotNil(token) ? token : undefined;
  }
}
