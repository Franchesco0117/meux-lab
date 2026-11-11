import { User } from '../../entities/user.entity.js';
import { Email } from '../../value-objects/email.value-object.js';
import { toDomain, toPersistence, UserRow } from './user.mapper.js';

describe('UserRow', () => {
  it('a null column in the database is correctly transformed into its empty equivalent in the entity', () => {
    const rawDataFromDb: UserRow = {
      id: 'uuid-123',
      name: 'User1',
      email: 'usER@mail.cOm',
      passwordHash: 'password123',
      avatarUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      termsAcceptedAt: new Date(),
    };

    const domainEntity = toDomain(rawDataFromDb);

    expect(domainEntity.avatarUrl).toBeNull();
  });

  it('an empty field in the entity is converted to null in the database', () => {
    const email = Email.create('usER@mail.cOm');
    const domainEntity = new User(
      'uuid-123',
      'User1',
      email,
      'password123',
      null,
      new Date(),
      new Date(),
      new Date(),
    );

    const rawPersistenceData = toPersistence(domainEntity);
    expect(rawPersistenceData.avatarUrl).toBeNull();
  });

  it('complex value objects are reconstructed with the expected value', () => {
    const rawDataFromDb: UserRow = {
      id: 'uuid-123',
      name: 'User1',
      email: 'usER@mail.cOm',
      passwordHash: 'password123',
      avatarUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      termsAcceptedAt: new Date(),
    };

    const domainEntity = toDomain(rawDataFromDb);

    expect(domainEntity.email.value).toBe('user@mail.com');
    expect(domainEntity.email).toBeInstanceOf(Email);
  });

  it('round trip (go and return): toPersistence(toDomain(row))', () => {
    const originalRow: UserRow = {
      id: 'uuid-123',
      name: 'User1',
      email: 'uses@mail.com',
      passwordHash: 'password123',
      avatarUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      termsAcceptedAt: new Date(),
    };

    const domain = toDomain(originalRow);

    const roundTripRow = toPersistence(domain);

    expect(roundTripRow).toEqual(originalRow);
  });
});
