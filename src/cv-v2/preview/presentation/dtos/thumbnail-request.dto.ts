import { IsNumber, IsOptional } from 'class-validator';

export class ThumbnailRequest {
  @IsNumber()
  @IsOptional()
  width?: number;
}
