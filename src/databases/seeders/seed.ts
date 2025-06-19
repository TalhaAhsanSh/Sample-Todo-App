import { connectDB, disconnectDB } from '../../config/db.config';
import { seedUsers } from './user.seeder';
import { seedTodos } from './todo.seeder';

const seed = async () => {
  console.log('🚀 Starting seeding...');

  try {
    await connectDB();

    console.log('\n👤 Seeding users...');
    const users = await seedUsers();

    console.log('\n📝 Seeding todos...');
    await seedTodos(users);

    console.log('\n🎉 Seeding completed!');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await disconnectDB();
    console.log('🏁 Finished seeding process.');
  }
};

seed();
