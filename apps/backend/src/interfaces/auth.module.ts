import { Module } from '@nestjs/common';
import { AuthService } from '../application/services/auth.service.js';
import { IPasswordHasher } from '../domain/interfaces/password-hasher.interfaces.js';
import { PrismaUserRepository } from '../domain/interfaces/repositories/prisma-user.repository.js';
import { IUserRepository } from '../domain/interfaces/user-repository.interface.js';
import { PrismaService } from '../infrastructure/prisma/prisma.service.js';
import { Argon2PasswordHasher } from '../infrastructure/security/argon2-password-hasher.js';
import { PASSWORD_HASHER, USER_REPOSITORY } from './auth.tokens.js';
import { AuthController } from './controllers/auth.controller.js';

@Module({
  controllers: [AuthController],
  providers: [
    PrismaService,
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
    { provide: PASSWORD_HASHER, useClass: Argon2PasswordHasher },
    {
      provide: AuthService,
      useFactory: (users: IUserRepository, hasher: IPasswordHasher) =>
        new AuthService(users, hasher),
      inject: [USER_REPOSITORY, PASSWORD_HASHER],
    },
  ],
})
export class AuthModule {}
