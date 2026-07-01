import { CvContent } from '@cv/domain/value-objects/cv-content.vo';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateCvDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsObject()
  @ValidateNested()
  @Type(() => CvContent as new () => CvContent)
  content!: CvContent;
}
