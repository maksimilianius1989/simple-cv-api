import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateDraftRequestDto {
  @IsString()
  @MinLength(50)
  @MaxLength(2000)
  @IsNotEmpty()
  prompt!: string;
}
