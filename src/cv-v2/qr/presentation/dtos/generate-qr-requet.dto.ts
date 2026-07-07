import { IsNotEmpty, IsUrl } from 'class-validator';

export class GenerateQrRequestDto {
  @IsNotEmpty()
  @IsUrl({}, { message: 'Text must be the valid URL' })
  url!: string;
}
