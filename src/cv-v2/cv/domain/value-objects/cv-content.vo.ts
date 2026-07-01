export class Contact {
  public readonly phone?: string;
  public readonly email?: string;
  public readonly location?: string;
  public readonly linkedin?: string;

  constructor(init?: Partial<Contact>) {
    Object.assign(this, init);
  }
}

export class Repository {
  public readonly name!: string;
  public readonly url!: string;

  constructor(init?: Partial<Repository>) {
    Object.assign(this, init);
  }
}

export class Experience {
  public readonly company!: string;
  public readonly position!: string;
  public readonly startDate!: string;
  public readonly endDate!: string;
  public readonly description!: string;

  constructor(init?: Partial<Experience>) {
    Object.assign(this, init);
  }
}

export class CvContent {
  public readonly name?: string;
  public readonly position?: string;
  public readonly contacts?: Contact;
  public readonly employmentType?: string;
  public readonly repositories?: Repository[];
  public readonly summary?: string;
  public readonly skills?: string[];
  public readonly template?: string;
  public readonly salary?: string;
  public readonly experience?: Experience[];

  constructor(init?: Partial<CvContent>) {
    Object.assign(this, init);
  }
}