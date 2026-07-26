import {
  IsFileMimeType,
  IsMaxFileSize,
} from '@shared/infrastructure/validators/file.validators';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateDraftRequest {
  @IsString()
  @MinLength(50)
  @MaxLength(2000)
  @IsNotEmpty()
  prompt!: string;

  @IsOptional()
  @IsMaxFileSize(5 * 1024 * 1024)
  @IsFileMimeType(['image/jpeg', 'image/png', 'image/webp'])
  file?: Express.Multer.File;
}
