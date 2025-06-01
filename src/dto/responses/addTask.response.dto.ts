// src/dtos/responses/addTask.response.dto.ts
import { Response } from 'express';
import BaseResponseDto from './base.response.dto';
import { ITodo } from '../../models/todo.model';

export default class AddTaskResponseDto extends BaseResponseDto {
  constructor(res: Response, message: string, todo: ITodo) {
    super(res, 201, 'OK', message, {
      id: todo._id,
      task: todo.task,
      completed: todo.completed,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    });
  }
}
