export class Email {
  private readonly value: string;

  constructor(value: string) {
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]$/.test(value)) {
      throw new Error('Invalid email format');
    }

    this.value = value;
  }

  toString() {
    return this.value;
  }
}
