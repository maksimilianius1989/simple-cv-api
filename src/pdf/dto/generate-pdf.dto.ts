export class GeneratePdfDto {
  name?: string;

  position?: string;

  summary?: string;

  skills?: string[];

  template?: string;

  experience?: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
}
