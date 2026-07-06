import { GenerateAiDraftCommand } from '@ai-draft/application/commands/generate-ai-draft/generate-ai-draft.command';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AiDraftCv } from '@ai-draft/domain/entities/ai-draft-cv.entity';
import { AiProviderType } from '@ai/domain/entities/ai-provider-key.entity';
import { Authorization } from '../../../auth/decorators/authorization.decorator';
import { Authorized } from '../../../auth/decorators/authorized.decorator';

@Controller('ai-draft')
export class AiDraftCvController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @Authorization()
  @HttpCode(HttpStatus.OK)
  async create(
    @Authorized('id') userId: string,
    @Body() dto: { summary: string; provider: AiProviderType },
  ): Promise<AiDraftCv> {
    const result = await this.commandBus.execute(
      new GenerateAiDraftCommand(userId, dto.provider, dto.summary),
    );

    return result as AiDraftCv;
  }
}
