import { FileCategory } from '../enums/file-category.enum';

export interface FileValidationRules {
  maxSizeInBytes: number;
  allowedMimeTypes: string[];
  allowedExtensions: string[];
}

export const FILE_VALIDATION_RULES: Partial<
  Record<FileCategory, FileValidationRules>
> = {
  [FileCategory.AVATAR]: {
    maxSizeInBytes: 5 * 1024 * 1024,
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedExtensions: ['jpg', 'jpeg', 'png', 'webp'],
  },
};
