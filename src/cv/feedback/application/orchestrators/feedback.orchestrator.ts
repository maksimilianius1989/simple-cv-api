import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateFeedbackCommand } from '../commands/create/create-feedback.command';
import { CheckCvExistanceQuery } from '@cv/application/queries/check-cv-existance/check-cv-existance.query';

@Injectable()
export class FeedbackOrchestrator {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createFeedback(dto: {
    cvId: string;
    email: string;
    message: string;
  }): Promise<string> {
    await this.queryBus.execute<CheckCvExistanceQuery, void>(
      new CheckCvExistanceQuery(dto.cvId),
    );

    return this.commandBus.execute<CreateFeedbackCommand, string>(
      new CreateFeedbackCommand(dto.cvId, dto.email, dto.message),
    );
  }
}
