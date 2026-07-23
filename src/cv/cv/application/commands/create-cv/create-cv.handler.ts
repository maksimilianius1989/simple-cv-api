import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { CreateCvCommand } from './create-cv.command';
import { Inject } from '@nestjs/common';
import {
  CV_REPOSITORY,
  type ICvRepository,
} from '@cv/domain/repositories/cv.repository.interface';
import { Cv } from '@cv/domain/entities/cv.entity';
import { CheckTemplateExistanceQuery } from '@template/application/queries/check-template-existance/check-template-existance.query';

@CommandHandler(CreateCvCommand)
export class CreateCvHandler implements ICommandHandler<CreateCvCommand> {
  constructor(
    @Inject(CV_REPOSITORY as symbol)
    private readonly cvRepository: ICvRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(command: CreateCvCommand): Promise<{ cvId: string }> {
    await this.queryBus.execute<CheckTemplateExistanceQuery, Promise<void>>(
      new CheckTemplateExistanceQuery(command.templateId),
    );

    const cvId = crypto.randomUUID();

    const cv = Cv.create(
      cvId,
      command.userId,
      command.title,
      command.templateId,
      command.content,
      command.coverLetter,
    );

    await this.cvRepository.save(cv);

    return { cvId };
  }
}
