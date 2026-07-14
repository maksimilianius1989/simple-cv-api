import { AiProviderType as PrismaProviderType } from '@prisma/client';
import { AiProviderType as DomainProviderType } from '@shared/domain/enums/ai-provider-type.enum';

export class AiProviderTypeMapper {
  static toDomain(type: PrismaProviderType): DomainProviderType {
    switch (type) {
      case PrismaProviderType.GEMINI:
        return DomainProviderType.GEMINI;

      case PrismaProviderType.OLLAMA:
        return DomainProviderType.OLLAMA;

      default:
        throw new Error(`Unknown persistance provider type: ${String(type)}`);
    }
  }

  static toPersistence(type: DomainProviderType): PrismaProviderType {
    const map: Record<DomainProviderType, PrismaProviderType> = {
      [DomainProviderType.OLLAMA]: PrismaProviderType.OLLAMA,
      [DomainProviderType.GEMINI]: PrismaProviderType.GEMINI,
    };

    return map[type];
  }
}
