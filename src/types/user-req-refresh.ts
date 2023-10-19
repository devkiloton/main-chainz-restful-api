import { Request } from 'express';
import { UserPayload } from './user-payload';

export type UserReqRefresh = Request & { user: UserPayload & { refreshToken: string } };
