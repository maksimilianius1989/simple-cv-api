import { GenerateAiDraftCommand } from '@draft/application/commands/generate-ai-draft/generate-ai-draft.command';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Authorization } from 'src/auth/decorators/authorization.decorator';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { CommandBus } from '@nestjs/cqrs';

@Controller('ai-draft-cv')
export class AiDraftCvController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @Authorization()
  @HttpCode(HttpStatus.OK)
  async create(
    @Authorized('id') userId: string,
    @Body() dto: { name: string },
  ) {
    return this.commandBus.execute(
      new GenerateAiDraftCommand(userId, dto.name),
    );
  }
}
