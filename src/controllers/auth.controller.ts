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

  public async verifyEmail(req: Request, res: Response, next: NextFunction) {
      try {
        const { token } = req.params;   `21`

        console.log("Token -> ", token)
        await this.authService.verifyEmailToken(token); 
              const successHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verified!</title>
            <style>
                body {
                    height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important;
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    background-color: #7A70F1; /* Same purple background as your nice email */
                    display: flex; align-items: center; justify-content: center; min-height: 100vh;
                }
                .message-container {
                    max-width: 420px;
                    margin: 20px;
                    background-color: #ffffff;
                    border-radius: 16px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    overflow: hidden;
                    text-align: center;
                }
                .top-accent-bar {
                    background-color: #E6E0FF; /* Light purple accent */
                    height: 80px; /* Adjusted height */
                }
                .icon-container {
                    margin-top: -40px; /* Pull icon up */
                    position: relative;
                    z-index: 2;
                }
                .icon-container img { /* Assuming you might want a success icon */
                    width: 80px; /* Adjust size */
                    height: auto;
                    border-radius: 50%;
                    background-color: #ffffff;
                    padding: 8px;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                }
                 .icon-container .success-checkmark { /* Example for a simple checkmark */
                    font-size: 50px;
                    color: #28a745;
                    background-color: #ffffff;
                    border-radius: 50%;
                    padding: 10px;
                    display: inline-block;
                    line-height: 1;
                    width: 70px; /* Adjust size of circle */
                    height: 70px; /* Adjust size of circle */
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                    display: flex; align-items: center; justify-content: center; margin:0 auto;
                }
                .message-header h1 {
                    margin: 0; font-size: 22px; font-weight: 600; color: #33334D;
                    padding: 20px 25px 10px 25px;
                }
                .message-body p {
                    padding: 0px 35px 20px 35px; font-size: 15px; line-height: 1.6; color: #6A737C; margin:0 0 15px 0;
                }
                .login-button-container {
                    padding: 10px 20px 30px 20px;
                }
                .login-button {
                    background-color: #007bff; /* Or your primary button color */
                    color: #ffffff !important;
                    padding: 12px 30px;
                    text-decoration: none !important;
                    display: inline-block;
                    border-radius: 25px;
                    font-size: 16px;
                    font-weight: 500;
                    border: none;
                    cursor: pointer;
                }
            </style>
        </head>
        <body>
            <div class="message-container">
                <div class="top-accent-bar"></div>
                <div class="icon-container">
                    <div class="success-checkmark">✔</div>
                </div>
                <div class="message-header">
                    <h1>Email Verified Successfully!</h1>
                </div>
                <div class="message-body">
                    <p>Thank you! Your email address has been confirmed.</p>
                    <p>You can now log in to your account and enjoy all the features of TODO App.</p>
                </div>
                <div class="login-button-container">
                    <a href="${process.env.FRONTEND_URL || process.env.APP_URL || '#'}/login" class="login-button">Proceed to Login</a>
                </div>
            </div>
        </body>
        </html>
      `;
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(successHtml);

      } catch (error) {
        next(error);
      }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      console.log('[AuthController] Login attempt. Email:', email, 
        '- Password received in controller:', password , 'A password was received');
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
