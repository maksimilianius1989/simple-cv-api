import { ICvContent } from '@cv/domain/value-objects/cv-content.vo';

export class CreateCvCommand {
  constructor(
    public readonly userId: string,
    public readonly title: string,
    public readonly content: ICvContent,
  ) {}
}
