import { DomainError } from './domain.error.js';

export class WeakPasswordError extends DomainError {
  constructor(message: string = 'Password must be at least 8 characters long') {
    super(message);
    this.name = 'WeakPasswordError';
  }
}
