import { Request } from 'express';
import { UserPayload } from './user-payload';

export type UserReq = Request & { user: UserPayload };
