export interface IContactDto {
  readonly phone?: string;
  readonly email?: string;
  readonly location?: string;
  readonly linkedin?: string;
}

export interface IPortfolioLinkDto {
  readonly name?: string;
  readonly url?: string;
}

export interface IExperienceDto {
  readonly company?: string;
  readonly position?: string;
  readonly startDate?: Date | string | null;
  readonly endDate?: Date | string | null;
  readonly description?: string;
}

export interface ICvContentDto {
  readonly content: {
    readonly name?: string;
    readonly position?: string;
    readonly contacts?: IContactDto;
    readonly employmentType?: string;
    readonly portfolios?: IPortfolioLinkDto[];
    readonly summary?: string;
    readonly skills?: string[];
    readonly salary?: string;
    readonly experience?: IExperienceDto[];
  };
  readonly avatar?: string;
  readonly qr?: string;
}
