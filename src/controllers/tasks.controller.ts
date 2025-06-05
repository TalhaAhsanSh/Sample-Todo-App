// src/controllers/task.controller.ts
import { Request, Response, NextFunction } from 'express';
import { TaskService } from '../services/task.services'; 
import { IUser } from '../models/user.model';

export class TaskController {
  private taskService = new TaskService();

  public async createTask(req: Request, res: Response, next: NextFunction): Promise<void> { // <-- ADDED : Promise<void>
    try {
      const user = res.locals.user;
      console.log("User->: ",user);
      if (!user || !user._id) {
        res.status(401).json({ message: 'Authentication required.' });
        return; 
      }
      const userId = user._id.toString();
      const { title, description, dueDate, priority } = req.body;
      if (!title) {
        res.status(400).json({ message: 'Title is required.' });
        return; // Explicitly return
      }
      const taskData = { title, description, dueDate, priority };
      const newTask = await this.taskService.createTask(userId, taskData);
      res.status(201).json({ message: 'Task created successfully', data: newTask });
    } catch (error) {
      next(error);
    }
  }

  public async getAllUserTasks(req: Request, res: Response, next: NextFunction): Promise<void> { // <-- ADDED : Promise<void>
    try {
      const user = res.locals.user as IUser;
       if (!user || !user._id) {
       res.status(401).json({ message: 'Authentication required.' });
        return;
      }
      const userId = user._id.toString();
      const { isCompleted, priority, sortBy, sortOrder } = req.query as {
        isCompleted?: string;
        priority?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
      };
      
      const queryParams = { isCompleted, priority, sortBy, sortOrder };
      const tasks = await this.taskService.getAllUserTasks(userId, queryParams);

      res.status(200).json({ message: 'Tasks retrieved successfully', data: tasks });
    } catch (error) {
      next(error);
    }
  }

  public async getTaskById(req: Request, res: Response, next: NextFunction): Promise<void> { // <-- ADDED : Promise<void>
    try {
      const user = res.locals.user  as IUser;
      if (!user || !user._id) {
        res.status(401).json({ message: 'Authentication required.' });
        return;
      }
      const userId = user._id.toString();
      const { taskId } = req.params;

      const task = await this.taskService.getTaskById(userId, taskId);
      res.status(200).json({ message: 'Task retrieved successfully', data: task });
    } catch (error) {
      next(error);
    }
  }

  public async updateTask(req: Request, res: Response, next: NextFunction): Promise<void> { // <-- ADDED : Promise<void>
    try {
      const user = res.locals.user  as IUser;
      if (!user || !user._id) {
        res.status(401).json({ message: 'Authentication required.' });
        return;
      }
      const userId = user._id.toString();
      const { taskId } = req.params;
      const updateData = req.body;
      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ message: 'No update data provided.' });
        return;
      }

      const updatedTask = await this.taskService.updateTask(userId, taskId, updateData);
      res.status(200).json({ message: 'Task updated successfully', data: updatedTask });
    } catch (error) {
      next(error);
    }
  }

  public async deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> { // <-- ADDED : Promise<void>
    try {
      const user = res.locals.user  as IUser;
      if (!user || !user._id) {
        res.status(401).json({ message: 'Authentication required.' });
        return;
      }
      const userId = user._id.toString();
      const { taskId } = req.params;
      await this.taskService.deleteTask(userId, taskId);
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}