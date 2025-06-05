// src/middlewares/isVerified.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/user.model'; // Adjust path if your IUser is elsewhere, but this is likely correct
import { ForbiddenError } from '../error/custom_error.error'; // Make sure ForbiddenError is exported from this path
import { UserRepository } from '../repositories/user.repository';

export const isVerified = async (req: Request, res: Response, next: NextFunction) => {
  const user = await new UserRepository().findById(res.locals.user) // Assumes req.user is populated by your authenticate.middleware.ts

  if (!user) {
    // This should ideally be caught by authenticate.middleware.ts first
    return next(new ForbiddenError('Authentication required. Please log in.'));
  }

  if (!user?.isVerified) {
    return next(new ForbiddenError('Access denied. Please verify your email address to access this resource.'));
  }

  next(); // User is authenticated and verified, proceed
};