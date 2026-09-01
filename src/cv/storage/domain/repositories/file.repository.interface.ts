import { type StoredFile } from '../entities/stored-file.entity';
import { FileCategory } from '../enums/file-category.enum';

export const FILE_REPOSITORY = Symbol('FILE_REPOSITORY');
export interface IFileRepository {
  findById(id: string): Promise<StoredFile | null>;

  findPublishedById(id: string): Promise<StoredFile | null>;

  findByCvIds(cvIds: string[]): Promise<StoredFile[]>;

  findByCvAndCategory(
    cvId: string,
    category: FileCategory,
  ): Promise<StoredFile | null>;

  findByCv(cvId: string): Promise<StoredFile[]>;

  save(file: StoredFile): Promise<StoredFile>;

  deleteByCvId(cvId: string): Promise<void>;

  updateManyStatusByCvId(cvId: string, isPublished: boolean): Promise<void>;
}
