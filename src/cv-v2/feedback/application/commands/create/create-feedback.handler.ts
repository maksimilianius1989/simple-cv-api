import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateFeedbackCommand } from './create-feedback.command';
import { Feedback } from '@feedback/domain/entities/feedback.entity';
import {
  CV_FEEDBACK_REPOSITORY,
  type ICvFeedbackRepository,
} from '@feedback/domain/repositories/feedback.repository';
import { Inject } from '@nestjs/common';
import { FeedbackCreateEvent } from '@feedback/domain/events/feedback-create.event';

@CommandHandler(CreateFeedbackCommand)
export class CreateFeedbackHandler implements ICommandHandler<CreateFeedbackCommand> {
  constructor(
    @Inject(CV_FEEDBACK_REPOSITORY as symbol)
    private readonly repo: ICvFeedbackRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateFeedbackCommand): Promise<string> {
    const { cvId, email, message } = command;

    const id = crypto.randomUUID();
    const feedback = Feedback.create({
      id,
      cvId,
      email,
      message,
    });

    await this.repo.save(feedback);

    this.eventBus.publish(new FeedbackCreateEvent(id, cvId, message));

    return id;
  }
}
