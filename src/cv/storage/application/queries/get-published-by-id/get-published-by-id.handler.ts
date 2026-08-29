import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPublishedFileByIdQuery } from './get-published-by-id.query';
import { Inject } from '@nestjs/common';
import {
  FILE_REPOSITORY,
  type IFileRepository,
} from '@storage/domain/repositories/file.repository.interface';
import { StoredFileNotFoundException } from '@storage/domain/exceptions';

@QueryHandler(GetPublishedFileByIdQuery)
export class GetPublishedFileByIdHadler implements IQueryHandler<GetPublishedFileByIdQuery> {
  constructor(
    @Inject(FILE_REPOSITORY) private readonly fileRepo: IFileRepository,
  ) {}

  async execute(query: GetPublishedFileByIdQuery): Promise<any> {
    const storedFile = await this.fileRepo.findPublishedById(query.fileId);

    if (!storedFile) {
      throw new StoredFileNotFoundException(query.fileId);
    }

    return storedFile;
  }
}
