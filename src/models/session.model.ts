import { Schema, model, Types } from 'mongoose';

export interface ISession {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  token: string;
  expiresAt: Date;
  logoutAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    logoutAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const Session = model<ISession>('Session', sessionSchema);
