import { Response } from 'express';

export default class BaseResponseDto {
  constructor(
    protected res: Response,
    protected statusCode: number,
    protected status: 'OK' | 'FAIL',
    protected message: string,
    protected data?: any
  ) {
    this.send();
  }

  private send() {
    const responseBody: any = {
      status: this.status,
      statusCode: this.statusCode,
      message: this.message,
    };

    if (this.data !== null && this.data !== undefined) {
      responseBody.data = this.data;
    }

    this.res.status(this.statusCode).json(responseBody);
  }
}
