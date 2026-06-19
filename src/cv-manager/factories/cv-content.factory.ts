import { CvContent } from 'src/cv/types/cv-content.type';
import { CreateCvDto } from '../dto/create-cv.dto';

export class CvContentFactory {
  static fromCreateCvDto(dto: CreateCvDto): CvContent {
    return {
      name: dto.name,
      position: dto.position,
      contacts: dto.contacts,
      employmentType: dto.employmentType,
      repositories: dto.repositories,
      summary: dto.summary,
      skills: dto.skills,
      template: dto.template,
      salary: dto.salary,
      experience: dto.experience,
    };
  }
}
