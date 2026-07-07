import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetFileByIdQuery } from './get-by-id.query';
import {
  FILE_REPOSITORY,
  type IFileRepository,
} from '@storage/domain/repositories/file.repository';
import { Inject } from '@nestjs/common';
import { StoredFileNotFoundException } from '@storage/domain/exceptions';

@QueryHandler(GetFileByIdQuery)
export class GetFileByIdHadler implements IQueryHandler<GetFileByIdQuery> {
  constructor(
    @Inject(FILE_REPOSITORY) private readonly fileRepo: IFileRepository,
  ) {}

  async execute(query: GetFileByIdQuery): Promise<any> {
    const storedFile = await this.fileRepo.findById(query.id);

    if (!storedFile) {
      throw new StoredFileNotFoundException(query.id);
    }

    return storedFile;
  }
}
