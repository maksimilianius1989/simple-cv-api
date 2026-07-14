import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCvCommand } from './create-cv.command';
import {
  CV_REPOSITORY,
  type ICvRepository,
} from '../../../domain/repositories/cv.repository';
import { Cv } from '../../../domain/entities/cv.entity';
import { Inject } from '@nestjs/common';

@CommandHandler(CreateCvCommand)
export class CreateCvHandler implements ICommandHandler<CreateCvCommand> {
  constructor(
    @Inject(CV_REPOSITORY as symbol)
    private readonly cvRepository: ICvRepository,
  ) {}

  async execute(command: CreateCvCommand): Promise<{ cvId: string }> {
    const { userId, title, content } = command;

    const cvId = crypto.randomUUID();

    const cv = Cv.create(cvId, userId, title, content);

    await this.cvRepository.save(cv);

    return { cvId };
  }
}
