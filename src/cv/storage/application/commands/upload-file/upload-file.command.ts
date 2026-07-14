import { FileCategory } from '@storage/domain/enums/file-category.enum';

export interface IUploadFileCommand {
  id?: string;
  userId: string;
  cvId: string;
  category: FileCategory;
  fileName?: string;
  buffer?: Buffer;
  url?: string;
  isSystemGenerated?: boolean;
}

export class UploadFileCommand {
  private readonly props: IUploadFileCommand;

  constructor(props: IUploadFileCommand) {
    this.props = {
      ...props,
      isSystemGenerated: props.isSystemGenerated ?? false,
    };
  }

  get id() {
    return this.props.id;
  }

  get userId() {
    return this.props.userId;
  }

  get cvId() {
    return this.props.cvId;
  }

  get category() {
    return this.props.category;
  }

  get fileName() {
    return this.props.fileName;
  }

  get buffer() {
    return this.props.buffer;
  }

  get url() {
    return this.props.url;
  }

  get isSystemGenerated() {
    return this.props.isSystemGenerated;
  }
}
