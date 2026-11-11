import { hash as argon2Hash, verify as argon2Verify } from 'argon2';
import { IPasswordHasher } from '../../domain/interfaces/password-hasher.interfaces.js';

export class Argon2PasswordHasher implements IPasswordHasher {
  async hash(plainPassword: string): Promise<string> {
    const result = await argon2Hash(plainPassword);
    return result;
  }

  async verify(plainPassword: string, hashedValue: string): Promise<boolean> {
    return await argon2Verify(hashedValue, plainPassword);
  }
}
