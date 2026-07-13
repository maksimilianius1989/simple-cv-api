import { IsOptional, IsString } from 'class-validator';

export class CreatePdfRequestDto {
  @IsString()
  @IsOptional()
  template?: string;
}
