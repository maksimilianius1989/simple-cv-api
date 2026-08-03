import { ICommand } from '@nestjs/cqrs';

export class CreateDraftPdfCommand implements ICommand {
  constructor(
    public readonly draftId: string,
    public readonly templateId: string,
  ) {}
}
