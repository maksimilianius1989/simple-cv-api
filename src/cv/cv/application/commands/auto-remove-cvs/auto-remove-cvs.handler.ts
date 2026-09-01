import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AutoRemoveCvsCommand } from './auto-remove-cvs.command';
import { Inject } from '@nestjs/common';
import {
  CV_REPOSITORY,
  type ICvRepository,
} from '@cv/domain/repositories/cv.repository.interface';

@CommandHandler(AutoRemoveCvsCommand)
export class AutoRemoveCvsHandler implements ICommandHandler<AutoRemoveCvsCommand> {
  constructor(
    @Inject(CV_REPOSITORY as symbol)
    private readonly cvRepository: ICvRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(): Promise<number> {
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() - 1);

    const cvs =
      await this.cvRepository.findNotCompletedCvsOlderThan(expirationDate);
    if (!cvs) return 0;

    for (const cv of cvs) {
      const mergedCv = this.publisher.mergeObjectContext(cv);
      mergedCv.remove();
      await this.cvRepository.delete(mergedCv);
      mergedCv.commit();
    }

    return cvs.length;
  }
}
