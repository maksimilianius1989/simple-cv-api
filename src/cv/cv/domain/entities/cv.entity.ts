import { AggregateRoot } from '@nestjs/cqrs';
import { ICvContent } from '@shared/domain/value-objects/cv-content.vo';
import { CvStatus } from '../enums/cv-status.enum';
import {
  CvAvatarUploadedEntityEvent,
  CvCompletedEntityEvent,
  CvCreateEntityEvent,
  CvDeletedEntityEvent,
  CvFailedEntityEvent,
  CvPdfGeneratedEntityEvent,
  CvPreviewGeneratedEntityEvent,
  CvThumbnailGeneratedEntityEvent,
} from '@cv/domain/events/cv.events';

export interface ICvProps {
  id: string;
  userId: string;
  title: string;
  templateId: string;
  content: ICvContent;
  status: CvStatus;
  error?: string;
  isPublished: boolean;
  publishedAt?: Date;
  publishedUntil?: Date;
  viewsCount: number;
  publicSlug?: string;
  coverLetter?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Cv extends AggregateRoot {
  private readonly props: ICvProps;

  private constructor(props: ICvProps) {
    super();
    this.props = { ...props };
  }

  static create(params: {
    id: string;
    userId: string;
    title: string;
    templateId: string;
    content: ICvContent;
    coverLetter?: string;
  }): Cv {
    return new Cv({
      id: params.id,
      userId: params.userId,
      templateId: params.templateId,
      title: params.title,
      content: params.content,
      status: CvStatus.CREATED,
      coverLetter: params.coverLetter,
      isPublished: false,
      viewsCount: 0,
      createdAt: new Date(),
    });
  }

  static reconstruct(props: ICvProps): Cv {
    return new Cv({ ...props });
  }

  markCreated(): void {
    this.props.status = CvStatus.AVATAR_UPLOADED;
    this.props.updatedAt = new Date();

    this.apply(
      new CvCreateEntityEvent({
        cvId: this.props.id,
        userId: this.props.userId,
        status: this.props.status,
        templateId: this.props.templateId,
      }),
    );
  }

  markAvatarUploaded(): void {
    this.props.status = CvStatus.AVATAR_UPLOADED;
    this.props.updatedAt = new Date();

    this.apply(
      new CvAvatarUploadedEntityEvent({
        cvId: this.props.id,
        userId: this.props.userId,
        status: this.props.status,
        templateId: this.props.templateId,
      }),
    );
  }

  markPdfGenerated(): void {
    this.props.status = CvStatus.PDF_GENERATED;
    this.props.updatedAt = new Date();

    this.apply(
      new CvPdfGeneratedEntityEvent(
        this.props.id,
        this.props.userId,
        this.props.status,
      ),
    );
  }

  markPreviewGenerated(): void {
    this.props.status = CvStatus.PREVIEW_GENERATED;
    this.props.updatedAt = new Date();

    this.apply(
      new CvPreviewGeneratedEntityEvent(
        this.props.id,
        this.props.userId,
        this.props.status,
      ),
    );
  }

  markPreviewThumbnailGenerated(): void {
    this.props.status = CvStatus.PREVIEW_THUMBNAIL_GENERATED;
    this.props.updatedAt = new Date();

    this.apply(
      new CvThumbnailGeneratedEntityEvent(
        this.props.id,
        this.props.userId,
        this.props.status,
      ),
    );
  }

  markCompleted(): void {
    this.props.status = CvStatus.COMPLETED;
    this.props.updatedAt = new Date();

    this.apply(
      new CvCompletedEntityEvent(
        this.props.id,
        this.props.userId,
        this.props.status,
      ),
    );
  }

  markFailGeneration(error: string): void {
    this.props.status = CvStatus.FAILED;
    this.props.error = error;
    this.props.updatedAt = new Date();

    this.apply(
      new CvFailedEntityEvent({
        cvId: this.props.id,
        userId: this.props.userId,
        status: this.props.status,
        error: this.props.error,
      }),
    );
  }

  markDeleted(): void {
    this.props.status = CvStatus.DELETED;
    this.props.updatedAt = new Date();

    this.apply(
      new CvDeletedEntityEvent(
        this.props.id,
        this.props.userId,
        this.props.status,
      ),
    );
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get templateId(): string {
    return this.props.templateId;
  }

  get title(): string {
    return this.props.title;
  }

  get content(): ICvContent {
    return this.props.content;
  }

  get status(): CvStatus {
    return this.props.status;
  }

  get error(): string | undefined {
    return this.props.error;
  }

  get isPublished(): boolean {
    return this.props.isPublished;
  }

  get publishedAt(): Date | undefined {
    return this.props.publishedAt;
  }

  get publishedUntil(): Date | undefined {
    return this.props.publishedUntil;
  }

  get viewsCount(): number {
    return this.props.viewsCount;
  }

  get publicSlug(): string | undefined {
    return this.props.publicSlug;
  }

  get coverLetter(): string | undefined {
    return this.props.coverLetter;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  get isDeleted(): boolean {
    return this.props.status === CvStatus.DELETED;
  }
}
