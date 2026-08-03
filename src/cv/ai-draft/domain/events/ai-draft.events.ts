import { AiProviderType } from '@shared/domain/enums/ai-provider-type.enum';
import { AiDraftCvStatus } from '../enums/ai-draft-cv-status.enum';

export class AiDraftCreatedEvent {
  constructor(
    public readonly draftId: string,
    public readonly userId: string,
    public readonly templateId: string,
    public readonly prompt: string,
    public readonly provider: AiProviderType,
    public readonly hasAvatar: boolean,
  ) {}
}

export class AiDraftAvatarUploadedEvent {
  constructor(
    public readonly draftId: string,
    public readonly userId: string,
    public readonly provider: AiProviderType,
  ) {}
}

export class AiDraftContentGeneratedEvent {
  constructor(
    public readonly draftId: string,
    public readonly templateId: string,
  ) {}
}

export class AiDraftPdfGeneratedEvent {
  constructor(
    public readonly draftId: string,
    public readonly userId: string,
  ) {}
}

export class AiDraftPreviewGeneratedEvent {
  constructor(
    public readonly draftId: string,
    public readonly userId: string,
  ) {}
}

export class AiDraftFailedEvent {
  constructor(
    public readonly draftId: string,
    public readonly status: AiDraftCvStatus,
    public readonly error: string,
  ) {}
}
