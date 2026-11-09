import { User } from '../../domain/entities/user.entity.js';
import { UserAlreadyExistsError } from '../../domain/errors/user-already-exists.error.js';
import { WeakPasswordError } from '../../domain/errors/weak-password.error.js';
import { IPasswordHasher } from '../../domain/interfaces/password-hasher.interfaces.js';
import { IUserRepository } from '../../domain/interfaces/user-repository.interface.js';
import { Email } from '../../domain/value-objects/email.value-object.js';
import { AuthService } from './auth.service.js';

class InMemoryUserRepository implements IUserRepository {
  private readonly users = new Map<string, User>();

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email.value === email.value) {
        return user;
      }
    }

    return null;
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id, user);
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }
}

class FakePasswordHasher implements IPasswordHasher {
  async hash(plainPassword: string): Promise<string> {
    return `hashed_${plainPassword}`;
  }

  async compare(plainPassword: string, hashedValue: string): Promise<boolean> {
    return hashedValue === `hashed_${plainPassword}`;
  }
}

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: InMemoryUserRepository;
  let passwordHasher: FakePasswordHasher;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    passwordHasher = new FakePasswordHasher();
    authService = new AuthService(userRepository, passwordHasher);
  });

  it('registers a valid user correctly', async () => {
    const result = await authService.register({
      name: 'user',
      email: 'user@mail.com',
      password: 'SuperSecure123',
    });

    expect(result).toBeDefined();
    expect(result.email.value).toBe('user@mail.com');
    expect(result.name).toBe('user');
  });

  it('saves the normalized email', async () => {
    await authService.register({
      name: 'Test User',
      email: 'TEST.User@MaiL.COM',
      password: 'SecurePassword123',
    });

    const savedUser = await userRepository.findByEmail({
      value: 'test.user@mail.com',
    } as any);
    expect(savedUser).not.toBeNull();
    expect(savedUser?.email.value).toBe('test.user@mail.com');
  });

  it('the saved password in the repository isnt plain text', async () => {
    const rawPassword = 'SecurePassword123';

    await authService.register({
      name: 'Secure User',
      email: 'secure@mail.com',
      password: rawPassword,
    });

    const savedUser = await userRepository.findByEmail({
      value: 'secure@mail.com',
    } as any);

    expect(savedUser).not.toBeNull();
    expect(savedUser?.passwordHash).not.toBe(rawPassword);
    expect(savedUser?.passwordHash).toBe(`hashed_${rawPassword}`);
  });

  it('deny duplicate email, even if capitalization is different', async () => {
    const dto = {
      name: 'First User',
      email: 'duplicate@mail.com',
      password: 'SecurePassword123',
    };

    await authService.register(dto);

    await expect(
      authService.register({
        name: 'Second User',
        email: 'DUPLICATE@mail.com',
        password: 'AnotherPassword456',
      }),
    ).rejects.toThrow(UserAlreadyExistsError);
  });

  it('reject a password that does not meet the minimum length policy', async () => {
    await expect(
      authService.register({
        name: 'Short Pass User',
        email: 'short@mail.com',
        password: '123',
      }),
    ).rejects.toThrow(WeakPasswordError);
  });
});
