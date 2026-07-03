import { CvContent } from '../value-objects/cv-content.vo';

export class Cv {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    private title: string,
    private content: CvContent,
    private isPublished: boolean,
    private createdAt: Date,
    private updatedAt: Date,
  ) {}

  static create(
    id: string,
    userId: string,
    title: string,
    content: CvContent,
  ): Cv {
    return new Cv(id, userId, title, content, false, new Date(), new Date());
  }

  getTitle(): string {
    return this.title;
  }

  getContent(): CvContent {
    return this.content;
  }

  getIsPublished(): boolean {
    return this.isPublished;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
