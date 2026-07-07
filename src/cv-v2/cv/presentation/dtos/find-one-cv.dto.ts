import { IsUUID } from 'class-validator';

export class FindOneCvDto {
  @IsUUID('4')
  id!: string;
}
