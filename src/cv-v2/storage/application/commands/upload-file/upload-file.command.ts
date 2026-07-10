import { FileCategory } from '@storage/domain/enums/file-category.enum';

export class UploadFileCommand {
  public readonly userId: string;
  public readonly cvId: string;
  public readonly category: FileCategory;
  public readonly fileName?: string;
  public readonly buffer?: Buffer;
  public readonly url?: string;
  public readonly isSystemGenerated: boolean = false;

  constructor(props: {
    userId: string;
    cvId: string;
    category: FileCategory;
    fileName?: string;
    buffer?: Buffer;
    url?: string;
    isSystemGenerated?: boolean;
  }) {
    this.userId = props.userId;
    this.cvId = props.cvId;
    this.category = props.category;
    this.fileName = props.fileName;
    this.buffer = props.buffer;
    this.url = props.url;
    this.isSystemGenerated = props.isSystemGenerated ?? false;
  }
}
