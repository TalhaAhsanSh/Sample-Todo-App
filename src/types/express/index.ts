// src/types/express/index.d.ts
import { IUser } from '../../models/user.model';

declare global {
  namespace Express {
    export interface Request {
      user?: IUser; // Adds 'user' to the Request interface
    }
  }
}


export {};