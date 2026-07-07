import { DomainException } from '@shared/domain/exceptions/domain.exception';

abstract class CvException extends DomainException {}

export class CvNotFoundException extends CvException {
  code: string = 'CV_NOT_FOUND';
  statusCode: number = 404;

  constructor(cvId: string) {
    super(`CV with ID "${cvId}" was not found`, { cvId });
  }
}
