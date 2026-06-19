import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ContactDto } from './contact.dto';
import { RepositoryDto } from './repository.dto';
import { ExperienceDto } from './experience.dto';

export class CreateCvDto {
  @IsString()
  name!: string;

  @IsString()
  position!: string;

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

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ExperienceDto)
  experience?: ExperienceDto[];
}
