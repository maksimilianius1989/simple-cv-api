import { FileCategory } from '@storage/domain/enums/file-category.enum';

export class UploadFileCommand {
  readonly id?: string;
  readonly userId: string;
  readonly cvId: string;
  readonly category: FileCategory;
  readonly fileName?: string;
  readonly buffer?: Buffer;
  readonly url?: string;
  readonly isSystemGenerated: boolean = false;

  constructor(props: {
    id?: string;
    userId: string;
    cvId: string;
    category: FileCategory;
    fileName?: string;
    buffer?: Buffer;
    url?: string;
    isSystemGenerated?: boolean;
  }) {
    this.id = props.id;
    this.userId = props.userId;
    this.cvId = props.cvId;
    this.category = props.category;
    this.fileName = props.fileName;
    this.buffer = props.buffer;
    this.url = props.url;
    this.isSystemGenerated = props.isSystemGenerated ?? false;
  }
}
