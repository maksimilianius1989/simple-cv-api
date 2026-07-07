import { ICommand } from '@nestjs/cqrs';

export class CreatePdfFileCommand implements ICommand {
  constructor(
    public readonly cvId: string,
    public readonly template: string,
  ) {}
}
