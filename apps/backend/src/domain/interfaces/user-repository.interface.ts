import { User } from '../entities/user.entity.js';
import { Email } from '../value-objects/email.value-object.js';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  fingByEmail(email: Email): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}
