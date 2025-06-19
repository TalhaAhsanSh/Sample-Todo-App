import { User } from '../models/user.model';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

export const seedUsers = async () => {
  console.log('🌱 Seeding Users...');
  const users = [];

  const password = await bcrypt.hash('Test1234', 10);

  for (let i = 0; i < 10; i++) {
    users.push({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password,
    });
  }

  const createdUsers = await User.insertMany(users);
  console.log(`✅ Created ${createdUsers.length} users`);
  return createdUsers;
};
