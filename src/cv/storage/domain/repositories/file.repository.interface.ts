import { type StoredFile } from '../entities/stored-file.entity';
import { FileCategory } from '../enums/file-category.enum';

export const FILE_REPOSITORY = Symbol('FILE_REPOSITORY');
export interface IFileRepository {
  findById(id: string): Promise<StoredFile | null>;

  findByCvAndCategory(
    cvId: string,
    category: FileCategory,
  ): Promise<StoredFile | null>;

  findByCv(cvId: string): Promise<StoredFile[]>;

  save(file: StoredFile): Promise<StoredFile>;

  delete(id: string): Promise<void>;

  updateManyStatusByCv(cvId: string, isPublished: boolean): Promise<void>;
}
