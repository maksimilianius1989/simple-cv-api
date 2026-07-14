import { AiDraftCvStatus } from '../enums/ai-draft-cv-status.enum';
import { AiDraftContent } from '../value-objects/ai-draft-content.vo';
import {
  CompleteGenerationException,
  EmptyPromptException,
  FailContentException,
} from '../exceptions';
import { AiProviderType } from '@shared/domain/enums/ai-provider-type.enum';

export interface IAiDraftCvParams {
  id: string;
  userId: string;
  prompt: string;
  content?: AiDraftContent;
  status: AiDraftCvStatus;
  provider?: AiProviderType;
  error?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class AiDraftCv {
  private readonly props: IAiDraftCvParams;

  private constructor(props: IAiDraftCvParams) {
    this.props = { ...props };
  }

  static createDraft(params: {
    id: string;
    userId: string;
    prompt: string;
  }): AiDraftCv {
    if (!params.prompt || params.prompt.trim() === '') {
      throw new EmptyPromptException();
    }

    return new AiDraftCv({
      id: params.id,
      userId: params.userId,
      prompt: params.prompt,
      status: AiDraftCvStatus.DRAFT,
      createdAt: new Date(),
    });
  }

  static reconstruct(props: IAiDraftCvParams): AiDraftCv {
    return new AiDraftCv({ ...props });
  }

  completeGeneration(content: AiDraftContent, provider: AiProviderType): void {
    if (this.props.status !== AiDraftCvStatus.DRAFT) {
      throw new CompleteGenerationException(this.props.status);
    }

    this.props.content = content;
    this.props.status = AiDraftCvStatus.GENERATED;
    this.props.provider = provider;
    this.props.updatedAt = new Date();
  }

  failGeneration(params: {
    provider: AiProviderType;
    error: string;
    content?: AiDraftContent;
  }) {
    this.props.content = params.content;
    this.props.provider = params.provider;
    this.props.error = params.error;
    this.props.status = AiDraftCvStatus.FAILED;
    this.props.updatedAt = new Date();
  }

  moveToDelete(): void {
    this.props.status = AiDraftCvStatus.DELETED;
    this.props.updatedAt = new Date();
  }

  isOwner(userId: string): boolean {
    return this.props.userId === userId;
  }

  startGenerationContent() {
    this.props.status = AiDraftCvStatus.GENERATION;
    this.props.updatedAt = new Date();
  }

  setGeneratedContent(content: AiDraftContent, provider: AiProviderType) {
    if (this.props.status === AiDraftCvStatus.GENERATED) {
      throw new FailContentException();
    }

    this.props.content = content;
    this.props.status = AiDraftCvStatus.GENERATED;
    this.props.provider = provider;
    this.props.updatedAt = new Date();
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get content(): AiDraftContent {
    if (
      this.props.status !== AiDraftCvStatus.GENERATED ||
      !this.props.content
    ) {
      throw new FailContentException();
    }

    return this.props.content;
  }

  get provider(): AiProviderType | undefined {
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
    return (
      this.props.status === AiDraftCvStatus.GENERATED && !!this.props.content
    );
  }
}
