import { DomainException } from '@shared/domain/exceptions/domain.exception';

abstract class AiException extends DomainException {}

export class AiModelNotFoundException extends AiException {
  readonly code: string = 'AI_MODEL_NOT_FOUND';
  readonly statusCode: number = 404;
  constructor(apiKey: string) {
    super(`Ai model By key ${apiKey} not found`);
  }
}
