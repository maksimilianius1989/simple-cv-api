import { DomainException } from '@shared/domain/exceptions/domain.exception';

abstract class CvException extends DomainException {}

export class CvNotFoundException extends CvException {
  readonly code: string = 'CV_NOT_FOUND';
  readonly statusCode: number = 404;

  constructor(cvId: string) {
    super(`The requested CV could not be found`, { cvId });
  }
}

export class CvNotFoundBySlugException extends CvException {
  readonly code: string = 'CV_NOT_FOUND_BY_SLUG';
  readonly statusCode: number = 404;

  constructor(slug: string) {
    super(`The requested CV could not be found by the slug`, { slug });
  }
}
