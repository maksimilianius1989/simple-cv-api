import {
  AiProviderKey as PrismaAiProviderKey,
  AiProviderType as PrismaAiProviderType,
} from '@prisma/client';
import { AiProviderKey as DomainAiProviderKey } from '@ai/domain/entities/ai-provider-key.entity';
import { AiProviderType as DomainAiProviderType } from '@ai/domain/entities/ai-provider-key.entity';

export class PrismaAiProviderKeyMapper {
  static toDomain(row: PrismaAiProviderKey): DomainAiProviderKey {
    return new DomainAiProviderKey(
      row.id,
      row.value,
      row.name,
      PrismaAiProviderTypeMapper.toDomain(row.provider),
      row.usageLimit,
      row.usedToday,
      row.usageDate,
      row.isActive,
    );
  }
}

class PrismaAiProviderTypeMapper {
  static toDomain(type: PrismaAiProviderType): DomainAiProviderType {
    switch (type) {
      case PrismaAiProviderType.GEMINI:
        return DomainAiProviderType.GEMINI;

      case PrismaAiProviderType.OLLAMA:
        return DomainAiProviderType.OLLAMA;

      default:
        throw new Error(
          `Unknown persistance Ai provider type: ${type as string}`,
        );
    }
  }
}
