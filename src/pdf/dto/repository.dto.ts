import { IsString } from 'class-validator';

export class RepositoryDto {
  @IsString()
  name!: string;

  @IsString()
  url!: string;
}
