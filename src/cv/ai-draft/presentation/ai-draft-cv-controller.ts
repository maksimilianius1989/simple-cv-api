import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateAIDraftCommand } from '../application/commands/create/create-ai-draft.command';
import { CreateDraftRequest } from './dtos/create-draft.dto';
import { MoveAiDraftToDeleteCommand } from '../application/commands/move-to-delete/move-ai-draft-to-delete.command';
import { GenerateAiDraftCommand } from '../application/commands/generate/generate-ai-draft.command';
import { AiGenerateDraftRequest } from './dtos/ai-generate-draft.dto';
import { Authorization } from '@auth/infrastructure/decorators/authorization.decorator';
import { Authorized } from '@auth/infrastructure/decorators/authorized.decorator';

@Controller('ai-draft')
export class AiDraftCvController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @Authorization()
  @HttpCode(HttpStatus.OK)
  async create(
    @Authorized('id') userId: string,
    @Body() dto: CreateDraftRequest,
  ): Promise<string> {
    const draftId = crypto.randomUUID();

    await this.commandBus.execute(
      new CreateAIDraftCommand(draftId, userId, dto.prompt),
    );

    return draftId;
  }

  @Post(':cvId/ai-generate')
  @Authorization()
  @HttpCode(HttpStatus.OK)
  async aiGenerate(
    @Authorized('id') userId: string,
    @Param('cvId', new ParseUUIDPipe({ version: '4' })) cvId: string,
    @Body() dto: AiGenerateDraftRequest,
  ) {
    await this.commandBus.execute<MoveAiDraftToDeleteCommand>(
      new GenerateAiDraftCommand(cvId, userId, dto.provider),
    );
  }

  @Delete(':cvId')
  @Authorization()
  @HttpCode(HttpStatus.OK)
  async moveToDelete(
    @Authorized('id') userId: string,
    @Param('cvId', new ParseUUIDPipe({ version: '4' })) cvId: string,
  ) {
    await this.commandBus.execute<MoveAiDraftToDeleteCommand>(
      new MoveAiDraftToDeleteCommand(cvId, userId),
    );
  }
}
