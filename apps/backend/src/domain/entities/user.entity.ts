import { Email } from '../value-objects/email.value-object.js';

export type Clock = () => Date;

export const MAX_FAILED_LOGIN_ATTEMPTS = 5;
export const LOCK_DURATION_MS = 30 * 60 * 1000; // 30 minutos

export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: Email,
    public passwordHash: string,
    public avatarUrl: string | null,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public readonly termsAcceptedAt: Date,
    public failedLoginAttempts: number = 0,
    public lockedUntil: Date | null = null,
  ) {}

  updateProfile(newName: string, newAvatarUrl: string): void {
    if (newName.trim() === '') throw new Error('Name cannot be empty');
    this.name = newName;

    this.avatarUrl =
      newAvatarUrl && newAvatarUrl.trim() !== ''
        ? newAvatarUrl
        : '/defaults/default-avatar.png';
  }

  isLocked(clock: Clock = () => new Date()): boolean {
    if (!this.lockedUntil) {
      return false;
    }

    const now = clock().getTime();
    const lockExpiresAt = this.lockedUntil.getTime();

    if (now >= lockExpiresAt) {
      this.failedLoginAttempts = 0;
      this.lockedUntil = null;
      return false;
    }

    return true;
  }

  recordFailedLogin(clock: Clock = () => new Date()): void {
    const now = clock();

    if (this.lockedUntil && now.getTime() >= this.lockedUntil.getTime()) {
      this.failedLoginAttempts = 0;
      this.lockedUntil = null;
    }

    this.failedLoginAttempts += 1;
    this.updatedAt = now;

    if (this.failedLoginAttempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
      this.lockedUntil = new Date(now.getTime() + LOCK_DURATION_MS);
    }
  }

  recordSuccessfulLogin(clock: Clock = () => new Date()): void {
    const now = clock();
    this.failedLoginAttempts = 0;
    this.lockedUntil = null;
    this.updatedAt = now;
  }
}
