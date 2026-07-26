import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { CreateAIDraftCommand } from './create-ai-draft.command';
import { Inject } from '@nestjs/common';
import {
  AI_DRAFT_CV_REPOSITORY,
  type IAiDraftCvRepository,
} from '@ai-draft/domain/repositories/ai-draft-cv.repository.interface';
import { AiDraftCv } from '@ai-draft/domain/entities/ai-draft-cv.entity';
import { GetRandomTemplateIdQuery } from '@template/application/queries/get-random-template/get-random-template-id.query';
import { FileCategory } from '@storage/domain/enums/file-category.enum';
import { StorageUploaderService } from '@storage/application/services/storage-uploader.service';

@CommandHandler(CreateAIDraftCommand)
export class CreateAiDraftHandler implements ICommandHandler<CreateAIDraftCommand> {
  constructor(
    @Inject(AI_DRAFT_CV_REPOSITORY)
    private readonly draftRepo: IAiDraftCvRepository,
    private readonly queryBus: QueryBus,
    private readonly uploadService: StorageUploaderService,
  ) {}

  async execute(command: CreateAIDraftCommand): Promise<void> {
    const randomTemplate = await this.queryBus.execute<
      GetRandomTemplateIdQuery,
      { id: string }
    >(new GetRandomTemplateIdQuery());

    const draft = AiDraftCv.createDraft({
      id: command.id,
      userId: command.userId,
      templateId: randomTemplate.id,
      prompt: command.prompt,
    });

    await this.draftRepo.create(draft);

    if (command.avatar) {
      const fileId = crypto.randomUUID();
      await this.uploadService.upload({
        id: fileId,
        userId: command.userId,
        cvId: command.id,
        category: FileCategory.AVATAR,
        fileName: command.avatar.originName,
        buffer: command.avatar.buffer,
        isSystemGenerated: false,
      });
    }
  }
}
