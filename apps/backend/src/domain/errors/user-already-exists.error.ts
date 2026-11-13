import { Email } from '../value-objects/email.value-object.js';
import { DomainError } from './domain.error.js';

export class UserAlreadyExistsError extends DomainError {
  constructor(email: Email) {
    super(`User with email ${email} already exists`);
    this.name = 'UserAlreadyExistsError';
  }
}
