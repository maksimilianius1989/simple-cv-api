import { Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString, Length } from 'class-validator';

export class CvPublishRequestDto {
  @IsString()
  @Length(3, 50, { message: 'Slug must be between 3 and 50 characters' })
  @IsOptional()
  readonly slug?: string;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value as string) : undefined))
  @IsDate({ message: 'Published At must be a valid date' })
  readonly publishedAt?: Date;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value as string) : undefined))
  @IsDate({ message: 'Published Until must be a valid date' })
  readonly publishedUntil?: Date;
}
