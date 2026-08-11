import { AiProviderType } from '@shared/domain/enums/ai-provider-type.enum';
import { AiDraftCvStatus } from '../enums/ai-draft-cv-status.enum';

export class DraftCreatedEntityEvent {
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

export class DraftAvatarUploadedEntityEvent {
  constructor(
    public readonly draftId: string,
    public readonly userId: string,
    public readonly status: AiDraftCvStatus,
    public readonly provider: AiProviderType,
  ) {}
}

export class DraftContentGeneratedEntityEvent {
  constructor(
    public readonly draftId: string,
    public readonly userId: string,
    public readonly status: AiDraftCvStatus,
    public readonly templateId: string,
  ) {}
}

export class DraftPdfGeneratedEntityEvent {
  constructor(
    public readonly draftId: string,
    public readonly userId: string,
    public readonly status: AiDraftCvStatus,
  ) {}
}

export class DraftPreviewGeneratedEntityEvent {
  constructor(
    public readonly draftId: string,
    public readonly userId: string,
    public readonly status: AiDraftCvStatus,
  ) {}
}

export class DraftThumbnailGeneratedEntityEvent {
  constructor(
    public readonly draftId: string,
    public readonly userId: string,
    public readonly status: AiDraftCvStatus,
  ) {}
}

export class DraftCompletedGeneratedEntityEvent {
  constructor(
    public readonly draftId: string,
    public readonly userId: string,
    public readonly status: AiDraftCvStatus,
  ) {}
}

export class DraftFailedEntityEvent {
  constructor(
    public readonly draftId: string,
    public readonly userId: string,
    public readonly status: AiDraftCvStatus,
    public readonly error: string,
  ) {}
}

export class AiDraftDeletedEntityEvent {
  constructor(
    public readonly draftId: string,
    public readonly userId: string,
    public readonly status: AiDraftCvStatus,
  ) {}
}
