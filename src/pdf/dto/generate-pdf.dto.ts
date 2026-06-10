export class GeneratePdfDto {
  name?: string;

  position?: string;

  summary?: string;

  skills?: string[];

  template?: string;

  salary?: string;

  coverLetter?: string;

  avatar?: string | null;

  experience?: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
}
