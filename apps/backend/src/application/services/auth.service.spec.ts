import { User } from '../../domain/entities/user.entity.js';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error.js';
import { UserAlreadyExistsError } from '../../domain/errors/user-already-exists.error.js';
import { WeakPasswordError } from '../../domain/errors/weak-password.error.js';
import { IPasswordHasher } from '../../domain/interfaces/password-hasher.interfaces.js';
import { ITokenService } from '../../domain/interfaces/token.service.interface.js';
import { IUserRepository } from '../../domain/interfaces/user-repository.interface.js';
import { Email } from '../../domain/value-objects/email.value-object.js';
import {
  AuthService,
  type IAuthUserReader,
  type IPasswordVerifier,
  type UserRecordForAuth,
} from './auth.service.js';

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

  async verify(plainPassword: string, hashedValue: string): Promise<boolean> {
    return hashedValue === `hashed_${plainPassword}`;
  }
}

class FakeAuthUserReader implements IAuthUserReader {
  private readonly records = new Map<string, UserRecordForAuth>();

  setUser(record: UserRecordForAuth): void {
    this.records.set(record.email.value, record);
  }

  async findByEmail(email: Email): Promise<UserRecordForAuth | null> {
    return this.records.get(email.value) ?? null;
  }
}

class FakePasswordVerifier implements IPasswordVerifier {
  async verify(plainPassword: string, hashedValue: string): Promise<boolean> {
    return hashedValue === `hashed_${plainPassword}`;
  }
}

class FakeTokenService implements ITokenService {
  async signAccessToken(payload: {
    sub: string;
    email: string;
  }): Promise<string> {
    return `token_for_${payload.sub}_${payload.email}`;
  }

  async verifyAccessToken(_token: string) {
    return { sub: 'user-1', email: 'user@mail.com' };
  }
}

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: InMemoryUserRepository;
  let passwordHasher: FakePasswordHasher;
  let userReader: FakeAuthUserReader;
  let passwordVerifier: FakePasswordVerifier;
  let tokenService: FakeTokenService;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    passwordHasher = new FakePasswordHasher();
    userReader = new FakeAuthUserReader();
    passwordVerifier = new FakePasswordVerifier();
    tokenService = new FakeTokenService();

    authService = new AuthService(
      userRepository,
      passwordHasher,
      userReader,
      passwordVerifier,
      tokenService,
    );
  });

  describe('register', () => {
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

  describe('login', () => {
    it('returns accessToken and user info when credentials are valid', async () => {
      const email = Email.create('login@mail.com');
      const hashedPassword = await passwordHasher.hash('secretpass123');

      userReader.setUser({
        id: 'user-10',
        name: 'Login User',
        email,
        passwordHash: hashedPassword,
      });

      const result = await authService.login({
        email: 'LOGIN@mail.com',
        password: 'secretpass123',
      });

      expect(result.accessToken).toBe('token_for_user-10_login@mail.com');
      expect(result.user.id).toBe('user-10');
      expect(result.user.name).toBe('Login User');
      expect(result.user.email.value).toBe('login@mail.com');
    });

    it('throws InvalidCredentialsError and still verifies against dummy hash when user does not exist', async () => {
      const verifySpy = vi.spyOn(passwordVerifier, 'verify');

      await expect(
        authService.login({
          email: 'missing@mail.com',
          password: 'AnyPassword123',
        }),
      ).rejects.toThrow(InvalidCredentialsError);

      expect(verifySpy).toHaveBeenCalledTimes(1);
      expect(verifySpy).toHaveBeenCalledWith(
        'AnyPassword123',
        expect.stringContaining('$argon2id$'),
      );
    });

    it('throws InvalidCredentialsError when password is incorrect', async () => {
      const email = Email.create('login@mail.com');
      const hashedPassword = await passwordHasher.hash('secretpass123');

      userReader.setUser({
        id: 'user-10',
        name: 'Login User',
        email,
        passwordHash: hashedPassword,
      });

      await expect(
        authService.login({
          email: 'login@mail.com',
          password: 'WongPassword123',
        }),
      ).rejects.toThrow(InvalidCredentialsError);
    });
  });
});
