export interface IAiDraftContentProps {
  name?: string;
  position?: string;
  contacts?: IContacts;
  employmentType?: string;
  portfolios?: IPortfolio[];
  summary?: string;
  skills?: string[];
  salary?: string;
  coverLetter?: string;
  experience?: IExperience[];
}
export class AiDraftContent {
  private props: IAiDraftContentProps;

  constructor(props: IAiDraftContentProps) {
    this.props = { ...props };
  }

  toObject(): IAiDraftContentProps {
    return { ...this.props };
  }

  get name(): string | undefined {
    return this.props?.name;
  }

  get position(): string | undefined {
    return this.props?.position;
  }

  get contacts(): IContacts | undefined {
    return this.props?.contacts;
  }

  get employmentType(): string | undefined {
    return this.props?.employmentType;
  }

  get portfolios() {
    return this.props?.portfolios;
  }

  get summary() {
    return this.props?.summary;
  }

  get skills() {
    return this.props?.skills;
  }

  get salary() {
    return this.props?.salary;
  }

  get coverLetter() {
    return this.props?.coverLetter;
  }

  get experience() {
    return this.props?.experience;
  }
}

export interface IContacts {
  phone?: string;
  email?: string;
  location?: string;
  linkedin?: string;
}

export interface IPortfolio {
  name?: string;
  url?: string;
}

export interface IExperience {
  company?: string;
  position?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}
