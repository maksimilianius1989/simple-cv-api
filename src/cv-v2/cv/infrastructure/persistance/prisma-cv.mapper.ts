import { Cv } from '../../domain/entities/cv';
import {
  Contact,
  CvContent,
  Experience,
  Repository,
} from '../../domain/value-objects/cv-content.vo'; // Імпорт через відносний шлях, щоб зняти баг еліасів
import { Cv as PrismaCvModel } from '@prisma/client';
import { z } from 'zod';

const RepositorySchema = z.object({
  name: z.string(),
  url: z.string(),
});

const ExperienceSchema = z.object({
  company: z.string(),
  position: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string(),
});

type SafeRepositoryDto = z.infer<typeof RepositorySchema>;
type SafeExperienceDto = z.infer<typeof ExperienceSchema>;

const CvContentSchema = z.object({
  name: z.string().optional(),
  position: z.string().optional(),
  employmentType: z.string().optional(),
  summary: z.string().optional(),
  skills: z.array(z.string()).optional(),
  template: z.string().optional(),
  salary: z.string().optional(),
  contacts: z
    .object({
      phone: z.string().optional(),
      email: z.string().optional(),
      location: z.string().optional(),
      linkedin: z.string().optional(),
    })
    .optional(),
  repositories: z.array(RepositorySchema).optional(),
  experience: z.array(ExperienceSchema).optional(),
});

export class PrismaCvMapper {
  static toPrisma(domainCv: Cv): Partial<PrismaCvModel> {
    return {
      id: domainCv.id,
      userId: domainCv.userId,
      title: domainCv.getTitle(),
      content: JSON.parse(JSON.stringify(domainCv.getContent())),
      isPublished: domainCv.getIsPublished(),
      createdAt: domainCv.getCreatedAt(),
      updatedAt: domainCv.getUpdatedAt(),
    };
  }

  static toDomain(prismaCv: PrismaCvModel): Cv {
    const safeContent = CvContentSchema.parse(prismaCv.content);

    const cvContent = new CvContent({
      name: safeContent.name,
      position: safeContent.position,
      employmentType: safeContent.employmentType,
      summary: safeContent.summary,
      skills: safeContent.skills,
      template: safeContent.template,
      salary: safeContent.salary,
      contacts: safeContent.contacts
        ? new Contact(safeContent.contacts)
        : undefined,
      repositories: safeContent.repositories
        ? safeContent.repositories.map(
            (r: SafeRepositoryDto): Repository => new Repository(r),
          )
        : undefined,
      experience: safeContent.experience
        ? safeContent.experience.map(
            (e: SafeExperienceDto): Experience => new Experience(e),
          )
        : undefined,
    });

    return new Cv(
      prismaCv.id,
      prismaCv.userId,
      prismaCv.title,
      cvContent,
      prismaCv.isPublished,
      prismaCv.createdAt,
      prismaCv.updatedAt,
    );
  }
}
