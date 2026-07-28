import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetFileMapByCvIdsQuery } from './get-file-map-by-cv-ids.query';
import { Inject } from '@nestjs/common';
import {
  FILE_REPOSITORY,
  type IFileRepository,
} from '@storage/domain/repositories/file.repository.interface';
import { StoredFile } from '@storage/domain/entities/stored-file.entity';

@QueryHandler(GetFileMapByCvIdsQuery)
export class GetFileMapByCvIdsHandler implements IQueryHandler<GetFileMapByCvIdsQuery> {
  constructor(
    @Inject(FILE_REPOSITORY) private readonly fileRepo: IFileRepository,
  ) {}

  async execute(
    query: GetFileMapByCvIdsQuery,
  ): Promise<Map<string, StoredFile[]>> {
    const files = await this.fileRepo.findByCvIds(query.cvIds);
    const fileMap = new Map<string, StoredFile[]>();
    for (const file of files) {
      const list = fileMap.get(file.cvId) || [];

      list.push(file);
      fileMap.set(file.cvId, list);
    }

    return fileMap;
  }
}
