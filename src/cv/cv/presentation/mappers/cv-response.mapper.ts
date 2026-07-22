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
} from '@cv/domain/value-objects/cv-content.vo';

export class CvResponseMapper {
  static toResponse(cv: Cv): CvResponseDto {
    const dto = new CvResponseDto();

    dto.id = cv.id;
    dto.userId = cv.userId;
    dto.title = cv.title;
    dto.content = CvResponseMapper.toContentResponse(cv.content);
    dto.isPublished = cv.isPublished;
    dto.publishedAt = cv.publishedAt ? cv.publishedAt.toISOString() : undefined;
    dto.publishedUntil = cv.publishedUntil
      ? cv.publishedUntil.toISOString()
      : undefined;
    dto.viewsCount = cv.viewsCount;
    dto.publicSlug = cv.publicSlug;
    dto.coverLetter = cv.coverLetter;
    dto.createdAt = cv.createdAt ? cv.createdAt.toISOString() : undefined;
    dto.updatedAt = cv.updatedAt ? cv.updatedAt.toISOString() : undefined;

    return dto;
  }

  static toResponseList(cvs: Cv[]): CvResponseDto[] {
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
      template: content.template,
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
