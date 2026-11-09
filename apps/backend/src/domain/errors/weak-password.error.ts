export class WeakPasswordError extends Error {
  constructor(message: string = 'Password must be at least 8 characters long') {
    super(message);
    this.name = 'WeakPasswordError';
  }
}
