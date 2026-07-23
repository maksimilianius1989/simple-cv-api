import { Cv } from '../../domain/entities/cv.entity';
import { Cv as PrismaCvModel } from '@prisma/client';
import { z } from 'zod';

const PortfolioLinkSchema = z.object({
  name: z.string(),
  url: z.string(),
});

const ExperienceSchema = z.object({
  company: z.string(),
  position: z.string(),
  startDate: z.coerce.date().nullish(),
  endDate: z.coerce.date().nullish(),
  description: z.string(),
});

const ContactsSchema = z.object({
  phone: z.string().optional(),
  email: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().optional(),
});

const CvContentSchema = z.object({
  name: z.string().optional(),
  position: z.string().optional(),
  employmentType: z.string().optional(),
  summary: z.string().optional(),
  skills: z.array(z.string()).optional(),
  salary: z.string().optional(),
  contacts: ContactsSchema.optional(),
  portfolios: z.array(PortfolioLinkSchema).optional(),
  experience: z.array(ExperienceSchema).optional(),
});

export class PrismaCvMapper {
  static toPrisma(domainCv: Cv): Partial<PrismaCvModel> {
    return {
      id: domainCv.id,
      userId: domainCv.userId,
      templateId: domainCv.templateId,
      title: domainCv.title,
      content: JSON.parse(JSON.stringify(domainCv.content)),
      isPublished: domainCv.isPublished,
      publishedAt: domainCv.publishedAt ?? null,
      publishedUntil: domainCv.publishedAt ?? null,
      viewsCount: domainCv.viewsCount,
      publicSlug: domainCv.publicSlug ?? null,
      isDeactivated: domainCv.isDeactivated,
      coverLetter: domainCv.coverLetter ?? null,
      createdAt: domainCv.createdAt,
      updatedAt: domainCv.updatedAt,
    };
  }

  static toDomain(prismaCv: PrismaCvModel): Cv {
    const safeContent = CvContentSchema.parse(prismaCv.content);

    return Cv.reconstruct({
      id: prismaCv.id,
      userId: prismaCv.userId,
      templateId: prismaCv.templateId,
      title: prismaCv.title,
      content: {
        name: safeContent.name,
        position: safeContent.position,
        employmentType: safeContent.employmentType,
        summary: safeContent.summary,
        skills: safeContent.skills,
        salary: safeContent.salary,
        contacts: safeContent.contacts,
        portfolios: safeContent.portfolios,
        experience: safeContent.experience,
      },
      isPublished: prismaCv.isPublished,
      publishedAt: prismaCv.publishedAt ?? undefined,
      publishedUntil: prismaCv.publishedUntil ?? undefined,
      viewsCount: prismaCv.viewsCount,
      publicSlug: prismaCv.publicSlug ?? undefined,
      isDeactivated: prismaCv.isDeactivated,
      coverLetter: prismaCv.coverLetter ?? undefined,
      createdAt: prismaCv.createdAt,
      updatedAt: prismaCv.updatedAt,
    });
  }
}
