import { FileCategory } from '../../../domain/enums/file-category.enum';

export class GetFileByCvIdAndCategoryQuery {
  constructor(
    public readonly cvId: string,
    public readonly category: FileCategory,
  ) {}
}
