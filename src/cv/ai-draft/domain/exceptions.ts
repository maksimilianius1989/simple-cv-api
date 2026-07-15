import { DomainException } from '@shared/domain/exceptions/domain.exception';
import { AiDraftCvStatus } from './enums/ai-draft-cv-status.enum';

abstract class AiDraftException extends DomainException {}

export class EmptyPromptException extends AiDraftException {
  code: string = 'AI_DRAFT_EMPTY_PROMPT';
  statusCode: number = 400;

  constructor() {
    super('Prompt cannot be empty');
  }
}

export class CompleteGenerationException extends AiDraftException {
  code: string = 'AI_DRAFT_COMPLETE_GENERATION';
  statusCode: number = 400;

  constructor(status: AiDraftCvStatus) {
    super('Cannot complete generation', { status });
  }
}

export class FailContentException extends AiDraftException {
  code: string = 'AI_DRAFT_FAIL_CONTENT';
  statusCode: number = 400;

  constructor() {
    super('Fail content');
  }
}

export class DraftNotFoundException extends AiDraftException {
  code: string = 'AI_DRAFT_NOT_FUND';
  statusCode: number = 404;

  constructor() {
    super('Ai Draft not found');
  }
}
