export class Contact {
  readonly phone?: string;
  readonly email?: string;
  readonly location?: string;
  readonly linkedin?: string;

  constructor(init?: Partial<Contact>) {
    Object.assign(this, init);
  }
}

export class Repository {
  readonly name!: string;
  readonly url!: string;

  constructor(init?: Partial<Repository>) {
    Object.assign(this, init);
  }
}

export class Experience {
  readonly company!: string;
  readonly position!: string;
  readonly startDate!: string;
  readonly endDate!: string;
  readonly description!: string;

  constructor(init?: Partial<Experience>) {
    Object.assign(this, init);
  }
}

export class CvContent {
  readonly name?: string;
  readonly position?: string;
  readonly contacts?: Contact;
  readonly employmentType?: string;
  readonly repositories?: Repository[];
  readonly summary?: string;
  readonly skills?: string[];
  readonly template?: string;
  readonly salary?: string;
  readonly experience?: Experience[];

  constructor(init?: Partial<CvContent>) {
    Object.assign(this, init);
  }
}
