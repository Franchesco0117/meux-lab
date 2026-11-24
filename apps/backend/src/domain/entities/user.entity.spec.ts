import { describe, expect, it } from 'vitest';
import { Email } from '../value-objects/email.value-object.js';
import {
  LOCK_DURATION_MS,
  MAX_FAILED_LOGIN_ATTEMPTS,
  User,
} from './user.entity.js';

function createUser(baseDate: Date): User {
  return new User(
    'user-1',
    'Usuario Prueba',
    Email.create('usuario@correo.com'),
    'hashed_password',
    null,
    baseDate,
    baseDate,
    baseDate,
  );
}

describe('User login lockout', () => {
  it('blocks the account after 5 consecutive failed login attempts', () => {
    let currentTime = new Date('2026-11-23T18:00:00.000Z');
    const clock = () => currentTime;
    const user = createUser(currentTime);

    for (let i = 1; i < MAX_FAILED_LOGIN_ATTEMPTS; i++) {
      user.recordFailedLogin(clock);
      expect(user.failedLoginAttempts).toBe(i);
      expect(user.isLocked(clock)).toBe(false);
      expect(user.lockedUntil).toBeNull();
    }

    //5to intento fallido
    user.recordFailedLogin(clock);

    expect(user.failedLoginAttempts).toBe(5);
    expect(user.isLocked(clock)).toBe(true);
    expect(user.lockedUntil).toEqual(
      new Date(currentTime.getTime() + LOCK_DURATION_MS),
    );
  });

  it('rejects access while locked even when password verification succeeds', () => {
    let currentTime = new Date('2026-11-23T18:00:00.000Z');
    const clock = () => currentTime;
    const user = createUser(currentTime);

    for (let i = 0; i < MAX_FAILED_LOGIN_ATTEMPTS; i++) {
      user.recordFailedLogin(clock);
    }

    // Avanza 10 minutos (sigue dentro de los 30 min de bloqueo)
    currentTime = new Date(currentTime.getTime() + 10 * 60 * 1000);

    const passwordIsValid = true; // simulando contraseña correcta
    const canLogin = passwordIsValid && !user.isLocked(clock);

    expect(canLogin).toBe(false);
    expect(user.isLocked(clock)).toBe(true);
  });

  it('unlocks automatically after 30 minutes', () => {
    let currentTime = new Date('2026-11-23T18:00:00.000Z');
    const clock = () => currentTime;
    const user = createUser(currentTime);

    for (let i = 0; i < MAX_FAILED_LOGIN_ATTEMPTS; i++) {
      user.recordFailedLogin(clock);
    }

    expect(user.isLocked(clock)).toBe(true);

    // Avanza exactamente 30 minutos
    currentTime = new Date(currentTime.getTime() + LOCK_DURATION_MS);

    expect(user.isLocked(clock)).toBe(false);
    expect(user.failedLoginAttempts).toBe(0);
    expect(user.lockedUntil).toBeNull();
  });

  it('resets failed attempts counter on a succesful login', () => {
    let currentTime = new Date('2026-11-23T18:00:00.000Z');
    const clock = () => currentTime;
    const user = createUser(currentTime);

    user.recordFailedLogin(clock);
    user.recordFailedLogin(clock);
    user.recordFailedLogin(clock);
    expect(user.failedLoginAttempts).toBe(3);

    currentTime = new Date(currentTime.getTime() + 2 * 60 * 1000);
    user.recordSuccessfulLogin(clock);

    expect(user.failedLoginAttempts).toBe(0);
    expect(user.lockedUntil).toBeNull();
    expect(user.isLocked(clock)).toBe(false);
    expect(user.updatedAt).toEqual(currentTime);
  });
});
