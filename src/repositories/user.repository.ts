import { User, IUser } from '../models/user.model';
import { Types } from 'mongoose';

export class UserRepository {
  // Create new user
  public async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return user.save();
  }

  // Find user by ID
  public async findById(userId: string | Types.ObjectId): Promise<IUser | null> {
    return User.findById(userId).exec();
  }

  // Find user by Email
   public async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email: email.toLowerCase() })
               .select('+password') // <-- ADD THIS LINE
               .exec();
  }

  // Update user by ID
  public async updateById(userId: string | Types.ObjectId, updateData: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(userId, updateData, { new: true }).exec();
  }

  // Soft delete user by setting deletedAt
  public async softDelete(userId: string | Types.ObjectId): Promise<IUser | null> {
    return User.findByIdAndUpdate(userId, { deletedAt: new Date() }, { new: true }).exec();
  }

  // List all users (optional: filter by active only)
  public async listAll(activeOnly = true): Promise<IUser[]> {
    const query = activeOnly ? { deletedAt: null } : {};
    return User.find(query).exec();
  }
}
