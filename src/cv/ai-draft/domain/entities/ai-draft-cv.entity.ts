import { AggregateRoot } from '@nestjs/cqrs';
import { AiDraftCvStatus } from '../enums/ai-draft-cv-status.enum';
import { EmptyPromptException } from '../exceptions';
import { AiProviderType } from '@shared/domain/enums/ai-provider-type.enum';
import {
  AiDraftCreatedEvent,
  AiDraftAvatarUploadedEvent,
  AiDraftContentGeneratedEvent,
  AiDraftPdfGeneratedEvent,
  AiDraftPreviewGeneratedEvent,
  AiDraftFailedEvent,
  AiDraftDeletedEvent,
  AiDraftThumbnailGeneratedEvent,
  AiDraftCompletedGeneratedEvent,
} from '../events/ai-draft.events';
import { AiDraftContent } from '@shared/domain/value-objects/ai-draft-content.vo';

export interface IAiDraftCvProps {
  id: string;
  userId: string;
  templateId: string;
  prompt: string;
  content?: AiDraftContent;
  status: AiDraftCvStatus;
  provider: AiProviderType;
  error?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class AiDraftCv extends AggregateRoot {
  private readonly props: IAiDraftCvProps;

  private constructor(props: IAiDraftCvProps) {
    super();
    this.props = { ...props };
  }

  static createDraft(params: {
    id: string;
    userId: string;
    templateId: string;
    prompt: string;
    provider: AiProviderType;
    hasAvatar: boolean;
  }): AiDraftCv {
    if (!params.prompt || params.prompt.trim() === '') {
      throw new EmptyPromptException();
    }

    const draft = new AiDraftCv({
      id: params.id,
      userId: params.userId,
      templateId: params.templateId,
      prompt: params.prompt,
      provider: params.provider,
      status: AiDraftCvStatus.CREATED,
      createdAt: new Date(),
    });

    draft.apply(
      new AiDraftCreatedEvent(
        params.id,
        params.userId,
        AiDraftCvStatus.CREATED,
        params.templateId,
        params.prompt,
        params.provider,
        params.hasAvatar,
      ),
    );

    return draft;
  }

  static reconstruct(props: IAiDraftCvProps): AiDraftCv {
    return new AiDraftCv({ ...props });
  }

  startGenerationContent(): void {
    this.props.status = AiDraftCvStatus.GENERATING_CONTENT;
    this.props.updatedAt = new Date();
  }

  setGeneratedContent(content: AiDraftContent, provider: AiProviderType): void {
    this.props.content = content;
    this.props.status = AiDraftCvStatus.CONTENT_GENERATED;
    this.props.provider = provider;
    this.props.updatedAt = new Date();

    this.apply(
      new AiDraftContentGeneratedEvent(
        this.props.id,
        this.props.userId,
        this.props.status,
        this.props.templateId,
      ),
    );
  }

  markAvatarUploaded(): void {
    this.props.status = AiDraftCvStatus.AVATAR_UPLOADED;
    this.props.updatedAt = new Date();
    this.apply(
      new AiDraftAvatarUploadedEvent(
        this.props.id,
        this.props.userId,
        this.props.status,
        this.props.provider,
      ),
    );
  }

  markPdfGenerated(): void {
    this.props.status = AiDraftCvStatus.PDF_GENERATED;
    this.props.updatedAt = new Date();
    this.apply(
      new AiDraftPdfGeneratedEvent(
        this.props.id,
        this.props.userId,
        this.props.status,
      ),
    );
  }

  markPreviewGenerated(): void {
    this.props.status = AiDraftCvStatus.PREVIEW_GENERATED;
    this.props.updatedAt = new Date();
    this.apply(
      new AiDraftPreviewGeneratedEvent(
        this.props.id,
        this.props.userId,
        this.props.status,
      ),
    );
  }

  markPreviewThumbnailGenerated(): void {
    this.props.status = AiDraftCvStatus.PREVIEW_THUMBNAIL_GENERATED;
    this.props.updatedAt = new Date();
    this.apply(
      new AiDraftThumbnailGeneratedEvent(
        this.props.id,
        this.props.userId,
        this.props.status,
      ),
    );
  }

  markCompleted(): void {
    this.props.status = AiDraftCvStatus.COMPLETED;
    this.props.updatedAt = new Date();

    this.apply(
      new AiDraftCompletedGeneratedEvent(
        this.props.id,
        this.props.userId,
        this.props.status,
      ),
    );
  }

  markDeleted(): void {
    this.props.status = AiDraftCvStatus.DELETED;
    this.props.updatedAt = new Date();

    this.apply(
      new AiDraftDeletedEvent(
        this.props.id,
        this.props.userId,
        this.props.status,
      ),
    );
  }

  failGeneration(params: {
    provider: AiProviderType;
    error: string;
    content?: AiDraftContent;
  }): void {
    if (params.content) this.props.content = params.content;
    this.props.provider = params.provider;
    this.props.error = params.error;
    this.props.status = AiDraftCvStatus.FAILED;
    this.props.updatedAt = new Date();

    this.apply(
      new AiDraftFailedEvent(
        this.props.id,
        this.props.userId,
        this.props.status,
        params.error,
      ),
    );
  }

  isOwner(userId: string): boolean {
    return this.props.userId === userId;
  }

  // --- Getters ---

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get templateId(): string {
    return this.props.templateId;
  }

  get content(): AiDraftContent | undefined {
    return this.props.content;
  }

  get provider(): AiProviderType {
    return this.props.provider;
  }

  get error(): string | undefined {
    return this.props.error;
  }

  get status(): AiDraftCvStatus {
    return this.props.status;
  }

  get prompt(): string {
    return this.props.prompt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  get isDeleted(): boolean {
    return this.props.status === AiDraftCvStatus.DELETED;
  }

  get hasContent(): boolean {
    return !!this.props.content;
  }
}
