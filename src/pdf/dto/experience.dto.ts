import { IsString } from 'class-validator';

export class ExperienceDto {
  @IsString()
  company!: string;

  @IsString()
  position!: string;

  @IsString()
  startDate!: string;

  @IsString()
  endDate!: string;

  @IsString()
  description!: string;
}
