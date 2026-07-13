import { AiProviderType } from '@shared/domain/enums/ai-provider-type.enum';
import { IsEnum, IsOptional } from 'class-validator';

export class AiGenerateDraftRequest {
  @IsEnum(AiProviderType)
  @IsOptional()
  provider!: AiProviderType;
}
