import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateAIDraftCommand } from '../application/commands/create/create-ai-draft.command';
import { CreateDraftRequest } from './dtos/create-draft.dto';
import { MoveAiDraftToDeleteCommand } from '../application/commands/move-to-delete/move-ai-draft-to-delete.command';
import { GenerateAiDraftCommand } from '../application/commands/generate/generate-ai-draft.command';
import { AiGenerateDraftRequest } from './dtos/ai-generate-draft.dto';
import { Authorization } from '@auth/infrastructure/decorators/authorization.decorator';
import { Authorized } from '@auth/infrastructure/decorators/authorized.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { MergeFileToBodyInterceptor } from '@shared/infrastructure/interceptors/merge-file-to-body.interceptor';

@Controller('ai-drafts')
export class AiDraftCvController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @Authorization()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'), MergeFileToBodyInterceptor)
  async create(
    @Authorized('id') userId: string,
    @Body() dto: CreateDraftRequest,
  ): Promise<string> {
    const draftId = crypto.randomUUID();

    await this.commandBus.execute(
      new CreateAIDraftCommand(
        draftId,
        userId,
        dto.prompt,
        dto.file
          ? { originName: dto.file.originalname, buffer: dto.file.buffer }
          : undefined,
      ),
    );

    return draftId;
  }

  @Post(':draftId/ai-generate')
  @Authorization()
  @HttpCode(HttpStatus.CREATED)
  async aiGenerate(
    @Authorized('id') userId: string,
    @Param('draftId', new ParseUUIDPipe({ version: '4' })) draftId: string,
    @Body() dto: AiGenerateDraftRequest,
  ) {
    await this.commandBus.execute<MoveAiDraftToDeleteCommand>(
      new GenerateAiDraftCommand(draftId, userId, dto.provider),
    );
  }

  @Delete(':draftId')
  @Authorization()
  @HttpCode(HttpStatus.OK)
  async moveToDelete(
    @Authorized('id') userId: string,
    @Param('draftId', new ParseUUIDPipe({ version: '4' })) draftId: string,
  ) {
    await this.commandBus.execute<MoveAiDraftToDeleteCommand>(
      new MoveAiDraftToDeleteCommand(draftId, userId),
    );
  }
}
