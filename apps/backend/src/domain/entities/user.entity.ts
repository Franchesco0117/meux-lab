import { Email } from '../value-objects/email.value-object.js';

export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: Email,
    public passwordHash: string,
    public avatarUrl: string,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public readonly termsAcceptedAt: Date,
  ) {}

  updateProfile(newName: string, newAvatarUrl: string): void {
    if (newName.trim() === '') throw new Error('Name cannot be empty');
    this.name = newName;

    this.avatarUrl =
      newAvatarUrl && newAvatarUrl.trim() !== ''
        ? newAvatarUrl
        : '/defaults/default-avatar.png';
  }
}
