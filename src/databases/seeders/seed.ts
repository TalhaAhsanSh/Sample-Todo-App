import { connectDB, disconnectDB } from '../../config/db.config';
import { seedUsers } from './user.seeder';
import { seedTodos } from './todo.seeder';
import RedisClient from '../../lib/redis_client';

const seed = async () => {
  console.log('🚀 Starting seeding...');

  try {
    await connectDB();
    const redis = RedisClient.getInstance();

    console.log('\n👤 Seeding users...');
    const users = await seedUsers();

    console.log('\n📦 Caching user data in Redis...');
    for (const user of users) {
      await redis.set(`user:${user._id}:email`, user.email);
    }

    console.log('\n📝 Seeding todos...');
    await seedTodos(users);

    await redis.set('app:totalSeededUsers', users.length.toString());

    console.log('\n🎉 Seeding completed!');
    await disconnectDB();
    console.log('🏁 Finished seeding process.');

    process.exit(0); // ✅ Success
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    await disconnectDB();
    process.exit(1); // ❌ Failure
  }
};

seed();
