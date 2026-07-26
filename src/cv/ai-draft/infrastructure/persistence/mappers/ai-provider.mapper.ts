import { AiProviderType as PrismaProviderType } from '@prisma/client';
import { AiProviderType as DomainProviderType } from '@shared/domain/enums/ai-provider-type.enum';

export class AiProviderTypeMapper {
  static toDomain(type: PrismaProviderType): DomainProviderType {
    const map: Record<PrismaProviderType, DomainProviderType> = {
      [PrismaProviderType.OLLAMA]: DomainProviderType.OLLAMA,
      [PrismaProviderType.GEMINI]: DomainProviderType.GEMINI,
    };

    return map[type];
  }

  static toPersistence(type: DomainProviderType): PrismaProviderType {
    const map: Record<DomainProviderType, PrismaProviderType> = {
      [DomainProviderType.OLLAMA]: PrismaProviderType.OLLAMA,
      [DomainProviderType.GEMINI]: PrismaProviderType.GEMINI,
    };

    return map[type];
  }
}
