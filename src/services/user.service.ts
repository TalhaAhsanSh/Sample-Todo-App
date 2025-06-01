// src/services/auth.service.ts
import { UserRepository } from '../repositories/user.repository';
import { ItemNotFoundError } from '../error/custom_error.error';

export class UserService {
  private userRepo = new UserRepository();

  public async getUserById(userId: string) {

    const user = await this.userRepo.findById(userId);

    if (!user) throw new ItemNotFoundError('User not found');

    return {
        id: user._id,
        name: user.name,
        email: user.email,
    };
  }
}
