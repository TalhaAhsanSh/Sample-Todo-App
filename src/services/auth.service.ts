import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository';
import { SessionRepository } from '../repositories/session.repository';
import { ConflictError, UnauthorizedError } from '../error/custom_error.error';
import { User, IUser } from '../models/user.model'; 
import { ISession } from '../models/session.model';
import { Types } from 'mongoose';
import { sendEmail } from '../utils/emailsender';
import { BadRequestError } from '../error/custom_error.error';
import crypto from 'crypto';


export class AuthService {
  private userRepo = new UserRepository();
  private sessionRepo = new SessionRepository();

  public async signup(name: string, email: string, password: string): Promise<{ user: IUser; session: ISession }> {
    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // --- Generate Email Verification Token and Expiry ---
    const verificationToken = crypto.randomBytes(32).toString('hex');
    // Token expires in 5 min
   const verificationTokenExpires = new Date(Date.now() + 3600000);
    // ----------------------------------------------------
    const userDataToCreate = {
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires,
    };
    console.log('Data being passed to userRepo.create:', userDataToCreate);
    
    const user = await this.userRepo.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires,
    });
    try{
      const verificationURL = `${process.env.APP_URL}/api/auth/verify-email/${user.verificationToken}`;
      const emailHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body {
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; /* Common fallback fonts */
            background-color: #7A70F1; /* Purple background like the example */
        }
        .email-wrapper {
            padding: 40px 10px; /* More padding around the card */
        }
        .email-container {
            max-width: 420px; /* Narrower card */
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px; /* More rounded corners */
            overflow: hidden; /* Important for border-radius */
            box-shadow: 0 10px 25px rgba(0,0,0,0.1); /* Softer shadow */
        }
        .top-accent-bar { /* This will be the top colored section */
            background-color: #E6E0FF; /* Light purple accent, or image */
            height: 100px; /* Adjust height as needed */
            text-align: center; /* To help center content if any is placed here */
            /* FOR A WAVY EFFECT (like your example image):
            You would ideally use a background image for this cell:
            background-image: url('https://your-host.com/wavy-background.png');
            background-repeat: no-repeat;
            background-size: cover; 
            background-position: center bottom;
            */
        }
        .icon-container {
            text-align: center;
            padding: 0px 20px 0px 20px; /* No top padding, icon will overlap slightly */
            margin-top: -45px; /* Pulls the icon up to overlap the accent bar */
            position: relative; /* For z-index if needed, though might not work in all clients */
            z-index: 2;
        }
        .icon-container img {
            width: 90px;  /* Adjust to your GIF's ideal size */
            height: auto; /* Maintain aspect ratio */
            border-radius: 50%; /* Make it circular if the GIF is suitable */
            background-color: #ffffff; /* White background for the icon 'bubble' */
            padding: 8px; /* Padding around the icon inside its 'bubble' */
            box-shadow: 0 4px 10px rgba(0,0,0,0.1); /* Shadow for the icon 'bubble' */
        }
        .email-header {
            text-align: center;
            padding: 20px 25px 10px 25px; /* Adjusted padding */
        }
        .email-header h1 {
            margin: 0;
            font-size: 22px;
            font-weight: 600;
            color: #33334D; /* Dark purple/blue text */
        }
        .email-body {
            padding: 0px 35px 20px 35px; /* More horizontal padding */
            font-size: 14px;
            line-height: 1.6;
            color: #6A737C; /* Softer grey text */
            text-align: center;
        }
        .email-body p {
            margin: 0 0 10px 0;
        }
        .button-container {
            text-align: center;
            padding: 15px 20px 30px 20px;
        }
        .verify-button {
            background-color: #52B9FF; /* Light blue button like example */
            color: #ffffff !important;
            padding: 12px 35px; /* Adjust padding */
            text-decoration: none !important;
            display: inline-block;
            border-radius: 25px; /* Pill shape */
            font-size: 15px;
            font-weight: 500; /* Medium weight */
            border: none;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(82,185,255,0.3); /* Subtle shadow for button */
        }
        .link-fallback { /* For "Didn't get e-mail? Send it again" - not directly applicable here but good for UI */
            font-size: 13px;
            color: #7A70F1; /* Purple link */
            text-align: center;
            padding: 0 20px 25px 20px;
            text-decoration: none;
        }
        .link-fallback a {
            color: #7A70F1;
            text-decoration: none;
            font-weight: 500;
        }
         .email-footer { /* Not present in the example UI, can be removed or kept minimal */
            text-align: center;
            padding: 15px;
            font-size: 11px;
            color: #AEB8C4;
        }
    </style>
</head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #7A70F1; margin: 0 !important; padding: 0 !important;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-wrapper">
        <tr>
            <td style="padding: 40px 10px;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="420" class="email-container" style="max-width: 420px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); overflow: hidden; border: 1px solid #dee2e6;">
                    <tr>
                        <td class="top-accent-bar" style="background-color: #E6E0FF; height: 100px; text-align: center;">
                            </td>
                    </tr>
                    <tr>
                        <td class="icon-container" style="text-align: center; padding: 0px 20px 0px 20px; margin-top: -45px; position: relative; z-index: 2;">
                            <img src="https://i.postimg.cc/CLQnwNsF/You-ve-You-Mail.gif" alt="Verify Email" style="width: 90px; height: auto; border-radius: 50%; background-color: #ffffff; padding: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                        </td>
                    </tr>
                    <tr>
                        <td class="email-header" style="text-align: center; padding: 20px 25px 10px 25px;">
                            <h1 style="margin: 0; font-size: 22px; font-weight: 600; color: #33334D;">Check your inbox, please!</h1>
                        </td>
                    </tr>
                    <tr>
                        <td class="email-body" style="padding: 0px 35px 20px 35px; font-size: 14px; line-height: 1.6; color: #6A737C; text-align: center;">
                            <p style="margin: 0 0 10px 0;">Hey ${user.name}, to start using TODO App, we need to verify your email. We've already sent out the verification link.</p>
                            <p style="margin: 0 0 20px 0;">Please check it and confirm it's really you.</p>
                        </td>
                    </tr>
                    <tr>
                        <td class="button-container" style="text-align: center; padding: 15px 20px 30px 20px;">
                            <a href="${verificationURL}" target="_blank" class="verify-button" style="background-color: #52B9FF; color: #ffffff !important; padding: 12px 35px; text-decoration: none !important; display: inline-block; border-radius: 25px; font-size: 15px; font-weight: 500; border: none; box-shadow: 0 2px 5px rgba(82,185,255,0.3); cursor: pointer;">Sure! (Verify Now)</a>
                        </td>
                    </tr>
                    <tr>
                         <td class="link-fallback" style="font-size: 13px; color: #7A70F1; text-align: center; padding: 0 20px 25px 20px; text-decoration: none;">
                            <a href="${verificationURL}" target="_blank" style="color: #7A70F1; text-decoration: none; font-weight:500;">Or click here if the button doesn't work</a>
                        </td>
                    </tr>
                     <tr>
                        <td class="email-footer" style="text-align: center; padding: 15px; font-size: 11px; color: #AEB8C4;">
                            This link will expire based on token settings.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
    await sendEmail({
      to: user.email,
      subject: "Comfirm Your Email - Practice TODO ",
      html: emailHTML,
    });
    console.log(`Verification email sent to ${user.email}. Token: ${user.verificationToken}`);
    } catch (emailError) {
      console.error(`Failed to send verification email to ${user.email} during signup:`, emailError);
    }
    const session = await this.createSession(user._id!);

    return { user, session };
  }

  public async login(email: string, password: string): Promise<{ user: IUser; session: ISession }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new UnauthorizedError('Invalid credentials');

    //  Add check for verified email during login ---
    if (!user.isVerified) {
      throw new UnauthorizedError('Please verify your email address before logging in.');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedError('Invalid credentials');
    const session = await this.createSession(user._id!);
    return { user, session };
  }
  public async logout(token: string): Promise<void> {
    const session = await this.sessionRepo.findByToken(token);
    if (!session) throw new UnauthorizedError('Invalid session token');

    await this.sessionRepo.updateLogout(session._id!, new Date());
  }
  private async createSession(userId: Types.ObjectId): Promise<ISession> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hrs

    return this.sessionRepo.add({
      userId,
      token,
      expiresAt,
      logoutAt: null,
    });
  }
  public async verifyEmailToken(token: string): Promise<void> {
    // if token is not given
    if (!token) {
      throw new BadRequestError('Verification token is required.');
    } 


    // check the token is not expired
    const user = await User.findOne({ 
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() } 
    });

    if (!user) {
      // Token is invalid, not found, or expired
      throw new BadRequestError('Invalid or expired verification token. Please try registering again or request a new verification email.');
    }
    user.isVerified = true;
    user.verificationToken = undefined; 
    user.verificationTokenExpires = undefined;

    await user.save(); 
    console.log(`Email verified for user: ${user.email}`);
  }
}
