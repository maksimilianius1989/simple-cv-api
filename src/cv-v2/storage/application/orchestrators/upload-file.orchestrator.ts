import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UploadFileCommand } from '../commands/upload-file/upload-file.command';
import { StoredFile } from '@storage/domain/entities/stored-file.entity';
import { CheckOwnerOfCvQuery } from '@cv/application/queries/check-owner-cv/check-owner-cv.query';
import { UploadFileDto } from '@storage/presentation/dtos/upload-file.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadFileOrchestrator {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async uploadFile(
    userId: string,
    dto: UploadFileDto,
    file?: { originalName: string; buffer: Buffer },
  ): Promise<StoredFile> {
    await this.queryBus.execute<CheckOwnerOfCvQuery, void>(
      new CheckOwnerOfCvQuery(userId, dto.cvId),
    );

    let fallbackFileName = 'downloaded_file';

    if(dto.url) {
      try {
        const 
      }
    }

    const command = new UploadFileCommand(
      userId,
      dto.cvId,
      dto.category,
      file?.originalName || ,
      file?.buffer,
      dto.url,
    );

    return await this.commandBus.execute(command);
  }
}
