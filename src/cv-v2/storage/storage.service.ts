import { Inject, Injectable } from '@nestjs/common';
import {
  IFILE_REPOSITORY,
  type IFileRepository,
} from '@storage/domain/repositories/file.repository';

@Injectable()
export class StorageService {
  constructor(
    @Inject(IFILE_REPOSITORY as symbol)
    private readonly repository: IFileRepository,
  ) {}

  async disableAccessByCv(cvId: string) {
    await this.repository.updateManyStatusByCv(cvId, false);
  }
}
