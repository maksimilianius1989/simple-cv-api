import { DomainException } from '@shared/domain/exceptions/domain.exception';
import { FileCategory } from './enums/file-category.enum';

abstract class StoredFileException extends DomainException {}

export class StoredFileNotFoundException extends StoredFileException {
  readonly code: string = 'STORAGE_FILE_NOT_FOUND';
  readonly statusCode: number = 404;

  constructor(fileId: string) {
    super('The requested file could not be found', { fileId });
  }
}

export class StoredFileNotFoundByCvAndCategory extends StoredFileException {
  readonly code: string = 'STORAGE_FILE_NOT_FOUND_BY_CV_AND_CATEGORY';
  readonly statusCode: number = 404;

  constructor(cvId: string, category: FileCategory) {
    super('No file found for the specified CV and category', {
      cvId,
      category,
    });
  }
}

export class FailedDownloadFileException extends StoredFileException {
  readonly code: string = 'STORAGE_FAILED_DOWNLOAD_FILE';
  readonly statusCode: number = 400;

  constructor() {
    super('Failed to download the file from the provided source');
  }
}

export class FailedDownloadFileFromUrlException extends StoredFileException {
  readonly code: string = 'STORAGE_FAILED_DOWNLOAD_FILE_FROM_URL';
  readonly statusCode: number = 422;

  constructor(url: string) {
    super('Failed to download file from URL. Please verify the link', { url });
  }
}

export class FileSizeLimitExceededException extends StoredFileException {
  readonly code: string = 'STORAGE_FILE_SIZE_LIMIT_EXCEEDED';
  readonly statusCode: number = 413;

  constructor(fileSize: number, maxFileSize: number) {
    super('The uploaded file exceeds the maximum allowed size limit', {
      fileSize,
      maxFileSize,
    });
  }
}

export class FileExtensionNotAllowedException extends StoredFileException {
  readonly code: string = 'STORAGE_FILE_EXTENSION_NOT_ALLOWED';
  readonly statusCode: number = 400;
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
  readonly code: string = 'STORAGE_MIME_TYPE_NOT_ALLOWED';
  readonly statusCode: number = 400;
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
  readonly code: string = 'STORAGE_VALIDATION_RULES_NOT_FOUND';
  readonly statusCode: number = 500;
  constructor(category: FileCategory) {
    super(
      'Unable to process the request due to a missing system configuration',
      {
        category,
      },
    );
  }
}

export class PublicFileAccessForbbiden extends StoredFileException {
  readonly code: string = 'STORAGE_FORBIDDEN_PUBLIC_FILE_ACCESS';
  readonly statusCode: number = 403;
  constructor(fileId: string) {
    super('Cannot get public URL for an unpublished file', {
      fileId,
    });
  }
}

export class CvIdIsRequiredException extends StoredFileException {
  readonly code: string = 'STORAGE_CV_ID_IS_REQUIRED';
  readonly statusCode: number = 500;

  constructor(cvId: string) {
    super('Cv ID is required', { cvId });
  }
}

export class PathIsRequiredException extends StoredFileException {
  readonly code: string = 'STORAGE_PATH_IS_REQUIRED';
  readonly statusCode: number = 500;

  constructor(path: string) {
    super('Path is required', { path });
  }
}

export class FileSizeEmptyException extends StoredFileException {
  readonly code: string = 'STORAGE_FILE_SIZE_IS_EMPTY';
  readonly statusCode: number = 500;

  constructor(size: number) {
    super('Size must be greated than 0', { size });
  }
}
