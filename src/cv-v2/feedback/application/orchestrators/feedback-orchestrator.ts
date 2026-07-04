import { CheckCvExistanceQuery } from '@cv/application/queries/check-cv-existance/check-cv-existance.query';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateFeedbackCommand } from '../commands/create/create-feedback.command';

@Injectable()
export class FeedbackOrchestrator {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async reateFeedback(dto: {
    cvId: string;
    email: string;
    message: string;
  }): Promise<string> {
    const cvExist = await this.queryBus.execute<CheckCvExistanceQuery, boolean>(
      new CheckCvExistanceQuery(dto.cvId),
    );

    if (!cvExist) {
      throw new NotFoundException(`CV with id ${dto.cvId} does not exist`);
    }

    return this.commandBus.execute<CreateFeedbackCommand, string>(
      new CreateFeedbackCommand(dto.cvId, dto.email, dto.message),
    );
  }
}
