export class Email {
  private constructor(public readonly value: string) {}

  static create(raw: string): Email {
    const cleaned: string = raw.trim().toLowerCase();
    const regex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(cleaned)) {
      throw new Error('Invalid Email');
    }

    return new Email(cleaned);
  }
}
