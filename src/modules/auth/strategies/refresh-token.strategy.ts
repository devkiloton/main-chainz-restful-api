import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { UserPayload } from 'src/types/user-payload';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env['JWT_SECRET'],
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: UserPayload): UserPayload & { refreshToken: string | null } {
    const refreshToken = req.get('Authorization')?.replace('Bearer', '').trim() ?? null;
    return { ...payload, refreshToken };
  }
}
