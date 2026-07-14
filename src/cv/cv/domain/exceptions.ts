import { DomainException } from '@shared/domain/exceptions/domain.exception';

abstract class CvException extends DomainException {}

export class CvNotFoundException extends CvException {
  code: string = 'CV_NOT_FOUND';
  statusCode: number = 404;

  constructor(cvId: string) {
    super(`The requested CV could not be found`, { cvId });
  }
}

export class ForbiddenCvAccessException extends CvException {
  code: string = 'FORBIDDEN_CV_ACCESS';
  statusCode: number = 403;
  constructor(userId: string, cvId: string) {
    super(
      'Access denied. You do not have permission to access or modify this CV',
      {
        userId,
        cvId,
      },
    );
  }
}
