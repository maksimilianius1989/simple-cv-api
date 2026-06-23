import { GenerateAiDraftCommand } from '@draft/application/commands/generate-ai-draft/generate-ai-draft.command';
import { AiDraftCv } from '@draft/domain/entities/ai-draft-cv';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AiProviderGatewayService } from '@draft/application/services/ai-provider-gateway.service';
import { AiDraftContent } from '@draft/domain/value-objects/ai-draft-content.vo';
import { AiDraftCvStatus } from '@draft/domain/enums/ai-draft-cv-status.enum';

@CommandHandler(GenerateAiDraftCommand)
export class GenerateAiDraftHandler implements ICommandHandler<GenerateAiDraftCommand> {
  constructor(private readonly gateway: AiProviderGatewayService) {}

  async execute(command: GenerateAiDraftCommand): Promise<AiDraftCv> {
    const ai = await this.gateway.generate(command.prompt, command.provider);

    const content = new AiDraftContent(
      ai.name,
      ai.position,
      ai.summary,
      ai.skills,
    );

    const draft = new AiDraftCv(
      crypto.randomUUID(),
      command.userId,
      command.prompt,
      content,
      AiDraftCvStatus.GENERATED,
      new Date(),
    );

    return draft;
  }
}
