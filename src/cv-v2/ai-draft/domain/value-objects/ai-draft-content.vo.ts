export interface IAiDraftContentParams {
  name?: string;
  position?: string;
  contacts?: Contacts;
  employmentType?: string;
  portfolios?: Portfolio[];
  summary?: string;
  skills?: string[];
  salary?: string;
  coverLetter?: string;
  experience?: Experience[];
}
export class AiDraftContent {
  private props: IAiDraftContentParams;

  constructor(props: IAiDraftContentParams) {
    this.props = { ...props };
  }

  toObject() {
    return { ...this.props };
  }

  get name() {
    return this.props.name;
  }

  get position() {
    return this.props?.position;
  }

  get contacts() {
    return this.props?.contacts;
  }

  get employmentType() {
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

export interface Contacts {
  phone?: string;
  email?: string;
  location?: string;
  linkedin?: string;
}

export interface Portfolio {
  name?: string;
  url?: string;
}

export interface Experience {
  company?: string;
  position?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}
