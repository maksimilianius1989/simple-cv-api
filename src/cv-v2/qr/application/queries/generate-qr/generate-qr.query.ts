import { IQuery } from '@nestjs/cqrs';

export class GenerateQrQuery implements IQuery {
  constructor(public readonly text: string) {}
}
