import {
  TaskRepository,
  ITaskCreationData,
  ITaskUpdateData,
  ITaskFilters,
  ITaskSortOptions,
} from '../repositories/task.repositories';
import { ITask, TaskPriority } from '../models/task.model';
import { ItemNotFoundError, ForbiddenError, BadRequestError /* */ } from '../error/custom_error.error';
import { Types } from 'mongoose';

export class TaskService {
  private taskRepository = new TaskRepository();

  async createTask(userId: string, taskData: ITaskCreationData): Promise<ITask> {
    if (!Types.ObjectId.isValid(userId)) {
        throw new ForbiddenError('Invalid user ID format for task creation.'); 
    }
    return this.taskRepository.create(userId, taskData);
  }
  async getTaskById(userId: string, taskId: string): Promise<ITask> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(taskId)) {
        throw new ForbiddenError('Invalid user or task ID format.'); 
    }

    const task = await this.taskRepository.findByIdAndUser(taskId, userId);
    if (!task) {
      throw new ItemNotFoundError(`Task with ID ${taskId} not found or you do not have permission to view it.`);
    }
    return task;
  }

  /**
   * Retrieves all tasks for a given user, with optional filtering and sorting.
   */
  async getAllUserTasks(
    userId: string,
    queryParams: { isCompleted?: string; priority?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }
  ): Promise<ITask[]> {
    if (!Types.ObjectId.isValid(userId)) {
        throw new ForbiddenError('Invalid user ID format.'); // Or BadRequestError
    }

    const filters: ITaskFilters = {};
    if (queryParams.isCompleted !== undefined) {
      filters.isCompleted = queryParams.isCompleted === 'true';
    }


    const sortOptions: ITaskSortOptions = {};
    if (queryParams.sortBy) {
      sortOptions[queryParams.sortBy] = queryParams.sortOrder === 'desc' ? -1 : 1;
    } else {
      sortOptions.createdAt = -1; 
    }

    return this.taskRepository.findAllByUserId(userId, filters, sortOptions);
  }


  async updateTask(
    userId: string,
    taskId: string,
    updateData: ITaskUpdateData
  ): Promise<ITask> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(taskId)) {
        throw new ForbiddenError('Invalid user or task ID format.'); // Or BadRequestError
    }

    if (Object.keys(updateData).length === 0) {
        throw new ForbiddenError('No update data provided.'); // Or your custom BadRequestError
    }

    const updatedTask = await this.taskRepository.updateByIdAndUser(taskId, userId, updateData);
    if (!updatedTask) {
      throw new ItemNotFoundError(`Task with ID ${taskId} not found or you do not have permission to update it.`);
    }
    return updatedTask;
  }


  async deleteTask(userId: string, taskId: string): Promise<void> {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(taskId)) {
        throw new ForbiddenError('Invalid user or task ID format.'); // Or BadRequestError
    }

    const deletedTask = await this.taskRepository.deleteByIdAndUser(taskId, userId);
    if (!deletedTask) {
      throw new ItemNotFoundError(`Task with ID ${taskId} not found or you do not have permission to delete it.`);
    }
  }
}