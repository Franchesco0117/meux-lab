import { Argon2PasswordHasher } from './argon2-password-hasher.js';

describe('Argon2PasswordHasher', () => {
  let argon2PasswordHasher: Argon2PasswordHasher;

  beforeEach(() => {
    argon2PasswordHasher = new Argon2PasswordHasher();
  });

  it('the transformed result is not the same as the original and has an expected prefix', async () => {
    const raw = 'my-password';
    const result = await argon2PasswordHasher.hash(raw);

    expect(result).not.toBe(raw);
    expect(result.startsWith('$argon2id$')).toBe(true);
  });

  it('two transformations of the same text are different (simulating a single salt)', async () => {
    const raw = 'my-password';
    const firstAttempt = await argon2PasswordHasher.hash(raw);
    const secondAttempt = await argon2PasswordHasher.hash(raw);

    expect(firstAttempt).not.toBe(secondAttempt);
  });

  it('the verification passes with the correct text', async () => {
    const raw = 'my-password';
    const hashed = await argon2PasswordHasher.hash(raw);

    const isValid = await argon2PasswordHasher.verify(raw, hashed);
    expect(isValid).toBe(true);
  });

  it('the verification fails if the text is incorrect', async () => {
    const raw = 'my-password';
    const hashed = await argon2PasswordHasher.hash(raw);

    const isValid = await argon2PasswordHasher.verify('false-password', hashed);
    expect(isValid).toBe(false);
  });
});
