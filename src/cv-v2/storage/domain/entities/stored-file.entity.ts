import { FileCategory } from '../enums/file-category.enum';
import {
  FileExtensionNotAllowedException,
  FileSizeLimitExceededException,
  MimeTypeNotAllowedException,
  ValidationRulesNotFoundException,
} from '../exceptions';
import { FILE_VALIDATION_RULES } from './file-validation.rules';

export interface StoredFileProps {
  id?: string;
  cvId: string;
  category: FileCategory;
  path: string;
  filename: string;
  mimeType: string;
  size: number;
  isPublished?: boolean;
}

export class StoredFile {
  private props: StoredFileProps;

  constructor(props: StoredFileProps) {
    this.props = {
      ...props,
      id: props.id ?? crypto.randomUUID(),
      isPublished: props.isPublished ?? false,
    };
    this.validate();
  }

  public static createSystemFile(data: {
    cvId: string;
    category: FileCategory;
    size: number;
    mimeType: string;
    ext: string;
  }): { finalFileName: string; mimeType: string } {
    const finalFileName = `${data.category}.${data.ext}`;
    return { finalFileName, mimeType: data.mimeType };
  }

  public static create(data: {
    cvId: string;
    category: FileCategory;
    size: number;
    detectedMime: string;
    detectedExt: string;
  }): { finalFileName: string; mimeType: string } {
    const rules = FILE_VALIDATION_RULES[data.category];

    if (!rules) {
      throw new ValidationRulesNotFoundException(data.category);
    }

    if (data.size > rules.maxSizeInBytes) {
      throw new FileSizeLimitExceededException(data.size, rules.maxSizeInBytes);
    }

    if (!rules.allowedExtensions.includes(data.detectedExt)) {
      throw new FileExtensionNotAllowedException(
        data.detectedExt,
        rules.allowedExtensions,
      );
    }
    if (!rules.allowedMimeTypes.includes(data.detectedMime)) {
      throw new MimeTypeNotAllowedException(
        data.detectedMime,
        rules.allowedMimeTypes,
      );
    }

    const finalFileName = `${data.category}.${data.detectedExt}`;

    return { finalFileName, mimeType: data.detectedMime };
  }

  private validate() {
    if (!this.props.cvId) throw new Error('StoredFile: cvId is required');
    if (!this.props.path) throw new Error('StoredFile: path is required');
    if (this.props.size <= 0)
      throw new Error('StoredFile: size must be greater than 0');
  }

  get id(): string {
    return this.props.id!;
  }

  get cvId(): string {
    return this.props.cvId;
  }
  get category(): FileCategory {
    return this.props.category;
  }
  get path(): string {
    return this.props.path;
  }
  get fileName(): string {
    return this.props.filename;
  }
  get mimeType(): string {
    return this.props.mimeType;
  }
  get size(): number {
    return this.props.size;
  }
  get isPublished(): boolean {
    return this.props.isPublished!;
  }

  public publish(): void {
    this.props.isPublished = true;
  }

  public unpublish(): void {
    this.props.isPublished = false;
  }
}
