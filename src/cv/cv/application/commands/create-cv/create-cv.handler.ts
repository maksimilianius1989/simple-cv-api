import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCvCommand } from './create-cv.command';
import { Inject } from '@nestjs/common';
import {
  CV_REPOSITORY,
  type ICvRepository,
} from '@cv/domain/repositories/cv.repository.interface';
import { Cv } from '@cv/domain/entities/cv.entity';

@CommandHandler(CreateCvCommand)
export class CreateCvHandler implements ICommandHandler<CreateCvCommand> {
  constructor(
    @Inject(CV_REPOSITORY as symbol)
    private readonly cvRepository: ICvRepository,
  ) {}

  async execute(command: CreateCvCommand): Promise<{ cvId: string }> {
    const cvId = crypto.randomUUID();

    const cv = Cv.create(
      cvId,
      command.userId,
      command.title,
      command.content,
      command.coverLetter,
    );

    await this.cvRepository.save(cv);

    return { cvId };
  }
}
