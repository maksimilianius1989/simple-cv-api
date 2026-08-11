import {
  CommandHandler,
  EventPublisher,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { CreateCvCommand } from './create-cv.command';
import { Inject } from '@nestjs/common';
import {
  CV_REPOSITORY,
  type ICvRepository,
} from '@cv/domain/repositories/cv.repository.interface';
import { Cv } from '@cv/domain/entities/cv.entity';
import { CheckTemplateExistanceQuery } from '@template/application/queries/check-template-existance/check-template-existance.query';
import { StorageUploaderService } from '@storage/application/services/storage-uploader.service';
import { FileCategory } from '@storage/domain/enums/file-category.enum';

@CommandHandler(CreateCvCommand)
export class CreateCvHandler implements ICommandHandler<CreateCvCommand> {
  constructor(
    @Inject(CV_REPOSITORY as symbol)
    private readonly cvRepository: ICvRepository,
    private readonly queryBus: QueryBus,
    private readonly publisher: EventPublisher,
    private readonly uploadService: StorageUploaderService,
  ) {}

  async execute(command: CreateCvCommand): Promise<{ cvId: string }> {
    await this.queryBus.execute<CheckTemplateExistanceQuery, Promise<void>>(
      new CheckTemplateExistanceQuery(command.templateId),
    );

    const cvId = crypto.randomUUID();

    const cv = this.publisher.mergeObjectContext(
      Cv.create({
        id: cvId,
        userId: command.userId,
        title: command.title,
        templateId: command.templateId,
        content: command.content,
        coverLetter: command.coverLetter,
        hasAvatar: Boolean(command.file) || Boolean(command.avatarUrl),
      }),
    );

    if (command.file || command.avatarUrl) {
      const fileId = crypto.randomUUID();
      await this.uploadService.upload({
        id: fileId,
        userId: command.userId,
        cvId: cv.id,
        category: FileCategory.AVATAR,
        buffer: command.file?.buffer,
        url: command.avatarUrl,
        isSystemGenerated: false,
        isPublished: false,
      });

      cv.markAvatarUploaded();
    }

    await this.cvRepository.save(cv);
    cv.commit();
    return { cvId };
  }
}
