import { DomainException } from '@shared/domain/exceptions/domain.exception';
import { FileCategory } from './enums/file-category.enum';

abstract class StoredFileException extends DomainException {}

export class StoredFileNotFoundException extends StoredFileException {
  code: string = 'FILE_NOT_FOUND';
  statusCode: number = 404;

  constructor(fileId: string) {
    super('The requested file could not be found', { fileId });
  }
}

export class StoredFileNotFoundByCvAndCategory extends StoredFileException {
  code: string = 'FILE_NOT_FOUND_BY_CV_AND_CATEGORY';
  statusCode: number = 404;

  constructor(cvId: string, category: FileCategory) {
    super('No file found for the specified CV and category', {
      cvId,
      category,
    });
  }
}

export class FailedDownloadFileException extends StoredFileException {
  code: string = 'FAILED_DOWNLOAD_FILE';
  statusCode: number = 400;

  constructor() {
    super('Failed to download the file from the provided source');
  }
}

export class FailedDownloadFileFromUrlException extends StoredFileException {
  code: string = 'FAILED_DOWNLOAD_FILE_FROM_URL';
  statusCode: number = 422;

  constructor(url: string) {
    super('Failed to download file from URL. Please verify the link', { url });
  }
}

export class FileSizeLimitExceededException extends StoredFileException {
  code: string = 'FILE_SIZE_LIMIT_EXCEEDED';
  statusCode: number = 413;

  constructor(fileSize: number, maxFileSize: number) {
    super('The uploaded file exceeds the maximum allowed size limit', {
      fileSize,
      maxFileSize,
    });
  }
}

export class FileExtensionNotAllowedException extends StoredFileException {
  code: string = 'FILE_EXTENSION_NOT_ALLOWED';
  statusCode: number = 400;
  constructor(ext: string, allowed: string[]) {
    super(
      'The uploaded file format is not supported. Please check the allowed file extensions',
      {
        ext,
        allowed,
      },
    );
  }
}

export class MimeTypeNotAllowedException extends StoredFileException {
  code: string = 'MIME_TYPE_NOT_ALLOWED';
  statusCode: number = 400;
  constructor(mime: string, allowed: string[]) {
    super(
      'The file content type is not supported. Please upload a file of a valid format',
      {
        mime,
        allowed,
      },
    );
  }
}

export class ValidationRulesNotFoundException extends StoredFileException {
  code: string = 'VALIDATION_RULES_NOT_FOUND';
  statusCode: number = 500;
  constructor(category: FileCategory) {
    super(
      'Unable to process the request due to a missing system configuration',
      {
        category,
      },
    );
  }
}
