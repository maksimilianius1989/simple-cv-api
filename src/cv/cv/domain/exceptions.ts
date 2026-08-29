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

export class CvPublicationDateExpiredException extends CvException {
  readonly code: string = 'CV_PUBLICATION_EXPIRED';
  readonly statusCode: number = 400;

  constructor(cvId: string, expiredDate: Date) {
    super('Cannot publish CV becouse the publication end date is in the past', {
      cvId,
      expiredDate,
    });
  }
}
