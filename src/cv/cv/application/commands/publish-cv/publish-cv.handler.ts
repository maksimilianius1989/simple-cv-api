import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { PublishCvCommand } from './publish-cv.command';
import { Inject } from '@nestjs/common';
import {
  CV_REPOSITORY,
  type ICvRepository,
} from '@cv/domain/repositories/cv.repository.interface';
import { CvNotFoundException } from '@cv/domain/exceptions';

@CommandHandler(PublishCvCommand)
export class PublishCvHandler implements ICommandHandler<PublishCvCommand> {
  constructor(
    @Inject(CV_REPOSITORY as symbol)
    private readonly cvRepo: ICvRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: PublishCvCommand): Promise<void> {
    const cv = await this.cvRepo.getCvByUserId(command.cvId, command.userId);
    if (!cv) throw new CvNotFoundException(command.cvId);

    const mergedCv = this.publisher.mergeObjectContext(cv);

    let publishedUntil = command.publishedUntil;
    if (!publishedUntil) {
      publishedUntil = new Date();
      publishedUntil.setMonth(publishedUntil.getMonth() + 1);
    }

    mergedCv.publishedAt = command.publishedAt ?? new Date();
    mergedCv.publishedUntil = publishedUntil;
    mergedCv.publicSlug =
      command.slug ?? mergedCv.publicSlug ?? crypto.randomUUID();
    mergedCv.markPublish();
    await this.cvRepo.save(mergedCv);
    mergedCv.commit();
  }
}
