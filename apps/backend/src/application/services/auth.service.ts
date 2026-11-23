import { randomUUID } from 'crypto';
import { User } from '../../domain/entities/user.entity.js';
import { IUserRepository } from '../../domain/interfaces/user-repository.interface.js';
import { IPasswordHasher } from '../../domain/interfaces/password-hasher.interfaces.js';
import { RegisterDto } from '../../domain/dtos/register.dto.js';
import { Email } from '../../domain/value-objects/email.value-object.js';
import { WeakPasswordError } from '../../domain/errors/weak-password.error.js';
import { UserAlreadyExistsError } from '../../domain/errors/user-already-exists.error.js';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error.js';
import type { ITokenService } from '../../domain/interfaces/token.service.interface.js';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: Email;
  };
}

// Hash Argon2 pregenerado de relleno para ejecutar verificación cuando el usuario no existe
const DUMMY_ARGON2_HASH =
  '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$Rdesc4AwUComCpXJwbhiFg';

export interface UserRecordForAuth {
  id: string;
  name: string;
  email: Email;
  passwordHash: string;
}

export interface IAuthUserReader {
  findByEmail(email: Email): Promise<UserRecordForAuth | null>;
}

export interface IPasswordVerifier {
  verify(plainPassword: string, hash: string): Promise<boolean>;
}

export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,

    private readonly userReader: IAuthUserReader,
    private readonly passwordVerifier: IPasswordVerifier,
    private readonly tokenService: ITokenService,
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

  async login(input: LoginInput): Promise<LoginOutput> {
    const normalized = Email.create(input.email);
    const user = await this.userReader.findByEmail(normalized);

    const hashToVerift = user ? user.passwordHash : DUMMY_ARGON2_HASH;
    const isPasswordValid = await this.passwordVerifier.verify(
      input.password,
      hashToVerift,
    );

    if (!user || !isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const accessToken = await this.tokenService.signAccessToken({
      sub: user.id,
      email: user.email.value,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
