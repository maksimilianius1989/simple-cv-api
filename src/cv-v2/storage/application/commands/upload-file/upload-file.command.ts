import { FileCategory } from '@storage/domain/enums/file-category.enum';

export class UploadFileCommand {
  constructor(
    public readonly userId: string,
    public readonly cvId: string,
    public readonly category: FileCategory,
    public readonly fileName: string,
    public readonly buffer?: Buffer,
    public readonly url?: string,
    public readonly isSystemGenerated: boolean = false,
  ) {}
}
