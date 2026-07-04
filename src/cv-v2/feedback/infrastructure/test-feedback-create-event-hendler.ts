import { FeedbackCreateEvent } from '../domain/events/feedback-create.event';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(FeedbackCreateEvent)
export class TestFeedbackCreateEventHandler implements IEventHandler<FeedbackCreateEvent> {
  private readonly looger = new Logger(TestFeedbackCreateEventHandler.name);

  handle(event: FeedbackCreateEvent) {
    this.looger.debug(
      'TestFeedbackCreateEventHandler ===> ' + JSON.stringify(event),
    );
  }
}
