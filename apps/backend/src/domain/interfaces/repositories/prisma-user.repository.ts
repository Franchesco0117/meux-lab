import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../user-repository.interface.js';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service.js';
import { User } from '../../entities/user.entity.js';
import { Email } from '../../value-objects/email.value-object.js';
import { toDomain, toPersistence } from './user.mapper.js';
import { UserAlreadyExistsError } from '../../errors/user-already-exists.error.js';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const row = await this.prisma.user.findUnique({ where: { id } });
    return row ? toDomain(row) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const emailString = email.value;

    const rawUser = await this.prisma.user.findUnique({
      where: { email: emailString },
    });
    return rawUser ? toDomain(rawUser) : null;
  }

  async save(user: User): Promise<void> {
    const { id, ...data } = toPersistence(user);
    try {
      await this.prisma.user.upsert({
        where: { id },
        create: { id, ...data },
        update: data,
      });
    } catch (error) {
      if (isUniqueViolation(error))
        throw new UserAlreadyExistsError(user.email);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.deleteMany({ where: { id } });
  }
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'P2002'
  );
}
