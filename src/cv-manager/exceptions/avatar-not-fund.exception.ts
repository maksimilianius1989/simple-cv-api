export class AvatarNotFundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AvatarNotFundException';
  }
}
