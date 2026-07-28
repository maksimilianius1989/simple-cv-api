import { AiDraftCv } from '@ai-draft/domain/entities/ai-draft-cv.entity';
import {
  AiDraftResponseDto,
  IAiDraftContentDto,
  IContactsDto,
  IPortfolioDto,
  IExperienceDto,
} from '../dtos/ai-draft-response.dto';
import {
  AiDraftContent,
  IContacts,
  IExperience,
  IPortfolio,
} from '@ai-draft/domain/value-objects/ai-draft-content.vo';

export class AiDraftResponseMapper {
  static toResponse(draft: AiDraftCv): AiDraftResponseDto {
    const dto = new AiDraftResponseDto();

    dto.id = draft.id;
    dto.userId = draft.userId;
    dto.templateId = draft.templateId;
    dto.prompt = draft.prompt;
    dto.content = draft.content
      ? AiDraftResponseMapper.toContentResponse(draft.content)
      : undefined;
    dto.status = draft.status;
    dto.provider = draft.provider;
    dto.createdAt = draft.createdAt.toISOString();
    dto.updatedAt = draft.updatedAt?.toISOString();

    return dto;
  }

  static toResponseList(drafts: AiDraftCv[]): AiDraftResponseDto[] {
    return drafts.map((draft) => AiDraftResponseMapper.toResponse(draft));
  }

  private static toContentResponse(
    content: AiDraftContent,
  ): IAiDraftContentDto | undefined {
    if (!content) {
      return undefined;
    }

    return {
      name: content.name ?? undefined,
      position: content.name ?? undefined,
      contacts: AiDraftResponseMapper.toContactsResponse(content.contacts),
      employmentType: content.name ?? undefined,
      portfolios: AiDraftResponseMapper.toPortfoliosResponse(
        content.portfolios,
      ),
      summary: content.name ?? undefined,
      skills: content.skills ? [...content.skills] : [],
      salary: content.name ?? undefined,
      coverLetter: content.name ?? undefined,
      experience: AiDraftResponseMapper.toExperienceListResponse(
        content.experience,
      ),
    };
  }

  private static toContactsResponse(
    contacts?: IContacts,
  ): IContactsDto | undefined {
    if (!contacts) return undefined;

    return {
      phone: contacts.phone,
      email: contacts.email,
      location: contacts.location,
      linkedin: contacts.linkedin,
    };
  }

  private static toPortfoliosResponse(
    portfolios?: IPortfolio[],
  ): IPortfolioDto[] {
    if (!portfolios || portfolios.length === 0) return [];

    return portfolios.map((portfolio) => ({
      name: portfolio.name,
      url: portfolio.url,
    }));
  }

  private static toExperienceListResponse(
    experience?: IExperience[],
  ): IExperienceDto[] {
    if (!experience || experience.length === 0) return [];

    return experience.map((exp) => ({
      company: exp.company,
      position: exp.position,
      startDate: exp.startDate,
      endDate: exp.endDate,
      description: exp.description,
    }));
  }
}
