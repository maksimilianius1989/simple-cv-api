import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePdfRequestDto {
  @IsString()
  @IsNotEmpty()
  cvId!: string;

  @IsString()
  @IsOptional()
  template?: string;
}
