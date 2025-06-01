import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import UserProfileResponseDto from '../dto/responses/userProfile.response.dto';
import { BadRequestError } from '../error/custom_error.error';

export class UserController {
  private userService = new UserService();

  private checkToken(res: Response) {
    if (!res.locals.token) {
      throw new BadRequestError('Missing token');
    }
  }

  private sendUserProfile(res: Response, user: any, message = 'User profile fetched successfully') {
    new UserProfileResponseDto(res, message, user);
  }

  public async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      this.checkToken(res);
      const userId = res.locals.user;
      const user = await this.userService.getUserById(userId);
      this.sendUserProfile(res, user);
    } catch (err) {
      next(err);
    }
  }

  public async getUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      this.checkToken(res);
      const userId = req.query.userId as string;
      const user = await this.userService.getUserById(userId);
      this.sendUserProfile(res, user);
    } catch (err) {
      next(err);
    }
  }
}
