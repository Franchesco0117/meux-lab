export interface IPasswordHasher {
  hash(plainPassword: string): Promise<string>;
  verify(plainPassword: string, hashedValue: string): Promise<boolean>;
}
