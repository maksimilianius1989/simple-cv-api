import { IsOptional, IsString } from 'class-validator';

export class ExperienceDto {
  @IsString()
  company!: string;

  @IsString()
  position!: string;

  @IsString()
  startDate!: string;

  @IsString()
  @IsOptional()
  endDate?: string;

  @IsString()
  description!: string;
}
