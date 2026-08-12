import { Cv } from '@cv/domain/entities/cv.entity';
import {
  CvResponseDto,
  IContactDto,
  ICvContentDto,
  IExperienceDto,
  IPortfolioLinkDto,
} from '../dtos/cv-response.dto';
import {
  IContact,
  ICvContent,
  IExperience,
  IPortfolioLink,
} from '@shared/domain/value-objects/cv-content.vo';
import { CvWithFilesDto } from '@cv/application/queries/get-user-cvs/get-user-cvs.handler';

export class CvResponseMapper {
  static toResponse(item: CvWithFilesDto): CvResponseDto {
    const dto = new CvResponseDto();

    dto.id = item.cv.id;
    dto.userId = item.cv.userId;
    dto.title = item.cv.title;
    dto.templateId = item.cv.templateId;
    dto.content = CvResponseMapper.toContentResponse(item.cv.content);
    dto.status = item.cv.status;
    dto.isPublished = item.cv.isPublished;
    dto.publishedAt = item.cv.publishedAt
      ? item.cv.publishedAt.toISOString()
      : undefined;
    dto.publishedUntil = item.cv.publishedUntil
      ? item.cv.publishedUntil.toISOString()
      : undefined;
    dto.viewsCount = item.cv.viewsCount;
    dto.publicSlug = item.cv.publicSlug;
    dto.coverLetter = item.cv.coverLetter;
    dto.createdAt = item.cv.createdAt
      ? item.cv.createdAt.toISOString()
      : undefined;
    dto.updatedAt = item.cv.updatedAt
      ? item.cv.updatedAt.toISOString()
      : undefined;
    dto.files = item.files.map((file) => ({
      category: file.category,
      id: file.id,
    }));

    return dto;
  }

  static toResponseList(cvs: CvWithFilesDto[]): CvResponseDto[] {
    return cvs.map((cv) => CvResponseMapper.toResponse(cv));
  }

  private static toContentResponse(content?: ICvContent): ICvContentDto {
    if (!content) {
      return {};
    }

    return {
      name: content.name,
      position: content.position,
      summary: content.summary,
      employmentType: content.employmentType,
      salary: content.salary,
      contacts: CvResponseMapper.toContactsResponse(content.contacts),
      portfolios: CvResponseMapper.toPortfoliosResponse(content.portfolios),
      experience: CvResponseMapper.toExperienceListResponse(content.experience),
      skills: content.skills ? [...content.skills] : [],
    };
  }

  private static toContactsResponse(
    contacts?: IContact,
  ): IContactDto | undefined {
    if (!contacts) return undefined;

    return {
      phone: contacts.phone,
      email: contacts.email,
      location: contacts.location,
      linkedin: contacts.linkedin,
    };
  }

  private static toPortfoliosResponse(
    portfolios?: IPortfolioLink[],
  ): IPortfolioLinkDto[] {
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
      startDate: exp.startDate ? exp.startDate.toISOString() : undefined,
      endDate: exp.endDate ? exp.endDate.toISOString() : undefined,
      description: exp.description,
    }));
  }
}
