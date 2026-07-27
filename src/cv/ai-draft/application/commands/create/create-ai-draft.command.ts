import { AiProviderType } from '@shared/domain/enums/ai-provider-type.enum';

export class CreateAIDraftCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly prompt: string,
    public readonly provider: AiProviderType,
    public readonly avatar?: { originName: string; buffer: Buffer },
  ) {}
}
