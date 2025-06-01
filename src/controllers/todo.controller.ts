// src/controllers/todo.controller.ts
import { Request, Response, NextFunction } from 'express';
import { TodoService } from '../services/todo.service';
import AddTaskResponseDto from '../dto/responses/addTask.response.dto';

export class TodoController {
  private todoService = new TodoService();

  public async addTask(req: Request, res: Response, next: NextFunction) {
    try {
        if(!res.locals.token) throw new Error('Missing token')
        const userId = res.locals.user;
        const { task } = req.body;

        const todo = await this.todoService.createTask(userId, task);

        new AddTaskResponseDto(res, 'Task added successfully', todo);
    } catch (error) {
      next(error);
    }
  }
}
