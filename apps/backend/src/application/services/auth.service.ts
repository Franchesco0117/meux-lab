import { randomUUID } from 'crypto';
import { User } from '../../domain/entities/user.entity.js';
import { IUserRepository } from '../../domain/interfaces/user-repository.interface.js';
import { IPasswordHasher } from '../../domain/interfaces/password-hasher.interfaces.js';
import { RegisterDto } from '../../domain/dtos/register.dto.js';
import { Email } from '../../domain/value-objects/email.value-object.js';
import { WeakPasswordError } from '../../domain/errors/weak-password.error.js';
import { UserAlreadyExistsError } from '../../domain/errors/user-already-exists.error.js';

export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
  ) {}

  async register(dto: RegisterDto): Promise<User> {
    const normalized = Email.create(dto.email);
    const existing = await this.userRepository.findByEmail(normalized);

    if (dto.password.length < 8) {
      throw new WeakPasswordError(
        'Password must be at least 8 characters long',
      );
    }

    const hashedPassword = await this.passwordHasher.hash(dto.password);

    if (existing) {
      throw new UserAlreadyExistsError(normalized);
    }

    const id = randomUUID();
    const avatarUrl = 'default-avatar.png';
    const createdAt = new Date();
    const updatedAt = new Date();
    const termsAcceptedAt = new Date();

    const register = new User(
      id,
      dto.name,
      normalized,
      hashedPassword,
      avatarUrl,
      createdAt,
      updatedAt,
      termsAcceptedAt,
    );
    await this.userRepository.save(register);

    return register;
  }
}
