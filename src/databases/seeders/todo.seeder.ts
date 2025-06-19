import { Todo } from '../models/todo.model';
import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';
import { IUser } from '../models/user.model';

export const seedTodos = async (users: IUser[]) => {
  console.log('🌱 Seeding Todos...');

  const todos = [];

  for (const user of users) {
    const todoCount = faker.number.int({ min: 2, max: 5 });
    for (let i = 0; i < todoCount; i++) {
      todos.push({
        userId: user._id as Types.ObjectId,
        task: faker.lorem.sentence(),
        completed: faker.datatype.boolean(),
      });
    }
  }

  const createdTodos = await Todo.insertMany(todos);
  console.log(`✅ Created ${createdTodos.length} todos`);
};
