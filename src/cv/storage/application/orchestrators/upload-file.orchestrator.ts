import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { UploadFileDto } from '@storage/presentation/dtos/upload-file.dto';
import { CheckOwnerOfCvQuery } from '@cv/application/queries/check-owner-cv/check-owner-cv.query';
import { UploadFileCommand } from '../commands/upload-file/upload-file.command';

@Injectable()
export class UploadFileOrchestrator {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async uploadFile(
    userId: string,
    cvId: string,
    dto: UploadFileDto,
    file?: { originalName: string; buffer: Buffer },
  ): Promise<void> {
    await this.queryBus.execute<CheckOwnerOfCvQuery, void>(
      new CheckOwnerOfCvQuery(userId, cvId),
    );

    await this.commandBus.execute(
      new UploadFileCommand({
        userId,
        cvId: cvId,
        category: dto.category,
        fileName: file?.originalName,
        buffer: file?.buffer,
        url: dto?.url,
      }),
    );
  }
}
