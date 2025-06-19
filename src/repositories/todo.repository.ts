import { Todo, ITodo } from '../databases/models/todo.model';
import { Types } from 'mongoose';

export class TodoRepository {
  // Create new todo
  public async create(todoData: Partial<ITodo>): Promise<ITodo> {
    const todo = new Todo(todoData);
    return todo.save();
  }

  // Find todo by ID
  public async findById(todoId: string | Types.ObjectId): Promise<ITodo | null> {
    return Todo.findById(todoId).exec();
  }

  // Find todos by userId (optional: filter by completed, or exclude deleted)
  public async findByUserId(
    userId: string | Types.ObjectId,
    options?: { completed?: boolean; includeDeleted?: boolean }
  ): Promise<ITodo[]> {
    const query: any = { userId };
    if (options?.completed !== undefined) {
      query.completed = options.completed;
    }
    if (!options?.includeDeleted) {
      query.deletedAt = null;
    }
    return Todo.find(query).exec();
  }

  // Update todo by ID
  public async updateById(todoId: string | Types.ObjectId, updateData: Partial<ITodo>): Promise<ITodo | null> {
    return Todo.findByIdAndUpdate(todoId, updateData, { new: true }).exec();
  }

  // Soft delete todo by setting deletedAt
  public async softDelete(todoId: string | Types.ObjectId): Promise<ITodo | null> {
    return Todo.findByIdAndUpdate(todoId, { deletedAt: new Date() }, { new: true }).exec();
  }

  // Mark todo as completed/uncompleted
  public async setCompleted(todoId: string | Types.ObjectId, completed: boolean): Promise<ITodo | null> {
    return Todo.findByIdAndUpdate(todoId, { completed }, { new: true }).exec();
  }
}
