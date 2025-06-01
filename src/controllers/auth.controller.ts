import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import SignUpResponseDto from '../dto/responses/signup.response.dto';
import LoginResponseDto from '../dto/responses/login.response.dto';
import LogoutResponseDto from '../dto/responses/logout.response.dto';

export class AuthController {
  private authService = new AuthService();

  public async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;
      const { user, session } = await this.authService.signup(name, email, password);

      new SignUpResponseDto(res, 'Signup successful', session, user.name);
    } catch (err) {
      next(err);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const { user, session } = await this.authService.login(email, password);
      new LoginResponseDto(res, 'Login successful', session, user.name);
    } catch (err) {
      next(err);
    }
  }

  public async logout(req: Request, res: Response, next: NextFunction) {
    try {
      if (!res.locals.token) throw new Error('Missing token');

      const token = res.locals.token;

      await this.authService.logout(token);
      new LogoutResponseDto(res, 'Logout successful');
    } catch (err) {
      next(err);
    }
  }
}
