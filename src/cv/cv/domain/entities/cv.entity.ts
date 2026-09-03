import { AggregateRoot } from '@nestjs/cqrs';
import { ICvContent } from '@shared/domain/value-objects/cv-content.vo';
import { CvStatus } from '../enums/cv-status.enum';
import {
  CvAvatarUploadedEntityEvent,
  CvCompletedEntityEvent,
  CvCreateEntityEvent,
  CvSoftDeletedEntityEvent,
  CvFailedEntityEvent,
  CvPdfGeneratedEntityEvent,
  CvPreviewGeneratedEntityEvent,
  CvPublishEntityEvent,
  CvThumbnailGeneratedEntityEvent,
  CvUnpublishEntityEvent,
  CvRemovedEntityEvent,
} from '@cv/domain/events/cv.events';
import { CvPublicationException } from '../exceptions';

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

    this.checkPublichedAt(this.props.publishedAt);
    this.checkPublishedUntil(this.props.publishedUntil);
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

  markSoftDeleted(): void {
    this.props.status = CvStatus.DELETED;
    this.props.updatedAt = new Date();

    this.apply(
      new CvSoftDeletedEntityEvent(
        this.props.id,
        this.props.userId,
        this.props.status,
      ),
    );
  }

  markPublish(): void {
    if (!this.props.publishedUntil) {
      throw new CvPublicationException(
        `Cannot publish CV '${this.props.id}' becouse the publication end date not set`,
      );
    }

    if (this.props.publishedUntil <= new Date()) {
      throw new CvPublicationException(
        `Cannot publish CV '${this.props.id}' becouse the publication end date '${this.props.publishedUntil.toDateString()}' is in the past`,
      );
    }

    if (!this.props.publicSlug) {
      throw new CvPublicationException(
        `Cannot publish CV '${this.props.id}' becouse the publication slug not set`,
      );
    }

    this.props.isPublished = true;

    this.apply(
      new CvPublishEntityEvent(
        this.props.id,
        this.props.userId,
        this.props.status,
      ),
    );
  }

  markUnpublish(): void {
    this.props.isPublished = false;
    this.props.publishedAt = undefined;
    this.props.publishedUntil = undefined;

    this.apply(
      new CvUnpublishEntityEvent(
        this.props.id,
        this.props.userId,
        this.props.status,
      ),
    );
  }

  remove(): void {
    this.apply(
      new CvRemovedEntityEvent(
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

  set publishedAt(date: Date | undefined) {
    this.checkPublichedAt(date);

    this.props.publishedAt = date;
  }

  get publishedUntil(): Date | undefined {
    return this.props.publishedUntil;
  }

  set publishedUntil(date: Date | undefined) {
    this.checkPublishedUntil(date);

    this.props.publishedUntil = date;
  }

  get viewsCount(): number {
    return this.props.viewsCount;
  }

  get publicSlug(): string | undefined {
    return this.props.publicSlug;
  }

  set publicSlug(slug: string | undefined) {
    this.props.publicSlug = slug;
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

  private checkPublichedAt(date: Date | undefined) {
    if (
      date &&
      this.props.publishedUntil &&
      date >= this.props.publishedUntil
    ) {
      throw new CvPublicationException(
        `Cv with id ${this.props.id} cannot have the publishedAt date leter than its publishedUntil date.
        PublishedAt: '${date?.toISOString()}', publishedUntil: '${this.props.publishedUntil?.toISOString()}'`,
      );
    }
  }

  private checkPublishedUntil(date: Date | undefined) {
    if (date && this.props.publishedAt && date <= this.props.publishedAt) {
      throw new CvPublicationException(
        `Cv with id ${this.props.id} cannot have the publishedUntil date earlier than its publishedAt date.
        PublishedUntil: '${date?.toISOString()}', publishedAt: '${this.props.publishedAt?.toISOString()}'`,
      );
    }
  }
}
