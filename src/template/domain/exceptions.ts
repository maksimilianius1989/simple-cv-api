import { DomainException } from '@shared/domain/exceptions/domain.exception';

abstract class TemplateException extends DomainException {}

export class TemplateNotFoundException extends TemplateException {
  readonly code: string = 'TEMPLATE_NOT_FOUND';
  readonly statusCode: number = 404;

  constructor(templateId: string) {
    super('Template not found', { templateId });
  }
}
