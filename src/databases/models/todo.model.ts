import { Schema, model, Types } from 'mongoose';

export interface ITodo{
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  task: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

const todoSchema = new Schema<ITodo>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    task: { type: String, required: true },
    completed: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export const Todo = model<ITodo>('Todo', todoSchema);
