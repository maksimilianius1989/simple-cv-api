import { FILE_VALIDATION_RULES } from '@storage/domain/entities/file-validation.rules';
import { FileCategory } from '../../domain/enums/file-category.enum';
import { IsIn, IsOptional, IsUrl, IsUUID } from 'class-validator';

const ALLOWED_CATEGORIES = Object.keys(FILE_VALIDATION_RULES) as FileCategory[];
export class UploadFileDto {
  @IsIn(ALLOWED_CATEGORIES)
  category!: FileCategory;

  @IsUUID()
  cvId!: string;

  @IsOptional()
  @IsUrl()
  url?: string;
}
