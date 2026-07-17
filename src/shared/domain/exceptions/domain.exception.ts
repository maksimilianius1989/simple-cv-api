export abstract class DomainException extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  readonly exceptionHierarchy: string[] = [];

  constructor(
    message: string,
    public readonly context?: Record<string, any>,
  ) {
    super(message);
    this.name = this.constructor.name;

    let proto = Object.getPrototypeOf(this);
    while (proto && proto.constructor.name !== 'Error') {
      this.exceptionHierarchy.push(proto.constructor.name as string);
      proto = Object.getPrototypeOf(proto);
    }
  }
}
