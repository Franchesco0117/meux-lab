import { DomainError } from './domain.error.js';

export class AccountLockedError extends DomainError {
  public readonly lockedUntil: Date | null;

  constructor(
    lockedUntil: Date | null = null,
    message = 'Account temporarily locked due to too many failed login attempts',
  ) {
    super(message);
    this.name = 'AccountLockedError';
    this.lockedUntil = lockedUntil;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
