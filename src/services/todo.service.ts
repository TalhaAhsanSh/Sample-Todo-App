import { Types } from 'mongoose';
import { TodoRepository } from '../repositories/todo.repository';

export class TodoService {
  private todoRepo = new TodoRepository();

  public async createTask(userId: Types.ObjectId, task: string) {
    const todo = await this.todoRepo.create({
      userId,
      task,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return todo;
  }
}
