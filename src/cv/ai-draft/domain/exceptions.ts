import { DomainException } from '@shared/domain/exceptions/domain.exception';
import { AiDraftCvStatus } from './enums/ai-draft-cv-status.enum';

abstract class AiDraftException extends DomainException {}

export class EmptyPromptException extends AiDraftException {
  readonly code: string = 'AI_DRAFT_EMPTY_PROMPT';
  readonly statusCode: number = 400;

  constructor() {
    super('Prompt cannot be empty');
  }
}

export class CompleteGenerationException extends AiDraftException {
  readonly code: string = 'AI_DRAFT_COMPLETE_GENERATION';
  readonly statusCode: number = 400;

  constructor(status: AiDraftCvStatus) {
    super('Cannot complete generation', { status });
  }
}

export class DraftNotFoundException extends AiDraftException {
  readonly code: string = 'AI_DRAFT_NOT_FOUND';
  readonly statusCode: number = 404;

  constructor(draftId?: string) {
    super('Ai Draft not found', { draftId });
  }
}

export class UserDraftNotFoundException extends AiDraftException {
  readonly code: string = 'USER_DRAFT_BY_NOT_FOUND';
  readonly statusCode: number = 404;

  constructor(draftId: string, userId: string) {
    super('User Draft not found', { draftId, userId });
  }
}
