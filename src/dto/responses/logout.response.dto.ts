// src/dtos/responses/logout.response.dto.ts
import { Response } from 'express';
import BaseResponseDto from './base.response.dto';

export default class LogoutResponseDto extends BaseResponseDto {
  constructor(res: Response, message: string) {
    super(res, 200, 'OK', message, null);
  }
}
