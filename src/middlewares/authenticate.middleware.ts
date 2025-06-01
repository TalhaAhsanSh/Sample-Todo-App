import { Request, Response, NextFunction } from 'express';
import { SessionRepository } from '../repositories/session.repository';
import { UnauthorizedError } from '../error/custom_error.error';

const sessionRepo = new SessionRepository();

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token sent - this API does not require token, so proceed
      return next();
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const session = await sessionRepo.findByToken(token);

    if (
      !session ||
      session.logoutAt !== null ||
      session.expiresAt < new Date()
    ) {
      throw new UnauthorizedError('Invalid or expired token');
    }

    // Save userId in res.locals for downstream handlers
    res.locals.user = session.userId;
    res.locals.token = token;

    next();
  } catch (err) {
    next(err);
  }
}
