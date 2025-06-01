import { Response } from 'express';
import BaseResponseDto from './base.response.dto';

interface IUserProfile {
  id: string;
  name: string;
  email: string;
}

export default class UserProfileResponseDto extends BaseResponseDto {
  constructor(res: Response, message: string, user: IUserProfile) {
    super(res, 200, 'OK', message, user);
  }
}
