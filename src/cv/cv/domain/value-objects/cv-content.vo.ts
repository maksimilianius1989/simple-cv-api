export interface IContact {
  readonly phone?: string;
  readonly email?: string;
  readonly location?: string;
  readonly linkedin?: string;
}

export interface IPortfolioLink {
  readonly name: string;
  readonly url: string;
}

export interface IExperience {
  readonly company: string;
  readonly position: string;
  readonly startDate: Date;
  readonly endDate?: Date;
  readonly description: string;
}

export interface ICvContent {
  readonly name?: string;
  readonly position?: string;
  readonly contacts?: IContact;
  readonly employmentType?: string;
  readonly portfolios?: IPortfolioLink[];
  readonly summary?: string;
  readonly skills?: string[];
  readonly template?: string;
  readonly salary?: string;
  readonly experience?: IExperience[];
}
