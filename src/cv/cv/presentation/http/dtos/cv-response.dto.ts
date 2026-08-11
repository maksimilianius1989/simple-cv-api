export class CvResponseDto {
  id!: string;
  userId!: string;
  templateId!: string;
  title!: string;
  content!: ICvContentDto;
  isPublished!: boolean;
  publishedAt?: string;
  publishedUntil?: string;
  viewsCount!: number;
  publicSlug?: string;
  coverLetter?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IContactDto {
  readonly phone?: string;
  readonly email?: string;
  readonly location?: string;
  readonly linkedin?: string;
}

export interface IPortfolioLinkDto {
  readonly name: string;
  readonly url: string;
}

export interface IExperienceDto {
  readonly company: string;
  readonly position: string;
  readonly startDate?: string;
  readonly endDate?: string;
  readonly description: string;
}

export interface ICvContentDto {
  readonly name?: string;
  readonly position?: string;
  readonly contacts?: IContactDto;
  readonly employmentType?: string;
  readonly portfolios?: IPortfolioLinkDto[];
  readonly summary?: string;
  readonly skills?: string[];
  readonly salary?: string;
  readonly experience?: IExperienceDto[];
}
