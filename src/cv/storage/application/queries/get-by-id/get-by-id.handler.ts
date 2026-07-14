import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetFileByIdQuery } from './get-by-id.query';
import {
  FILE_REPOSITORY,
  type IFileRepository,
} from '../../../domain/repositories/file.repository';
import { Inject } from '@nestjs/common';
import { StoredFileNotFoundException } from '../../../domain/exceptions';

@QueryHandler(GetFileByIdQuery)
export class GetFileByIdHadler implements IQueryHandler<GetFileByIdQuery> {
  constructor(
    @Inject(FILE_REPOSITORY) private readonly fileRepo: IFileRepository,
  ) {}

  async execute(query: GetFileByIdQuery): Promise<any> {
    const storedFile = await this.fileRepo.findById(query.fileId);

    if (!storedFile || !storedFile.isPublished) {
      throw new StoredFileNotFoundException(query.fileId);
    }

    return storedFile;
  }
}
