import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository';
import { SessionRepository } from '../repositories/session.repository';
import { ConflictError, UnauthorizedError } from '../error/custom_error.error';
import { IUser } from '../models/user.model';
import { ISession } from '../models/session.model';
import { Types } from 'mongoose';
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
    const user = await this.userRepo.create({
      name,
      email,
      password: hashedPassword,
    });

    const session = await this.createSession(user._id!);

    return { user, session };
  }

  public async login(email: string, password: string): Promise<{ user: IUser; session: ISession }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new UnauthorizedError('Invalid credentials');

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
}
