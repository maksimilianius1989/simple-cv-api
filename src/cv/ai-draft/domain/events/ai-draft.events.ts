import { AiProviderType } from '@shared/domain/enums/ai-provider-type.enum';
import { AiDraftCvStatus } from '../enums/ai-draft-cv-status.enum';

export class AiDraftCreatedEvent {
  constructor(
    public readonly draftId: string,
    public readonly userId: string,
    public readonly status: AiDraftCvStatus,
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
    public readonly status: AiDraftCvStatus,
    public readonly provider: AiProviderType,
  ) {}
}

export class AiDraftContentGeneratedEvent {
  constructor(
    public readonly draftId: string,
    public readonly userId: string,
    public readonly status: AiDraftCvStatus,
    public readonly templateId: string,
  ) {}
}

export class AiDraftPdfGeneratedEvent {
  constructor(
    public readonly draftId: string,
    public readonly userId: string,
    public readonly status: AiDraftCvStatus,
  ) {}
}

export class AiDraftPreviewGeneratedEvent {
  constructor(
    public readonly draftId: string,
    public readonly userId: string,
    public readonly status: AiDraftCvStatus,
  ) {}
}

export class AiDraftThumbnailGeneratedEvent {
  constructor(
    public readonly draftId: string,
    public readonly userId: string,
    public readonly status: AiDraftCvStatus,
  ) {}
}

export class AiDraftCompletedGeneratedEvent {
  constructor(
    public readonly draftId: string,
    public readonly userId: string,
    public readonly status: AiDraftCvStatus,
  ) {}
}

export class AiDraftFailedEvent {
  constructor(
    public readonly draftId: string,
    public readonly userId: string,
    public readonly status: AiDraftCvStatus,
    public readonly error: string,
  ) {}
}

export class AiDraftDeletedEvent {
  constructor(
    public readonly draftId: string,
    public readonly userId: string,
    public readonly status: AiDraftCvStatus,
  ) {}
}
