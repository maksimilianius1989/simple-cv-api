import { IsDateString, IsOptional, IsString } from 'class-validator';

export class ExperienceDto {
  @IsString()
  company!: string;

  @IsString()
  position!: string;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  description!: string;
}
