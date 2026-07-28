export class AiDraftResponseDto {
  id!: string;
  userId!: string;
  templateId!: string;
  prompt!: string;
  content?: IAiDraftContentDto;
  status!: string;
  provider!: string;
  error?: string;
  createdAt!: string;
  updatedAt?: string;
}

export interface IAiDraftContentDto {
  name?: string;
  position?: string;
  contacts?: IContactsDto;
  employmentType?: string;
  portfolios: IPortfolioDto[];
  summary?: string;
  skills?: string[];
  salary?: string;
  coverLetter?: string;
  experience?: IExperienceDto[];
}

export interface IContactsDto {
  phone?: string;
  email?: string;
  location?: string;
  linkedin?: string;
}

export interface IPortfolioDto {
  name?: string;
  url?: string;
}

export interface IExperienceDto {
  company?: string;
  position?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}
