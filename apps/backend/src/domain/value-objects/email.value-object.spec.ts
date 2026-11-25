import { describe, it, expect } from 'vitest';
import { Email } from './email.value-object.js';

describe('Email', () => {
  it('remove spaces and convert to lowercase', () => {
    const email = Email.create('  usER@mail.cOm    ');

    expect(email.value).toBe('user@mail.com');
  });

  it('accept a normal email without alteration', () => {
    const email = Email.create('user@mail.com');

    expect(email.value);
  });

  it('reject email without the @ symbol', () => {
    expect(() => Email.create('usermail.com')).toThrow('Invalid Email');
  });

  it('reject email without a period after the @ symbol', () => {
    expect(() => Email.create('user@mailcom')).toThrow('Invalid Email');
  });

  it('reject empty email', () => {
    expect(() => Email.create('   ')).toThrow('Invalid Email');
  });

  it('reject email with only spaces', () => {
    expect(() => Email.create('')).toThrow('Invalid Email');
  });

  it('two emails written with diferent capitalization produce the same value', () => {
    const emailOne = Email.create('USeR@mAIl.cOm');
    const emailTwo = Email.create('user@mail.com');

    expect(emailOne.value == emailTwo.value).toBe(true);
  });
});
