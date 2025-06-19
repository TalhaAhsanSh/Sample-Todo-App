import { Session, ISession } from '../databases/models/session.model';
import { Types } from 'mongoose';

export class SessionRepository {
  // Add a new session
  public async add(sessionData: Partial<ISession>): Promise<ISession> {
    const session = new Session(sessionData);
    return session.save();
  }

  // Update logoutAt by session _id
  public async updateLogout(sessionId: string | Types.ObjectId, logoutAt = new Date()): Promise<ISession | null> {
    return Session.findByIdAndUpdate(
      sessionId,
      { logoutAt },
      { new: true }
    ).exec();
  }

  // Find session by token
  public async findByToken(token: string): Promise<ISession | null> {
    return Session.findOne({ token }).exec();
  }

  // Find session by session _id
  public async findById(sessionId: string | Types.ObjectId): Promise<ISession | null> {
    return Session.findById(sessionId).exec();
  }

  // Find all sessions by userId (optional: active sessions only)
  public async findByUserId(userId: string | Types.ObjectId, onlyActive = false): Promise<ISession[]> {
    const query: any = { userId };
    if (onlyActive) {
      query.logoutAt = null;
      query.expiresAt = { $gt: new Date() };
    }
    return Session.find(query).exec();
  }
}
