import { DomainException } from '@shared/domain/exceptions/domain.exception';
import { FileCategory } from './enums/file-category.enum';

abstract class StoredFileException extends DomainException {}

export class StoredFileNotFoundException extends StoredFileException {
  code: string = 'FILE_NOT_FOUND';
  statusCode: number = 404;

  constructor(fileId: string) {
    super(`Stored file not found [FileId: ${fileId}]`, { fileId });
  }
}

export class StoredFileNotFoundByCvAndCategory extends StoredFileException {
  code: string = 'FILE_NOT_FOUND';
  statusCode: number = 404;

  constructor(cvId: string, category: FileCategory) {
    super(`Stored file not found [CvId: ${cvId}, Category: ${category}`, {
      cvId,
      category,
    });
  }
}
