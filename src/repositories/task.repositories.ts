import { Task, ITask, TaskPriority } from '../models/task.model';
import { Types } from 'mongoose';
export interface ITaskCreationData {
  title: string;
  description?: string;
  dueDate?: Date;
  priority?: TaskPriority;
}

// Interface for the data used to update a task
export interface ITaskUpdateData {
  title?: string;
  description?: string;
  isCompleted?: boolean;
  dueDate?: Date;
  priority?: TaskPriority;
}

// Interface for filtering tasks
export interface ITaskFilters {
  isCompleted?: boolean;
}

// Interface for sorting tasks
export interface ITaskSortOptions {
  [key: string]: 'asc' | 'desc' | 1 | -1;
}


export class TaskRepository {
  /**
   * Creates a new task for a specific user.
   * @param userId - The ID of the user creating the task.
   * @param taskData - The data for the new task.
   * @returns The created task document.
   */
  public async create(userId: string | Types.ObjectId, taskData: ITaskCreationData): Promise<ITask> {
    const newTask = new Task({
      ...taskData,
      user: userId, // Assign the user ID
      // isCompleted will default to false, priority will default to MEDIUM as per schema
    });
    return newTask.save();
  }

  /**
   * @param taskId - The ID of the task.
   * @param userId - The ID of the user who owns the task.
   * @returns The task document if found and belongs to the user, otherwise null.
   */
  public async findByIdAndUser(taskId: string | Types.ObjectId, userId: string | Types.ObjectId): Promise<ITask | null> {
    return Task.findOne({ _id: taskId, user: userId }).exec();
  }

  /**
   * @param userId - The ID of the user.
   * @param filters - Optional filters (e.g., { isCompleted: true }).
   * @param sortOptions - Optional sorting options (e.g., { dueDate: 'asc' }).
   * @returns A list of task documents.
   */
  public async findAllByUserId(
    userId: string | Types.ObjectId,
    filters?: ITaskFilters,
    sortOptions?: ITaskSortOptions
  ): Promise<ITask[]> {
    const queryConditions: any = { user: userId };

    if (filters) {
      if (typeof filters.isCompleted === 'boolean') {
        queryConditions.isCompleted = filters.isCompleted;
      }
      // Add more filter conditions here if needed
    }

    let query = Task.find(queryConditions);

    if (sortOptions) {
      query = query.sort(sortOptions);
    } else {
      // Default sort: by creation date, newest first
      query = query.sort({ createdAt: -1 });
    }

    return query.exec();
  }

  /**
   * Updates a task by its ID, ensuring it belongs to the specified user.
   * @param taskId - The ID of the task to update.
   * @param userId - The ID of the user who owns the task.
   * @param updateData - The fields to update.
   * @returns The updated task document if found and updated, otherwise null.
   */
  public async updateByIdAndUser(
    taskId: string | Types.ObjectId,
    userId: string | Types.ObjectId,
    updateData: ITaskUpdateData
  ): Promise<ITask | null> {
    return Task.findOneAndUpdate(
      { _id: taskId, user: userId }, // Ensure the task belongs to the user
      updateData,
      { new: true } // Returns the updated document
    ).exec();
  }

  /**
   * Deletes a task by its ID, ensuring it belongs to the specified user.
   * This is a hard delete.
   * @param taskId - The ID of the task to delete.
   * @param userId - The ID of the user who owns the task.
   * @returns The deleted task document if found and deleted, otherwise null.
   */
  public async deleteByIdAndUser(taskId: string | Types.ObjectId, userId: string | Types.ObjectId): Promise<ITask | null> {
    return Task.findOneAndDelete({ _id: taskId, user: userId }).exec();
  }
}