import {
  AiProviderKey as PrismaAiProviderKey,
  AiProviderType as PrismaAiProviderType,
} from '@prisma/client';
import { AiProviderKey as DomainAiProviderKey } from '@ai/domain/entities/ai-provider-key.entity';
import { AiProviderType as DomainAiProviderType } from '@shared/domain/enums/ai-provider-type.enum';

export class PrismaAiProviderKeyMapper {
  static toDomain(row: PrismaAiProviderKey): DomainAiProviderKey {
    return new DomainAiProviderKey({
      id: row.id,
      value: row.value,
      provider: PrismaAiProviderTypeMapper.toDomain(row.provider),
      name: row.name,
      usageLimit: row.usageLimit,
      usedToday: row.usedToday,
      usageDate: row.usageDate,
      isActive: row.isActive,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt ?? undefined,
    });
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
