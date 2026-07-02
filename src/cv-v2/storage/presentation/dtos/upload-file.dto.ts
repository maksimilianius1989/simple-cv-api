import { FileCategory } from '../../domain/enums/file-category.enum';
import { IsEnum, IsOptional, IsUrl, IsUUID } from 'class-validator';

export class UploadFileDto {
  @IsEnum(FileCategory)
  category!: FileCategory;

  @IsUUID()
  cvId!: string;

  @IsOptional()
  @IsUrl()
  url?: string;
}
