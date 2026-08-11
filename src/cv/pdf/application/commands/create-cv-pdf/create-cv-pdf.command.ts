import { ICommand } from '@nestjs/cqrs';

export class CreateCvPdfCommand implements ICommand {
  constructor(
    public readonly cvId: string,
    public readonly templateId: string,
  ) {}
}
