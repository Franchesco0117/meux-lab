import { Email } from '../value-objects/email.value-object.js';

export class UserAlreadyExistsError extends Error {
  constructor(email: Email) {
    super(`User with email ${email} already exists`);
    this.name = 'UserAlreadyExistsError';
  }
}
