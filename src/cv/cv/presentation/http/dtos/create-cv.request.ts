import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import { ContactDto } from './contact.dto';
import { PortfolioDto } from './portfolio.dto';
import { ExperienceDto } from './experience.dto';
import {
  IsFileMimeType,
  IsMaxFileSize,
} from '@shared/infrastructure/validators/file.validators';

export class CreateCvRequest {
  @IsString()
  @Length(3, 50, { message: 'Name must be between 3 and 50 characters' })
  name!: string;

  @IsString()
  @Length(3, 50, { message: 'Position must be between 3 and 50 characters' })
  position!: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => ContactDto)
  contacts?: ContactDto;

  @IsString()
  @IsOptional()
  @Length(3, 50, {
    message: 'Employment type must be between 3 and 50 characters',
  })
  employmentType?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PortfolioDto)
  portfolios?: PortfolioDto[];

  @IsString()
  @IsOptional()
  @Length(50, 1500, {
    message: 'Summary must be between 50 and 1500 characters',
  })
  summary?: string;

  @IsArray()
  @IsOptional()
  skills?: string[];

  @IsUUID()
  @IsNotEmpty()
  templateId!: string;

  @IsString()
  @IsOptional()
  salary?: string;

  @IsString()
  @IsOptional()
  @Length(200, 4000, {
    message: 'Cover letter must be between 200 and 4000 characters',
  })
  coverLetter?: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @IsOptional()
  @IsMaxFileSize(5 * 1024 * 1024)
  @IsFileMimeType(['image/jpeg', 'image/png', 'image/webp'])
  file?: Express.Multer.File;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ExperienceDto)
  experience?: ExperienceDto[];
}
