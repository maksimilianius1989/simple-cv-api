import { FileCategory } from '@storage/domain/enums/file-category.enum';

export class GetFileByCvIdAndCategoryQuery {
  constructor(
    public readonly cvId: string,
    public readonly category: FileCategory,
  ) {}
}
