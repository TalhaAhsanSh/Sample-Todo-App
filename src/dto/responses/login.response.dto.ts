import { Response } from 'express';
import BaseResponseDto from './base.response.dto';
import { ISession } from '../../databases/models/session.model';

export default class LoginResponseDto extends BaseResponseDto {
  constructor(res: Response, message: string, session: ISession, name: string) {
    super(res, 200, 'OK', message, {
      token: session.token,
      expiresAt: session.expiresAt,
      logoutAt: session.logoutAt,
      userId: session.userId,
      name,
    });
  }
}
