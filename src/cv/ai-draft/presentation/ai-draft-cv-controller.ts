import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAIDraftCommand } from '../application/commands/create/create-ai-draft.command';
import { CreateDraftRequest } from './dtos/create-draft.dto';
import { MoveAiDraftToDeleteCommand } from '../application/commands/move-to-delete/move-ai-draft-to-delete.command';
import { Authorization } from '@auth/infrastructure/decorators/authorization.decorator';
import { Authorized } from '@auth/infrastructure/decorators/authorized.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { MergeFileToBodyInterceptor } from '@shared/infrastructure/interceptors/merge-file-to-body.interceptor';
import { AiProviderType } from '@shared/domain/enums/ai-provider-type.enum';
import { AiDraftCv } from '@ai-draft/domain/entities/ai-draft-cv.entity';
import { GetUserAiDraftsQuery as GetUserAiDraftsQuery } from '@ai-draft/application/queries/get-user-ai-drafts/get-user-ai-drafts.query';
import { AiDraftResponseDto } from './dtos/ai-draft-response.dto';
import { AiDraftResponseMapper } from './mappers/ai-draft-response.mapper';
import { GetUserAiDraftQuery } from '@ai-draft/application/queries/get-user-ai-draft/get-user-ai-draft.query';

@Controller('ai-drafts')
export class AiDraftCvController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @Authorization()
  async getUserDrafts(
    @Authorized('id') userId: string,
  ): Promise<AiDraftResponseDto[]> {
    const drafts = await this.queryBus.execute<
      GetUserAiDraftsQuery,
      AiDraftCv[]
    >(new GetUserAiDraftsQuery(userId));
    return AiDraftResponseMapper.toResponseList(drafts);
  }

  @Get(':draftId')
  @Authorization()
  async getUserDraft(
    @Authorized('id') userId: string,
    @Param('draftId', new ParseUUIDPipe({ version: '4' })) draftId: string,
  ): Promise<AiDraftResponseDto> {
    const draft = await this.queryBus.execute<GetUserAiDraftQuery, AiDraftCv>(
      new GetUserAiDraftQuery(draftId, userId),
    );

    return AiDraftResponseMapper.toResponse(draft);
  }

  @Post()
  @Authorization()
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
        AiProviderType.GEMINI,
        dto.file
          ? { originName: dto.file.originalname, buffer: dto.file.buffer }
          : undefined,
      ),
    );

    return draftId;
  }

  @Delete(':draftId')
  @Authorization()
  async moveToDelete(
    @Authorized('id') userId: string,
    @Param('draftId', new ParseUUIDPipe({ version: '4' })) draftId: string,
  ) {
    await this.commandBus.execute<MoveAiDraftToDeleteCommand>(
      new MoveAiDraftToDeleteCommand(draftId, userId),
    );
  }
}
