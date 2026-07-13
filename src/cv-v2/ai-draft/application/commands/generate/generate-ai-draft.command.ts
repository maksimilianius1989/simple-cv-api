import { AiProviderType } from '@shared/domain/enums/ai-provider-type.enum';

export class GenerateAiDraftCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly provider?: AiProviderType,
  ) {}
}
