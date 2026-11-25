import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../application/services/auth.service.js';
import {
  PASSWORD_HASHER,
  type IPasswordHasher,
} from '../domain/interfaces/password-hasher.interfaces.js';
import {
  TOKEN_SERVICE,
  type ITokenService,
} from '../domain/interfaces/token.service.interface.js';
import {
  USER_REPOSITORY,
  type IUserRepository,
} from '../domain/interfaces/user-repository.interface.js';
import { PrismaUserRepository } from '../domain/interfaces/repositories/prisma-user.repository.js';
import { Argon2PasswordHasher } from '../infrastructure/security/argon2-password-hasher.js';
import {
  JWT_TOKEN_OPTIONS,
  JwtTokenService,
} from '../infrastructure/jwt-token.service.js';
import { PrismaService } from '../infrastructure/prisma/prisma.service.js';
import { AuthController } from './controllers/auth.controller.js';
import { CookieAuthGuard } from '../guards/cookie-auth.guard.js';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    PrismaService,
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
    { provide: PASSWORD_HASHER, useClass: Argon2PasswordHasher },
    {
      provide: JWT_TOKEN_OPTIONS,
      useFactory: () => {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
          throw new Error('JWT_SECRET no está configurado');
        }
        return {
          secret,
          expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as '15m',
        };
      },
    },
    JwtTokenService,
    { provide: TOKEN_SERVICE, useExisting: JwtTokenService },
    CookieAuthGuard,
    {
      provide: AuthService,
      useFactory: (
        users: IUserRepository,
        hasher: IPasswordHasher,
        tokenService: ITokenService,
      ) => new AuthService(users, hasher, users, hasher, tokenService),
      inject: [USER_REPOSITORY, PASSWORD_HASHER, TOKEN_SERVICE],
    },
  ],
  exports: [AuthService, TOKEN_SERVICE],
})
export class AuthModule {}
