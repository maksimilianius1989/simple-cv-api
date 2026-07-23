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

const CvRawSchema = z.object({
  id: z.string(),
  userId: z.string(),
  templateId: z.string(),
  title: z.string(),
  content: z.unknown(),
  isPublished: z.boolean(),
  publishedAt: z.coerce.date().nullish(),
  publishedUntil: z.coerce.date().nullish(),
  viewsCount: z.number(),
  publicSlug: z.string().nullish(),
  isDeactivated: z.boolean(),
  coverLetter: z.string().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type CvRawData = Record<string, any> | PrismaCvModel;

export class CvMapper {
  static toPersistence(domainCv: Cv): Record<string, any> {
    return {
      id: domainCv.id,
      userId: domainCv.userId,
      templateId: domainCv.templateId,
      title: domainCv.title,
      content: JSON.parse(JSON.stringify(domainCv.content)),
      isPublished: domainCv.isPublished,
      publishedAt: domainCv.publishedAt ?? null,
      publishedUntil: domainCv.publishedUntil ?? null,
      viewsCount: domainCv.viewsCount,
      publicSlug: domainCv.publicSlug ?? null,
      isDeactivated: domainCv.isDeactivated,
      coverLetter: domainCv.coverLetter ?? null,
      createdAt: domainCv.createdAt,
      updatedAt: domainCv.updatedAt,
    };
  }

  static toDomain(rawCv: CvRawData): Cv {
    const validRaw = CvRawSchema.parse(rawCv);
    const safeContent = CvContentSchema.parse(validRaw.content);

    return Cv.reconstruct({
      id: validRaw.id,
      userId: validRaw.userId,
      templateId: validRaw.templateId,
      title: validRaw.title,
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
      isPublished: validRaw.isPublished,
      publishedAt: validRaw.publishedAt ?? undefined,
      publishedUntil: validRaw.publishedUntil ?? undefined,
      viewsCount: validRaw.viewsCount,
      publicSlug: validRaw.publicSlug ?? undefined,
      isDeactivated: validRaw.isDeactivated,
      coverLetter: validRaw.coverLetter ?? undefined,
      createdAt: validRaw.createdAt,
      updatedAt: validRaw.updatedAt,
    });
  }
}
