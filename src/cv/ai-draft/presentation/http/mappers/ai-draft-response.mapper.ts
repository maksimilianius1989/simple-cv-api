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
} from '@shared/domain/value-objects/ai-draft-content.vo';
import { DraftWithFilesDto } from '@ai-draft/application/queries/get-user-ai-drafts/get-user-ai-drafts.handler';

export class AiDraftResponseMapper {
  static toResponse(item: DraftWithFilesDto): AiDraftResponseDto {
    const dto = new AiDraftResponseDto();

    dto.id = item.draft.id;
    dto.userId = item.draft.userId;
    dto.templateId = item.draft.templateId;
    dto.prompt = item.draft.prompt;
    dto.content = item.draft.content
      ? AiDraftResponseMapper.toContentResponse(item.draft.content)
      : undefined;
    dto.status = item.draft.status;
    dto.files = item.files.map((file) => ({
      category: file.category,
      id: file.id,
    }));
    dto.provider = item.draft.provider;
    dto.createdAt = item.draft.createdAt.toISOString();
    dto.updatedAt = item.draft.updatedAt?.toISOString();

    return dto;
  }

  static toResponseList(drafts: DraftWithFilesDto[]): AiDraftResponseDto[] {
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
      position: content.position ?? undefined,
      contacts: AiDraftResponseMapper.toContactsResponse(content.contacts),
      employmentType: content.employmentType ?? undefined,
      portfolios: AiDraftResponseMapper.toPortfoliosResponse(
        content.portfolios,
      ),
      summary: content.summary ?? undefined,
      skills: content.skills ? [...content.skills] : [],
      salary: content.salary ?? undefined,
      coverLetter: content.coverLetter ?? undefined,
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
