import mongoose, { Schema, Document, Types, model } from 'mongoose';

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface ITask extends Document {
  title: string;
  description?: string; 
  isCompleted: boolean;
  dueDate?: Date;      
  priority: TaskPriority; 
  user: Types.ObjectId; 
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Task title is required.'],
      trim: true, 
      minlength: [3, 'Task title must be at least 3 characters long.'],
      maxlength: [150, 'Task title cannot exceed 150 characters.'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Task description cannot exceed 1000 characters.'],
      default: '',
    },
    isCompleted: {
      type: Boolean,
      default: false, // New tasks are not completed by default
    },
    dueDate: {
      type: Date,
      optional: true, // Explicitly stating it's optional (though lack of 'required' implies it)
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority), 
      default: TaskPriority.MEDIUM,    
    },
    user: { 
      type: Schema.Types.ObjectId,
      ref: 'User', 
      required: [true, 'Task must belong to a user.'],
      index: true, 
    },
  },
  {
    timestamps: true, 
  }
);


// Mongoose will create a collection named 'tasks' (pluralized, lowercase version of 'Task')
export const Task = model<ITask>('Task', taskSchema);