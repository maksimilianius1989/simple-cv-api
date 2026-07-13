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
import { Authorization } from '../../../auth/decorators/authorization.decorator';
import { Authorized } from '../../../auth/decorators/authorized.decorator';
import { CreateAIDraftCommand } from '@ai-draft/application/commands/create/create-ai-draft.command';
import { CreateDraftRequestDto } from './dtos/create-draft.dto';
import { MoveAiDraftToDeleteCommand } from '@ai-draft/application/commands/move-to-delete/move-ai-draft-to-delete.command';

@Controller('ai-draft')
export class AiDraftCvController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @Authorization()
  @HttpCode(HttpStatus.OK)
  async create(
    @Authorized('id') userId: string,
    @Body() dto: CreateDraftRequestDto,
  ): Promise<string> {
    const draftId = crypto.randomUUID();

    await this.commandBus.execute(
      new CreateAIDraftCommand(draftId, userId, dto.prompt),
    );

    return draftId;
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
