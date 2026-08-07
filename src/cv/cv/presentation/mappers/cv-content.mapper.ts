import {
  IContact,
  ICvContent,
  IExperience,
  IPortfolioLink,
} from '@shared/domain/value-objects/cv-content.vo';
import { CreateCvDto } from '../dtos/create-cv.dto';
import { ExperienceDto } from '../dtos/experience.dto';
import { PortfolioDto } from '../dtos/portfolio.dto';
import { ContactDto } from '../dtos/contact.dto';

export class CvMapper {
  static toDomainContent(dto: CreateCvDto): ICvContent {
    return {
      name: dto.name,
      position: dto.position,
      employmentType: dto.employmentType,
      summary: dto.summary,
      skills: dto.skills,
      salary: dto.salary,

      contacts: dto.contacts
        ? CvMapper.toContactDomain(dto.contacts)
        : undefined,

      portfolios: dto.portfolios
        ? dto.portfolios.map(
            (p: PortfolioDto): IPortfolioLink => CvMapper.toPortfolioDomain(p),
          )
        : undefined,

      experience: dto.experience
        ? dto.experience.map(
            (e: ExperienceDto): IExperience => CvMapper.toExperienceDomain(e),
          )
        : undefined,
    };
  }

  private static toContactDomain(dto: ContactDto): IContact {
    return {
      phone: dto.phone,
      email: dto.email,
      location: dto.location,
      linkedin: dto.linkedin,
    };
  }

  private static toPortfolioDomain(dto: PortfolioDto): IPortfolioLink {
    return {
      name: dto.name,
      url: dto.url,
    };
  }

  private static toExperienceDomain(dto: ExperienceDto): IExperience {
    return {
      company: dto.company,
      position: dto.position,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      description: dto.description,
    };
  }
}
