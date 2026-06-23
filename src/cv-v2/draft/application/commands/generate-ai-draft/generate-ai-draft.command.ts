import { AiProviderType } from '@draft/domain/entities/ai-provider-key';

export class GenerateAiDraftCommand {
  constructor(
    public readonly userId: string,
    public readonly provider: AiProviderType,
    public readonly prompt: string,
  ) {}
}
