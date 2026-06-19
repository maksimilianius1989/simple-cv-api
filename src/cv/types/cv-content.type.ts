export class CvContent {
  name?: string;
  position?: string;
  contacts?: Contact;
  employmentType?: string;
  repositories?: Repository[];
  summary?: string;
  skills?: string[];
  template?: string;
  salary?: string;
  experience?: Experience[];
}

export class Contact {
  phone?: string;
  email?: string;
  location?: string;
  linkedin?: string;
}

export class Repository {
  name!: string;
  url!: string;
}

export class Experience {
  company!: string;
  position!: string;
  startDate!: string;
  endDate!: string;
  description!: string;
}
