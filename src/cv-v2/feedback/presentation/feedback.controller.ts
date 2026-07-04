import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateFeedbackDto } from './dtos/create-feedback.dto';
import { CreateFeedbackCommand } from '@feedback/application/commands/create/create-feedback.command';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateFeedbackDto): Promise<boolean> {
    await this.commandBus.execute(
      new CreateFeedbackCommand(dto.cvId, dto.email, dto.message),
    );
    return true;
  }
}
