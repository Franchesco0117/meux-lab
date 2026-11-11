import { User } from '../../entities/user.entity.js';
import { Email } from '../../value-objects/email.value-object.js';

export interface UserRow {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  termsAcceptedAt: Date;
}

export function toDomain(row: UserRow): User {
  const email = Email.create(row.email);

  return new User(
    row.id,
    row.name,
    email,
    row.passwordHash,
    row.avatarUrl ?? null,
    row.createdAt,
    row.updatedAt,
    row.termsAcceptedAt,
  );
}

export function toPersistence(user: User): UserRow {
  return {
    id: user.id,
    name: user.name,
    email: user.email.value,
    passwordHash: user.passwordHash,
    avatarUrl: user.avatarUrl ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    termsAcceptedAt: user.termsAcceptedAt,
  };
}
