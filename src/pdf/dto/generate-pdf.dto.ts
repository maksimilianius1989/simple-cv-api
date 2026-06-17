export class GeneratePdfDto {
  name?: string;

  position?: string;

  contacts?: {
    phone?: string;
    email?: string;
    location?: string;
    linkedin?: string;
  };

  employmentType?: string;

  repositories?: {
    name: string;
    url: string;
  }[];

  summary?: string;

  skills?: string[];

  template?: string;

  salary?: string;

  coverLetter?: string;

  avatar?: string | null;

  qr?: string;

  experience?: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
}
