import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetFileByCvIdAndCategoryQuery } from './get-by-cv-and-category.query';
import { Inject } from '@nestjs/common';
import {
  FILE_REPOSITORY,
  type IFileRepository,
} from '@storage/domain/repositories/file.repository.interface';
import { StoredFile } from '@storage/domain/entities/stored-file.entity';
import { StoredFileNotFoundByCvAndCategory } from '@storage/domain/exceptions';

@QueryHandler(GetFileByCvIdAndCategoryQuery)
export class GetFileByCvIdAndCategoryHandler implements IQueryHandler<GetFileByCvIdAndCategoryQuery> {
  constructor(
    @Inject(FILE_REPOSITORY)
    private readonly fileRepo: IFileRepository,
  ) {}

  async execute(query: GetFileByCvIdAndCategoryQuery): Promise<StoredFile> {
    const storedFile = await this.fileRepo.findByCvAndCategory(
      query.cvId,
      query.category,
    );

    if (!storedFile) {
      throw new StoredFileNotFoundByCvAndCategory(query.cvId, query.category);
    }

    return storedFile;
  }
}
