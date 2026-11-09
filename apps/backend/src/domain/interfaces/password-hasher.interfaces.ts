export interface IPasswordHasher {
  hash(plainPassword: string): Promise<string>;
  compare(plainPassword: string, hashedValue: string): Promise<boolean>;
}
