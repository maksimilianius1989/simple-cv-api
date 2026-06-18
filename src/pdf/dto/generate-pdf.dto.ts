import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ExperienceDto } from './experience.dto';
import { RepositoryDto as RepositoryDto } from './repository.dto';
import { ContactDto } from './contact.dto';

export class GeneratePdfDto {
  @IsString()
  name?: string;

  @IsString()
  position?: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => ContactDto)
  contacts?: ContactDto;

  @IsString()
  @IsOptional()
  employmentType?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RepositoryDto)
  repositories?: RepositoryDto[];

  @IsString()
  @IsOptional()
  summary?: string;

  @IsArray()
  @IsOptional()
  skills?: string[];

  @IsString()
  template?: string;

  @IsString()
  @IsOptional()
  salary?: string;

  @IsString()
  @IsOptional()
  coverLetter?: string;

  @IsString()
  @IsOptional()
  avatar?: string | null;

  @IsString()
  @IsOptional()
  qr?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ExperienceDto)
  experience?: ExperienceDto[];
}
