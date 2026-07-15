import { AiDraftContent } from '@ai-draft/domain/value-objects/ai-draft-content.vo';

import { z } from 'zod';

const ContactsSchema = z.object({
  phone: z.string().optional(),
  email: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().optional(),
});

const PortfolioSchema = z.object({
  name: z.string().optional(),
  url: z.string().optional(),
});

const ExperienceSchema = z.object({
  company: z.string().optional(),
  position: z.string().optional(),
  startDate: z.coerce.string().optional(),
  endDate: z.coerce.string().optional(),
  description: z.string().optional(),
});

export const AiDraftContentSchema = z.object({
  name: z.string().optional(),
  position: z.string().optional(),
  contacts: ContactsSchema.optional(),
  employmentType: z.string().optional(),
  portfolios: z.array(PortfolioSchema).optional(),
  summary: z.string().optional(),
  skills: z.array(z.string()).optional(),
  salary: z.string().optional(),
  coverLetter: z.string().optional(),
  experience: z.array(ExperienceSchema).optional(),
});

export class PrismaAiDraftContentMapper {
  static toPersistence(content: AiDraftContent) {
    return content.toObject();
  }

  static toDomain(data: unknown): AiDraftContent {
    const safeData = AiDraftContentSchema.parse(data);
    return new AiDraftContent({
      name: safeData.name,
      position: safeData.position,
      contacts: safeData.contacts,
      employmentType: safeData.employmentType,
      portfolios: safeData.portfolios,
      summary: safeData.summary,
      skills: safeData.skills,
      salary: safeData.salary,
      coverLetter: safeData.coverLetter,
      experience: safeData.experience,
    });
  }
}
